/**
 * 罗辑老师人物图 — 替换此 URL 即可更换右侧形象
 */
export const TEACHER_IMAGE_URL = '/luoji.png';

/** 生产环境 API 地址（Vercel 环境变量 VITE_API_BASE_URL），开发环境留空走 Vite 代理 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const GRADE_OPTIONS = [
  { key: '1-2', label: '1-2年级风格' },
  { key: '3-4', label: '3-4年级风格' },
  { key: '5-6', label: '5-6年级风格' },
];
