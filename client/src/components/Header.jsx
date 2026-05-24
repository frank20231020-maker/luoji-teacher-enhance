export default function Header() {
  return (
    <header className="shrink-0 px-6 pt-6 pb-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6FB8FF] to-[#9DD1FF] shadow-md shadow-blue-200/50">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#2c3e50] sm:text-2xl">
            《罗辑老师真人感语言表达增强》
          </h1>
          <p className="mt-1 text-sm text-[#5a6b7d] sm:text-base">
            让 AI 课脚本更像真人名师在讲课
          </p>
        </div>
      </div>
    </header>
  );
}
