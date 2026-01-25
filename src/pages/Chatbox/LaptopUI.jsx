import React, { useRef, useState, useEffect } from 'react';
import Question from '../../api/QuestionApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import GroqApi from '../../api/GroqApi';

export default function ChatboxLaptopUI() {
  const queryRef = useRef('');
  const textareaRef = useRef(null);
  const [messages, setMessages] = useState([]); // store chat history
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    localStorage.setItem('chatMessages', []);
  }, []);
  function getMessageHistoryByQuestion(idQuestionCurrent) {
    const raw = localStorage.getItem('chatMessages');
    if (!raw) return [];

    try {
      const data = JSON.parse(raw);
      const found = data.find((item) => item.idCurrentQuestion === idQuestionCurrent);
      return found ? found.responses : [];
    } catch {
      return [];
    }
  }
  function saveAIResponse(idCurrentQuestion, responseAi) {
    // 1️⃣ Lấy data hiện tại
    const raw = localStorage.getItem('chatMessages');
    let data = [];

    try {
      data = raw ? JSON.parse(raw) : [];
    } catch {
      data = [];
    }

    // 2️⃣ Tìm câu hỏi hiện tại
    const existing = data.find((item) => item.idCurrentQuestion === idCurrentQuestion);

    if (existing) {
      // 3️⃣ Nếu đã có → thêm response
      existing.responses.push(responseAi);
    } else {
      // 4️⃣ Nếu chưa có → tạo mới
      data.push({
        idCurrentQuestion,
        responses: [responseAi],
      });
    }

    // 5️⃣ Lưu lại
    localStorage.setItem('chatMessages', JSON.stringify(data));
  }
  const handleSearch = async () => {
    const text = queryRef.current?.trim();
    if (!text || loading) return;

    setLoading(true);

    /* ========================
      1. Clear input NGAY
    ========================= */
    queryRef.current = '';
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = '40px';
    }

    /* ========================
   2. Chuẩn bị dữ liệu
  ========================= */
    const token = JSON.parse(localStorage.getItem('token'));
    const itemQuestions = JSON.parse(localStorage.getItem('Itemquestion')) || [];
    const IDuser = token?.[0]?.userID;
    const IDquestioncurrent = Number(localStorage.getItem('questionIDcurrent'));
    const currentQuestion = itemQuestions.find((q) => q.idquestion === IDquestioncurrent);
    const questionTrytimes = currentQuestion?.trytimes ?? 0;

    /* ========================
   3. Push user message ngay
  ========================= */
    const userMsg = {
      role: 'user',
      text,
      iduser: IDuser,
      idquestioncurrent: IDquestioncurrent,
      questiontrytimes: questionTrytimes,
      isaskingaboutanswer: false,
      MessageHistories: getMessageHistoryByQuestion(IDquestioncurrent),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      /* ========================
     4. CHECK asking TRƯỚC
      ========================= */
      const isAsking = await GroqApi.Isaskingaboutanswerasync(userMsg);

      /* ========================
     5. Update trytimes nếu cần
      ========================= */
      if (isAsking) {
        const updated = itemQuestions.map((q) =>
          q.idquestion === IDquestioncurrent ? { ...q, trytimes: q.trytimes + 1 } : q,
        );

        localStorage.setItem('Itemquestion', JSON.stringify(updated));
      }

      /* ========================
        6. Gọi AI SAU CÙNG
      ========================= */
      let res = null;
      if (questionTrytimes === 0) {
        res = await Question.getquestionanswerbyid(IDquestioncurrent);
      } else {
        res = await GroqApi.getResponse({
          ...userMsg,
          isaskingaboutanswer: isAsking,
        });
      }
      let response = '';
      if (questionTrytimes === 0) {
        response = res.hallucination;
      } else {
        response = res.choices[0].message.content
          .replace(/\r\n/g, '\n') // Windows -> Unix
          .replace(/\r/g, '\n') // old Mac
          .replace(/\n+/g, '\n') // nhiều \n -> 1 \n
          .trim();
      }
      setMessages((prev) => [...prev, { role: 'ai', text: response }]);
      if (isAsking) {
        //Lưu IDquestioncurrent và câu trả lời của AI vào localstorage
        saveAIResponse(IDquestioncurrent, response);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'ai', text: '❌ Có lỗi xảy ra, vui lòng thử lại.' }]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="w-full md:h-[86vh] flex flex-col items-center justify-between bg-gray-50">
        <div className=" w-full max-w-3xl flex-1 overflow-y-auto p-6" id="chatArea">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">Ask anything to get started.</div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-md mb-4
              whitespace-pre-wrap break-keep text-justify leading-relaxed
              ${
                msg.role === 'user'
                  ? 'self-end bg-blue-600 text-white ml-auto'
                  : 'self-start bg-white border'
              }`}
            >
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="self-start bg-gray-200 text-gray-600 px-4 py-3 rounded-2xl max-w-[80%] shadow-md flex gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
            </div>
          )}
        </div>

        <div className="w-full bg-gray-50 px-4 border-t mt-auto border-gray-200">
          <div className="max-w-3xl mx-auto flex items-end gap-3 bg-white bg-white shadow-md rounded-lg p-4 mt-[5px]">
            <textarea
              id="chatInput"
              style={{ transition: 'height 0.2s ease' }}
              ref={textareaRef}
              onInput={(e) => {
                queryRef.current = e.target.value;

                // resize nhẹ
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // Ngăn xuống dòng
                  handleSearch(); // Gửi tin
                }
              }}
              placeholder="Message ChatGPT..."
              className="flex-1 bg-transparent outline-none resize-none overflow-y-auto overflow-x-hidden min-h-[40px] max-h-[200px] text-base"
            ></textarea>

            <button
              onClick={handleSearch}
              className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:scale-95 transition shadow-sm"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
