import { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import MainWorkspace from './components/MainWorkspace';
import TeacherPanel from './components/TeacherPanel';
import ActionBar from './components/ActionBar';
import ApiSettingsModal from './components/ApiSettingsModal';
import { copyToClipboard, downloadTxt, downloadDocx } from './utils/download';
import { DEFAULT_API_SETTINGS } from './config';
import { SYSTEM_PROMPT } from '../../server/prompts/system';
import { getGradePrompt } from '../../server/prompts/grades';
import skillContent from '../../server/skills/luoji-teacher-skill.md?raw';

const API_SETTINGS_STORAGE_KEY = 'luoji-teacher-api-settings';

const BRIEF_MODE_PROMPT = `简略版优化模式：
- 输出更简洁，整体长度必须明显短于详细版。
- 不要大幅扩写原文，不要疯狂增加段落。
- 不强行增加比喻，不强行增加情绪。
- 保持真人老师的课堂自然表达，保留轻幽默、老师味和节奏感。
- 保持罗辑老师风格，但表达要克制、短促、自然。
- 如果原文只有一句话，优化后最多输出 3 句话。`;

function loadApiSettings() {
  try {
    const saved = window.localStorage.getItem(API_SETTINGS_STORAGE_KEY);
    return saved ? { ...DEFAULT_API_SETTINGS, ...JSON.parse(saved) } : DEFAULT_API_SETTINGS;
  } catch {
    return DEFAULT_API_SETTINGS;
  }
}

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [grade, setGrade] = useState('3-4');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [apiSettings, setApiSettings] = useState(loadApiSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const abortRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleOptimize = useCallback(async (optimizationMode = 'detailed') => {
    if (!input.trim() || loading) return;

    if (!apiSettings.apiKey.trim()) {
      setError('请先在右上角「API 设置」中配置 API KEY');
      setSettingsOpen(true);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const apiBase = (apiSettings.baseUrl || DEFAULT_API_SETTINGS.baseUrl).replace(/\/$/, '');
      const model = apiSettings.model || DEFAULT_API_SETTINGS.model;
      const systemMessage = skillContent
        ? `${SYSTEM_PROMPT}\n\n---\n\n${skillContent}`
        : SYSTEM_PROMPT;
      const modePrompt = optimizationMode === 'brief' ? `\n\n---\n\n${BRIEF_MODE_PROMPT}` : '';
      const userMessage = `${getGradePrompt(grade)}${modePrompt}\n\n---\n\n请优化以下课程讲解脚本：\n\n${input.trim()}`;

      const res = await fetch(`${apiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiSettings.apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage },
          ],
          stream: true,
          temperature: 0.75,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        let msg = errText;
        try {
          const j = JSON.parse(errText);
          msg = j.error || msg;
        } catch {
          /* plain text */
        }
        throw new Error(msg || `请求失败 (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              setOutput(accumulated);
            }
          } catch {
            /* skip malformed SSE chunk */
          }
        }
      }

      if (!accumulated.trim()) {
        setError('模型未返回内容，请检查 API Key 与网络');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message || '优化失败，请稍后重试');
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [input, grade, loading, apiSettings]);

  const handleSaveApiSettings = (nextSettings) => {
    const normalized = {
      apiKey: nextSettings.apiKey.trim(),
      baseUrl: (nextSettings.baseUrl || DEFAULT_API_SETTINGS.baseUrl).trim(),
      model: (nextSettings.model || DEFAULT_API_SETTINGS.model).trim(),
    };

    setApiSettings(normalized);
    window.localStorage.setItem(API_SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
    setSettingsOpen(false);
    showToast('API 设置已保存');
  };

  const handleClearApiSettings = () => {
    setApiSettings(DEFAULT_API_SETTINGS);
    window.localStorage.removeItem(API_SETTINGS_STORAGE_KEY);
    showToast('API 设置已清空');
  };

  const handleClear = () => {
    abortRef.current?.abort();
    setInput('');
    setOutput('');
    setError('');
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!output.trim()) return;
    try {
      await copyToClipboard(output);
      showToast('已复制到剪贴板');
    } catch {
      showToast('复制失败，请手动选择复制');
    }
  };

  const handleDownloadTxt = () => {
    if (!output.trim()) return;
    downloadTxt(output);
    showToast('已下载 txt 文件');
  };

  const handleDownloadDocx = async () => {
    if (!output.trim()) return;
    try {
      await downloadDocx(output);
      showToast('已下载 docx 文件');
    } catch {
      showToast('docx 生成失败');
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header
        hasApiKey={!!apiSettings.apiKey.trim()}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex min-h-0 flex-1 gap-0 px-4 pb-4">
        {/* 左侧主工作区 */}
        <main className="flex min-w-0 flex-1 flex-col gap-0 overflow-hidden pr-3">
          <MainWorkspace
            input={input}
            output={output}
            onInputChange={setInput}
            loading={loading}
            error={error}
          />
          <ActionBar
            onOptimize={handleOptimize}
            onClear={handleClear}
            onCopy={handleCopy}
            onDownloadTxt={handleDownloadTxt}
            onDownloadDocx={handleDownloadDocx}
            loading={loading}
            hasOutput={!!output.trim()}
            hasInput={!!input.trim()}
          />
        </main>

        {/* 右侧罗辑老师区域 */}
        <TeacherPanel grade={grade} onGradeChange={setGrade} />
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#2c3e50]/90 px-5 py-2.5 text-sm text-white shadow-lg backdrop-blur-sm">
          {toast}
        </div>
      )}

      <ApiSettingsModal
        open={settingsOpen}
        settings={apiSettings}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveApiSettings}
        onClear={handleClearApiSettings}
      />
    </div>
  );
}
