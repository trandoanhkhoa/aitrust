import React from 'react';

const CheckIcon = () => (
  <svg
    className="w-16 h-16 text-green-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l2.5 2.5L16 9" />
  </svg>
);

const TestCompleted = ({ onRestart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
      <div className="relative bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center">
        {/* Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full shadow">
          Hoàn thành
        </div>

        {/* Icon */}
        <div className="flex justify-center mt-6 mb-4">
          <CheckIcon />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bài test đã hoàn thành!</h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Cảm ơn bạn đã dành thời gian hoàn thành bài kiểm tra. Kết quả của bạn đã được hệ thống ghi
          nhận thành công.
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-6" />

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {/* <button
            onClick={onRestart}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium
                       hover:bg-blue-700 hover:scale-[1.02] transition-transform"
          >
            Làm lại bài test
          </button> */}

          <a
            href="#"
            className="w-full border border-gray-300 py-2.5 rounded-xl font-medium
                       text-gray-700 hover:bg-gray-100 transition"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestCompleted;
