import { Router } from 'express';
import { SYSTEM_PROMPT } from '../prompts/system.js';
import { getGradePrompt } from '../prompts/grades.js';

const router = Router();

const API_BASE = process.env.OPENAI_BASE_URL || 'https://newapi.yuaiweiwu.com/v1';
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-5-5';

router.post('/optimize', async (req, res) => {
  const { text, grade = '3-4' } = req.body || {};

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: '请输入需要优化的脚本内容' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: '未配置 OPENAI_API_KEY，请查看 .env.example' });
  }

  const gradePrompt = getGradePrompt(grade);
  const userMessage = `${gradePrompt}\n\n---\n\n请优化以下课程讲解脚本：\n\n${text.trim()}`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  try {
    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
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
