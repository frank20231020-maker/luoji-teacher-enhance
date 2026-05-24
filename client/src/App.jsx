import { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import MainWorkspace from './components/MainWorkspace';
import TeacherPanel from './components/TeacherPanel';
import ActionBar from './components/ActionBar';
import { copyToClipboard, downloadTxt, downloadDocx } from './utils/download';
import { API_BASE_URL } from './config';

export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [grade, setGrade] = useState('3-4');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const abortRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleOptimize = useCallback(async () => {
    if (!input.trim() || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input, grade }),
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setOutput(accumulated);
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
  }, [input, grade, loading]);

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
      <Header />

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
    </div>
  );
}
