import React from 'react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 px-4">
      {/* Glass Card */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10 text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-cyan-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.055 3.378c.866-1.5 3.032-1.5 3.898 0l7.35 12.747z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Thông báo bảo trì hệ thống
          </h1>

          {/* Description */}
          <p className="text-slate-300 leading-relaxed">
            Hệ thống đang trong quá trình{' '}
            <span className="text-cyan-300 font-medium">kiểm tra chất lượng và đánh giá AI </span>
            nhằm đảm bảo độ tin cậy, minh bạch và trải nghiệm tốt nhất cho người dùng.
          </p>

          <p className="text-slate-400 text-sm">
            Vui lòng quay lại sau. Cảm ơn bạn đã kiên nhẫn 🤍
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Footer */}
          <div className="text-xs text-slate-500">
            © 2026 AI Trust Evaluation Platform · Secure · Human-Centered · Reliable
          </div>
        </div>
      </div>
    </div>
  );
}
