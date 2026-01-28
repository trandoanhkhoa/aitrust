import { useState, useRef } from 'react';
import UserApi from '../../api/UserApi';

export default function useSubmitTest(settingtest = false, timeLeft) {
  const [thongBao, setThongBao] = useState('');
  const clearThongBao = () => setThongBao('');
  const isSubmittingRef = useRef(false);

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
      if (!String(answers[i].useranswer || '').trim()) {
        return `⚠️ Bạn chưa làm câu hỏi số ${i + 1}`;
      }
    }
    return null;
  };

  const buildPayload = (answers, userId) => {
    const submittedAtVN = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString();

    return {
      userId,
      answers: answers.map((a) => ({
        questionId: a.idquestion,
        userAnswer: a.useranswer,
        tryTimes: a.trytimes,
        useTime: settingtest?.time,
        startedAt: localStorage.getItem('currentTime'),
        submittedAt: submittedAtVN,
      })),
    };
  };

  const handleSubmitTest = async (auto = false) => {
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

    if (settingtest === false) {
      const error = validateAnswers(answers);
      if (error) {
        setThongBao(error);
        isSubmittingRef.current = false;
        return;
      }
    }

    try {
      setThongBao(auto ? '⏰ Hết giờ, đang nộp bài...' : '📤 Đang nộp bài...');
      const payload = buildPayload(answers, userInfo[0].userID);
      const res = await UserApi.submitTest(payload);

      if (res?.status === true) {
        localStorage.removeItem('Itemquestion');
        localStorage.removeItem('endTime');
        window.location.href = '/survey';
      } else {
        setThongBao('❌ Nộp bài không thành công');
        isSubmittingRef.current = false;
      }
    } catch (e) {
      console.error(e);
      setThongBao('❌ Có lỗi khi nộp bài');
      isSubmittingRef.current = false;
    }
  };

  return { handleSubmitTest, thongBao, clearThongBao, isSubmittingRef };
}
