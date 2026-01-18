import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import GroqApi from '../../api/GroqApi';

export default function ChatboxMobileUI() {
  const queryRef = useRef('');
  const textareaRef = useRef(null);
  const [messages, setMessages] = useState([]); // store chat history
  const [openChat, setOpenChat] = useState(false);
  const [loading, setLoading] = useState(false);
  const ChatInput = () => (
    <div className="border-t bg-white px-3 py-2">
      <div className="flex items-end gap-2 bg-gray-200 rounded-xl px-2 py-2">
        {/* ===== History / Open Chat Button ===== */}
        <button
          onClick={() => {
            setOpenChat(true);

            // đợi Bottom Sheet animate xong rồi focus textarea
            setTimeout(() => {
              textareaRef.current?.focus();
            }, 300);
          }}
          title="Xem lại đoạn chat trước"
          className="
          flex items-center justify-center
          w-9 h-9 rounded-lg
          bg-white text-slate-700 shadow-sm
          hover:bg-gray-100
          active:scale-95 transition
        "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* ===== Textarea ===== */}
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Thoải mái hỏi AI..."
          className="
          flex-1 bg-transparent resize-none outline-none
          max-h-[120px] text-sm leading-5 py-2
        "
          onInput={(e) => {
            queryRef.current = e.target.value;
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* ===== Send Button ===== */}
        <button
          onClick={handleSend}
          className="
          bg-blue-600 text-white
          w-9 h-9 rounded-lg
          flex items-center justify-center
          active:scale-95 transition
        "
        >
          ➤
        </button>
      </div>
    </div>
  );

  const handleSend = async () => {
    const text = queryRef.current?.trim();
    if (!queryRef.current?.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);

    setOpenChat(true);
    setLoading(true);

    // clear input
    queryRef.current = '';
    textareaRef.current.value = '';
    textareaRef.current.style.height = '36px';

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
    };

    try {
      /* ========================
     4. CHECK asking TRƯỚC
      ========================= */
      const isAsking = await GroqApi.Isaskingaboutanswerasync({ text });

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
      const res = await GroqApi.getResponse({
        ...userMsg,
        isaskingaboutanswer: isAsking,
      });

      const response = res.choices[0].message.content;
      setMessages((prev) => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: '❌ Có lỗi xảy ra, vui lòng thử lại.' }]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* ================= MAIN LAYOUT ================= */}
      <div className="bg-gray-50 flex flex-col">
        {/* Chat area */}
        <div id="chatArea" className=" px-3 py-4 sm:px-6 max-w-3xl w-full mx-auto">
          {loading && !openChat && (
            <div className="mr-auto bg-gray-200 text-gray-600 px-4 py-3 rounded-2xl shadow-sm">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-400"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input cố định */}
        <ChatInput />
      </div>

      {/* ================= BOTTOM SHEET ================= */}
      {openChat && (
        <div className="fixed inset-0 z-[999] bg-black/50 flex items-end">
          {/* Bottom Sheet – KHÔNG DÙNG vh */}
          <div
            className="
            bg-white w-full
            rounded-t-2xl
            flex flex-col
            animate-slideUp
          "
            style={{
              height: 'calc(100% - 80px)', // 👈 CHÌA KHÓA
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <span className="text-sm font-medium text-gray-700">Chat Response</span>
              <button onClick={() => setOpenChat(false)} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`
                  max-w-[90%] px-4 py-3 rounded-2xl text-sm
                  ${
                    msg.role === 'user'
                      ? 'ml-auto bg-blue-600 text-white'
                      : 'mr-auto bg-gray-100 text-gray-800'
                  }
                `}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
              ))}

              {loading && (
                <div className="mr-auto bg-gray-200 text-gray-600 px-4 py-3 rounded-2xl shadow-sm">
                  <div className="flex gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-400"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <ChatInput />
          </div>
        </div>
      )}
    </>
  );
}
