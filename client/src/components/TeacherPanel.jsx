import { TEACHER_IMAGE_URL, GRADE_OPTIONS } from '../config';

export default function TeacherPanel({ grade, onGradeChange }) {
  return (
    <aside className="relative flex h-full w-[300px] shrink-0 flex-col self-stretch overflow-hidden border-l border-white/20 xl:w-[320px]">
      {/* 蓝白渐变 + 科技感光晕背景 */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#d4ecff] via-[#eaf7ff] to-[#c8e4ff]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 top-1/4 h-48 w-48 rounded-full bg-[#6FB8FF]/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-8 bottom-1/4 h-40 w-40 rounded-full bg-[#5DA9FF]/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-white/10 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      {/* 年级风格按钮 */}
      <div className="relative z-10 shrink-0 px-4 pb-2 pt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#5a6b7d]/80">
          年级风格
        </p>
        <div className="flex flex-col gap-2">
          {GRADE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onGradeChange(opt.key)}
              className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                grade === opt.key
                  ? 'bg-gradient-to-r from-[#6FB8FF] to-[#5DA9FF] text-white shadow-md shadow-blue-300/40'
                  : 'border border-white/60 bg-white/40 text-[#2c3e50] backdrop-blur-sm hover:border-[#5DA9FF]/40 hover:bg-white/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 罗辑老师人物图 — 占满剩余区域，视觉焦点 */}
      <div className="relative z-10 flex min-h-0 flex-1 items-end justify-center px-2 pb-2">
        <img
          src={TEACHER_IMAGE_URL}
          alt="罗辑老师"
          className="h-full w-full object-contain object-bottom"
        />
      </div>
    </aside>
  );
}
