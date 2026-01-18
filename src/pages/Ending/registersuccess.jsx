import React, { useEffect } from 'react';
import UserApi from '../../api/UserApi';
const MailIcon = () => (
  <svg
    className="w-16 h-16 text-blue-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);

const RegisterSuccess = () => {
  const info = JSON.parse(localStorage.getItem('registerInfo'));
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await UserApi.checkLogin(info.username, info.password);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="relative bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center">
        {/* Badge */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2
                 bg-blue-500 text-white text-sm font-semibold
                 px-4 py-1 rounded-full shadow"
        >
          Đăng ký thành công
        </div>

        {/* Icon */}
        <div className="flex justify-center mt-6 mb-4">
          <MailIcon />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Chúc mừng! 🎉</h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Tài khoản của bạn đã được tạo thành công.
          <br />
          Vui lòng sử dụng thông tin bên dưới để đăng nhập và bắt đầu làm khảo sát.
        </p>

        {/* Credentials box */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left mb-6 space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Username</p>
            <p className="font-mono text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border">
              {info.username}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Password</p>
            <p className="font-mono text-sm text-gray-800 bg-white px-3 py-2 rounded-lg border">
              {info.password}
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={(e) => handleLogin(e)}
          className="w-full inline-block bg-blue-500 text-white py-2.5 rounded-xl
                 font-semibold hover:bg-blue-600 transition"
        >
          Đăng nhập ngay
        </button>
      </div>
    </div>
  );
};

export default RegisterSuccess;
