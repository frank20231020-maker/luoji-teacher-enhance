export default function MainWorkspace({
  input,
  output,
  onInputChange,
  loading,
  error,
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/40 shadow-lg shadow-blue-100/40 backdrop-blur-md">
      {/* 原始脚本输入区 */}
      <div className="flex min-h-0 flex-1 flex-col border-b border-white/40">
        <label className="shrink-0 px-4 pt-3 pb-1 text-xs font-semibold text-[#5a6b7d]">
          原始脚本
          <span className="ml-2 font-normal text-[#5DA9FF]/80">支持一句话、段落或整节课长文本</span>
        </label>
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="粘贴或输入需要优化的课程讲解脚本…&#10;&#10;例如：我们接下来求速度和。"
          disabled={loading}
          className="scroll-gentle min-h-[140px] flex-1 resize-none border-0 bg-transparent px-4 pb-3 text-[15px] leading-[1.85] text-[#2c3e50] placeholder:text-[#5a6b7d]/50 focus:outline-none focus:ring-0 disabled:opacity-60"
          spellCheck={false}
        />
      </div>

      {/* 优化后讲解输出区 */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <label className="shrink-0 px-4 pt-3 pb-1 text-xs font-semibold text-[#5a6b7d]">
          优化后讲稿
          {loading && (
            <span className="ml-2 font-normal text-[#5DA9FF]">流式生成中…</span>
          )}
        </label>

        <div
          className={`scroll-gentle min-h-[140px] flex-1 overflow-y-auto px-4 pb-4 ${
            loading && !output ? 'loading-shimmer' : ''
          }`}
        >
          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : output ? (
            <pre
              className={`whitespace-pre-wrap font-sans text-[15px] leading-[1.9] tracking-wide text-[#2c3e50] ${
                loading ? 'streaming-cursor' : ''
              }`}
            >
              {output}
            </pre>
          ) : (
            <p className="text-[15px] leading-[1.9] text-[#5a6b7d]/45">
              优化后的名师讲稿将在这里流式呈现…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
