import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import UserApi from '../../api/UserApi';
export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const validate = () => {
    if (!email.trim()) return 'Vui lòng nhập email.';
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!re.test(email)) return 'Email không hợp lệ.';
    if (!password) return 'Vui lòng nhập mật khẩu.';
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await UserApi.checkLogin(email, password);

      if (res.status) {
        const token_user = [{ token: 'active', userID: res.userid, typeoftest: res.typeOfTest }];
        localStorage.setItem('token', JSON.stringify(token_user));

        if (res.role === 'user') {
          if (res.doTest === true) {
            window.location.href = '/finishedsurvey';
          } else {
            window.location.href = '/userinfo';
          }
        } else if (res.role === 'admin') {
          window.location.href = '/dashboard';
        }
      } else {
        alert(res.message);
      }
      // điều hướng sang homepage
    } catch (err) {
      console.log('Error:', err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4
                  bg-gradient-to-br from-slate-50 via-cyan-50 to-emerald-50"
    >
      {/* Glass Container */}
      <div className="w-full max-w-md">
        <div
          className="relative rounded-3xl border border-white/40
                   bg-white/60 backdrop-blur-xl
                   shadow-2xl p-8"
        >
          {/* Glow */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32
                        bg-cyan-300/30 rounded-full blur-3xl"
          />
          <div
            className="absolute -bottom-10 -left-10 w-32 h-32
                        bg-emerald-300/30 rounded-full blur-3xl"
          />

          {/* Header */}
          <div className="relative text-center mb-8">
            <div
              className="mx-auto w-14 h-14 rounded-2xl
                       bg-gradient-to-br from-slate-700 to-cyan-600
                       flex items-center justify-center
                       text-white text-xl font-semibold shadow-lg"
            >
              AI
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-slate-900">AI Platform</h2>

            <p className="mt-1 text-sm text-slate-600">
              Đảm bảo quyền truy cập vào nền tảng đánh giá AI.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ai-platform.com"
                className="w-full px-4 py-2.5 rounded-xl
                         bg-white/70 border border-slate-200
                         text-slate-800
                         focus:outline-none focus:ring-2
                         focus:ring-cyan-400 focus:border-cyan-400
                         transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl
                           bg-white/70 border border-slate-200
                           text-slate-800
                           focus:outline-none focus:ring-2
                           focus:ring-cyan-400 focus:border-cyan-400
                           transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                           text-slate-500 hover:text-cyan-600
                           transition"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-300 text-cyan-600
                           focus:ring-cyan-500"
                />
                Ghi nhớ mật khẩu
              </label>

              <a className="text-cyan-700 hover:text-cyan-600 cursor-pointer">Quên mật khẩu?</a>
            </div>

            {error && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-xl">{error}</p>}

            {/* Login button */}
            <button
              disabled={loading}
              className="w-full py-3 rounded-xl
                       bg-gradient-to-r from-emerald-500 to-cyan-500
                       text-white font-medium
                       shadow-lg
                       hover:from-emerald-600 hover:to-cyan-600
                       transition-all active:scale-95
                       disabled:opacity-60"
            >
              {loading ? 'Đang xác minh...' : 'Đăng nhập'}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-slate-600 pt-4">
              New evaluator?{' '}
              <a
                href="/userregister"
                className="text-cyan-700 font-medium cursor-pointer hover:underline"
              >
                Register Account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
