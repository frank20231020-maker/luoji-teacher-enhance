const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50';

export default function ActionBar({
  onOptimize,
  onClear,
  onCopy,
  onDownloadTxt,
  onDownloadDocx,
  loading,
  hasOutput,
  hasInput,
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-3 border-t border-white/40 bg-white/20 px-4 py-3 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => onOptimize('brief')}
        disabled={loading || !hasInput}
        className={`${btnBase} bg-gradient-to-r from-[#6FB8FF] to-[#5DA9FF] text-white shadow-md shadow-blue-300/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-300/50 active:translate-y-0`}
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            优化中…
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            简略版优化
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => onOptimize('detailed')}
        disabled={loading || !hasInput}
        className={`${btnBase} border border-[#5DA9FF]/30 bg-white/60 text-[#2c3e50] hover:border-[#5DA9FF]/50 hover:bg-white/90 hover:-translate-y-0.5`}
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#5DA9FF]/30 border-t-[#5DA9FF]" />
            优化中…
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            详细版优化
          </>
        )}
      </button>

      <button
        type="button"
        onClick={onClear}
        disabled={loading}
        className={`${btnBase} border border-[#5DA9FF]/30 bg-white/60 text-[#2c3e50] hover:border-[#5DA9FF]/50 hover:bg-white/90 hover:-translate-y-0.5`}
      >
        清空
      </button>

      <button
        type="button"
        onClick={onCopy}
        disabled={!hasOutput}
        className={`${btnBase} border border-[#5DA9FF]/30 bg-white/60 text-[#2c3e50] hover:border-[#5DA9FF]/50 hover:bg-white/90 hover:-translate-y-0.5`}
      >
        复制结果
      </button>

      <button
        type="button"
        onClick={onDownloadTxt}
        disabled={!hasOutput}
        className={`${btnBase} border border-[#5DA9FF]/30 bg-white/60 text-[#2c3e50] hover:border-[#5DA9FF]/50 hover:bg-white/90 hover:-translate-y-0.5`}
      >
        下载 txt
      </button>

      <button
        type="button"
        onClick={onDownloadDocx}
        disabled={!hasOutput}
        className={`${btnBase} border border-[#5DA9FF]/30 bg-white/60 text-[#2c3e50] hover:border-[#5DA9FF]/50 hover:bg-white/90 hover:-translate-y-0.5`}
      >
        下载 docx
      </button>
    </div>
  );
}
