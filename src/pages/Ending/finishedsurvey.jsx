import React from 'react';

const HeartCheckIcon = () => (
  <svg
    className="w-16 h-16 text-emerald-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.8 4.6c-1.6-1.6-4.2-1.6-5.8 0L12 7.6l-3-3c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8L12 21l8.8-10.6c1.6-1.6 1.6-4.2 0-5.8z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const SurveyCompleted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4">
      <div className="relative bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center">
        {/* Badge */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2
                     bg-emerald-500 text-white text-sm font-semibold
                     px-4 py-1 rounded-full shadow"
        >
          Hoàn thành khảo sát
        </div>

        {/* Icon */}
        <div className="flex justify-center mt-6 mb-4">
          <HeartCheckIcon />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Cảm ơn bạn rất nhiều!</h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Bạn đã hoàn thành toàn bộ khảo sát một cách xuất sắc.
          <br />
          Những phản hồi của bạn có giá trị vô cùng quan trọng và sẽ đóng góp trực tiếp vào quá
          trình nghiên cứu và phát triển các hệ thống
          <span className="font-medium text-gray-700"> AI đáng tin cậy hơn cho con người</span>.
          <br />
          <br />
          Chúng tôi trân trọng sự thời gian và tâm huyết mà bạn đã dành cho khảo sát này 💙
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-6" />

        {/* Button */}
        <a
          href="/login"
          className="w-full inline-block border border-gray-300 py-2.5 rounded-xl
                     font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
};

export default SurveyCompleted;
