import { useState, useEffect, useRef } from 'react';
import UserApi from '../../../api/UserApi';
import SettingTest from '../../../api/SettingTest';

export default function Topbar() {
  const [thongBao, setThongBao] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [settingtest, setSettingtest] = useState(null);
  const [loadingSetting, setLoadingSetting] = useState(true);
  const isSubmittingRef = useRef(false);

  /* ================== HELPERS ================== */
  const getAnswersFromStorage = () => {
    try {
      const data = JSON.parse(localStorage.getItem('Itemquestion'));
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const validateAnswers = (answers) => {
    for (let i = 0; i < answers.length; i++) {
      const ans = String(answers[i].useranswer || '').trim();
      if (!ans) {
        return `⚠️ Bạn chưa làm câu hỏi số ${i + 1}`;
      }
    }
    return null;
  };

  const buildPayload = (answers, userId) => {
    const now = new Date();

    // Giờ Việt Nam (GMT+7)
    const submittedAtVN = new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString();

    return {
      userId,
      answers: answers.map((a) => ({
        questionId: a.idquestion,
        userAnswer: a.useranswer,
        tryTimes: a.trytimes,
        useTime: settingtest?.time,
        startedAt: localStorage.getItem('currentTime'), // đã lưu trước đó
        submittedAt: submittedAtVN,
      })),
    };
  };

  const findFirstUnansweredIndex = (answers) => {
    return answers.findIndex((a) => !a.useranswer || a.useranswer.trim() === '');
  };
  const warnIfUnfinishedWithTime = (answers, timeLeft) => {
    const index = findFirstUnansweredIndex(answers);

    if (index !== -1 && timeLeft > 0) {
      return `⚠️ Bạn chưa làm câu hỏi số ${index + 1}. Bạn vẫn còn thời gian!`;
    }

    return null;
  };
  /* ================== SUBMIT ================== */
  const handleSubmitTest = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const answers = getAnswersFromStorage();
    const userInfo = JSON.parse(localStorage.getItem('token'));

    if (!userInfo?.[0]?.userID) {
      setThongBao('❌ Không tìm thấy thông tin người dùng');
      isSubmittingRef.current = false;
      return;
    }

    if (!answers.length) {
      setThongBao('⚠️ Không có dữ liệu bài làm');
      isSubmittingRef.current = false;
      return;
    }

    // ✅ CHỈ CHECK KHI KHÔNG GIỚI HẠN VÀ CÓ THỜI GIAN
    if (settingtest?.time === false) {
      const error = validateAnswers(answers);
      if (error) {
        setThongBao(error);
        isSubmittingRef.current = false;
        return;
      }
    }

    // ⚠️ CÓ thời gian + còn thời gian → cảnh báo
    if (settingtest?.time === true) {
      const warning = warnIfUnfinishedWithTime(answers, timeLeft);
      if (warning) {
        setThongBao(warning);
        isSubmittingRef.current = false;
        return;
      }
    }

    const payload = buildPayload(answers, userInfo[0].userID);

    try {
      setThongBao('📤 Đang nộp bài...');
      const res = await UserApi.submitTest(payload);

      if (res?.status === true) {
        localStorage.removeItem('Itemquestion');
        localStorage.removeItem('endTime');

        setTimeout(() => {
          window.location.href = '/survey';
        }, 800);
      } else {
        setThongBao('❌ Nộp bài không thành công');
        isSubmittingRef.current = false;
      }
    } catch (err) {
      console.error(err);
      setThongBao('❌ Có lỗi xảy ra khi nộp bài');
      isSubmittingRef.current = false;
    }
  };

  /* ================== LOAD SETTING ================== */
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await SettingTest.getsetting();
        setSettingtest(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSetting(false);
      }
    };
    fetchSetting();
  }, []);

  /* ================== AUTO CLEAR THÔNG BÁO ================== */
  useEffect(() => {
    if (!thongBao) return;
    const t = setTimeout(() => setThongBao(''), 3000);
    return () => clearTimeout(t);
  }, [thongBao]);

  /* ================== TIMER ================== */
  useEffect(() => {
    if (loadingSetting) return;
    if (!settingtest?.time) {
      setTimeLeft(0);
      localStorage.removeItem('endTime');
      return;
    }

    const totalSeconds = settingtest.timelimit * 60;
    let endTime = Number(localStorage.getItem('endTime'));

    if (!endTime || isNaN(endTime)) {
      endTime = Date.now() + totalSeconds * 1000;
      localStorage.setItem('endTime', endTime);
    }

    const interval = setInterval(() => {
      const remaining = Math.floor((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        localStorage.removeItem('endTime');
        handleSubmitTest(); // ⏰ auto submit
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settingtest, loadingSetting]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  /* ================== UI ================== */
  return (
    <>
      <div className="relative flex items-center gap-4">
        {/* ALERT */}
        {thongBao && (
          <div
            className="
          absolute
          right-0
          top-14
          z-50
          min-w-[300px]
          max-w-sm
          px-5 py-3
          rounded-2xl
          bg-slate-800/70
          backdrop-blur-xl
          border border-cyan-400/30
          text-slate-100
          text-sm font-medium
          shadow-[0_10px_30px_rgba(0,0,0,0.35)]
          transition-all duration-300
        "
          >
            <div className="flex items-start gap-2">
              <span className="leading-relaxed">{thongBao}</span>
            </div>
          </div>
        )}
      </div>

      {/* <div className="relative w-full h-16 bg-white border-b flex items-center justify-between px-6">
        <h2 className="hidden md:block text-xl font-semibold">AI Dashboard</h2>

        <span className="md:hidden text-lg font-semibold">🤖</span>

        {settingtest?.time && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <div
              className={`px-5 py-2 rounded-full font-bold text-lg shadow-inner
            ${
              timeLeft <= 300
                ? 'bg-red-100 text-red-600 animate-pulse'
                : 'bg-gray-100 text-gray-800'
            }`}
            >
              ⏳ {formatTime(timeLeft)}
            </div>
          </div>
        )}

        <button
          onClick={() => handleSubmitTest(false)}
          disabled={isSubmittingRef.current}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-60"
        >
          Nộp bài
        </button>
      </div> */}
      <div
        className="w-full h-16 bg-white border-b px-4 md:px-6
                grid grid-cols-[auto_1fr_auto] items-center"
      >
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <h2 className="hidden md:block text-xl font-semibold">AI Dashboard</h2>
          <span className="md:hidden text-lg font-semibold">🤖</span>
        </div>

        {/* CENTER */}
        {settingtest?.time && (
          <div className="flex justify-center">
            <div
              className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full font-bold
        text-base md:text-lg shadow-inner
        ${timeLeft <= 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-800'}`}
            >
              ⏳ {formatTime(timeLeft)}
            </div>
          </div>
        )}

        {/* RIGHT */}
        <div className="flex justify-end">
          <button
            onClick={() => handleSubmitTest(false)}
            disabled={isSubmittingRef.current}
            className="px-4 md:px-5 py-2.5 rounded-xl
                 bg-gradient-to-r from-blue-600 to-indigo-600
                 text-white font-semibold shadow-md hover:shadow-lg
                 disabled:opacity-60"
          >
            Nộp bài
          </button>
        </div>
      </div>
    </>
  );
}
