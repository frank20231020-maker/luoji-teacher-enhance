import { useEffect, useState } from 'react';
import { DEFAULT_API_SETTINGS } from '../config';

export default function ApiSettingsModal({ open, settings, onClose, onSave, onClear }) {
  const [form, setForm] = useState(settings);

  useEffect(() => {
    if (open) setForm(settings);
  }, [open, settings]);

  if (!open) return null;

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(form);
  };

  const handleClear = () => {
    setForm(DEFAULT_API_SETTINGS);
    onClear();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#1f2d3d]/30 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl shadow-blue-200/40">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#2c3e50]">API 设置</h2>
            <p className="mt-1 text-sm leading-6 text-[#5a6b7d]">
              配置会保存在当前浏览器，只用于你本机请求公司模型接口。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-xl leading-none text-[#7b8a9a] transition hover:bg-[#F3FAFF] hover:text-[#2c3e50]"
            aria-label="关闭 API 设置"
          >
            ×
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-[#2c3e50]">API KEY</span>
            <input
              type="password"
              value={form.apiKey}
              onChange={(event) => updateField('apiKey', event.target.value)}
              placeholder="请输入公司提供的 API KEY"
              className="mt-2 w-full rounded-2xl border border-[#D8E7F5] bg-[#F8FBFF] px-4 py-3 text-sm text-[#2c3e50] outline-none transition focus:border-[#6FB8FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#2c3e50]">Base URL</span>
            <input
              type="url"
              value={form.baseUrl}
              onChange={(event) => updateField('baseUrl', event.target.value)}
              placeholder={DEFAULT_API_SETTINGS.baseUrl}
              className="mt-2 w-full rounded-2xl border border-[#D8E7F5] bg-[#F8FBFF] px-4 py-3 text-sm text-[#2c3e50] outline-none transition focus:border-[#6FB8FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#2c3e50]">Model</span>
            <input
              type="text"
              value={form.model}
              onChange={(event) => updateField('model', event.target.value)}
              placeholder={DEFAULT_API_SETTINGS.model}
              className="mt-2 w-full rounded-2xl border border-[#D8E7F5] bg-[#F8FBFF] px-4 py-3 text-sm text-[#2c3e50] outline-none transition focus:border-[#6FB8FF] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div className="rounded-2xl bg-[#F3FAFF] px-4 py-3 text-xs leading-5 text-[#5a6b7d]">
            API KEY 只保存在本机浏览器的 localStorage 中。请不要把已填写密钥的浏览器环境共享给他人。
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl px-4 py-2 text-sm font-medium text-[#7b8a9a] transition hover:bg-[#F6F8FA] hover:text-[#2c3e50]"
            >
              清空设置
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#D8E7F5] bg-white px-4 py-2 text-sm font-medium text-[#5a6b7d] transition hover:bg-[#F6F8FA]"
              >
                取消
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#6FB8FF] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-200/60 transition hover:bg-[#5AAEFF]"
              >
                保存设置
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
