import { Router } from 'express';
import { SYSTEM_PROMPT } from '../prompts/system.js';
import { getGradePrompt } from '../prompts/grades.js';
import { loadSkill } from '../utils/loadSkill.js';

const router = Router();

const API_BASE = process.env.OPENAI_BASE_URL || 'https://newapi.yuaiweiwu.com/v1';
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-5-5';

const OPTIMIZATION_MODES = new Set(['brief', 'detailed']);

const BRIEF_MODE_PROMPT = `简略版优化模式：
- 输出更简洁，整体长度必须明显短于详细版。
- 不要大幅扩写原文，不要疯狂增加段落。
- 不强行增加比喻，不强行增加情绪。
- 保持真人老师的课堂自然表达，保留轻幽默、老师味和节奏感。
- 保持罗辑老师风格，但表达要克制、短促、自然。
- 如果原文只有一句话，优化后最多输出 3 句话。`;

function cleanValue(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getOptimizationMode(value) {
  const mode = cleanValue(value);
  return OPTIMIZATION_MODES.has(mode) ? mode : 'detailed';
}

router.post('/optimize', async (req, res) => {
  const { text, grade = '3-4' } = req.body || {};
  const requestApiKey = cleanValue(req.body?.apiKey);
  const requestBaseUrl = cleanValue(req.body?.baseUrl);
  const requestModel = cleanValue(req.body?.model);
  const apiKey = requestApiKey || API_KEY;
  const apiBase = (requestBaseUrl || API_BASE).replace(/\/$/, '');
  const model = requestModel || MODEL;
  const optimizationMode = getOptimizationMode(req.body?.optimizationMode);

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: '请输入需要优化的脚本内容' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: '请在页面 API 设置中配置 API KEY，或配置 server/.env' });
  }

  const gradePrompt = getGradePrompt(grade);
  const skillContent = loadSkill();
  console.log('Skill Loaded:', skillContent.slice(0, 100));

  const systemMessage = skillContent
    ? `${SYSTEM_PROMPT}\n\n---\n\n${skillContent}`
    : SYSTEM_PROMPT;
  const modePrompt = optimizationMode === 'brief' ? `\n\n---\n\n${BRIEF_MODE_PROMPT}` : '';
  const userMessage = `${gradePrompt}${modePrompt}\n\n---\n\n请优化以下课程讲解脚本：\n\n${text.trim()}`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
    });

    if (!response.ok) {
      const errText = await response.text();
      let message = `模型请求失败 (${response.status})`;
      try {
        const parsed = JSON.parse(errText);
        message = parsed.error?.message || parsed.message || message;
      } catch {
        if (errText) message = errText.slice(0, 200);
      }
      res.status(response.status);
      res.write(message);
      return res.end();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
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
            res.write(delta);
            if (typeof res.flush === 'function') res.flush();
          }
        } catch {
          // skip malformed SSE chunk
        }
      }
    }

    res.end();
  } catch (err) {
    console.error('Optimize error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message || '服务内部错误' });
    }
    res.write(`\n\n[错误] ${err.message}`);
    res.end();
  }
});

export default router;
