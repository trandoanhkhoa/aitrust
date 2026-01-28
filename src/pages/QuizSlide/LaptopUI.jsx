import { useState, useRef, useEffect } from 'react';
import Question from '../../api/QuestionApi';
import useSubmitTest from '../../components/Hooks/useSubmitTest';
export default function QuizSlide() {
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setquestions] = useState([]);
  const { handleSubmitTest, thongBao, clearThongBao } = useSubmitTest();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Value của answer câu hỏi
  const itemQuestion = JSON.parse(localStorage.getItem('Itemquestion')) || [];
  const answeredMap = new Map(itemQuestion.map((i) => [i.idquestion, i.useranswer]));
  const startX = useRef(null);

  const Loading = () => (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Đang tải câu hỏi...</p>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await Question.getQuestions();
        setquestions(res);
        const itemsQuestion = res.map((q) => ({
          idquestion: q.id,
          trytimes: 0,
          useranswer: '',
        }));
        localStorage.setItem('Itemquestion', JSON.stringify(itemsQuestion));
        localStorage.setItem('questionIDcurrent', res[0].id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const startTime = () => {
      const now = new Date();

      // Cộng thêm 7 tiếng cho giờ Việt Nam
      const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

      localStorage.setItem('currentTime', vnTime.toISOString());
    };

    startTime();
  }, []);
  useEffect(() => {
    if (!thongBao) return;

    const timer = setTimeout(() => {
      clearThongBao();
    }, 2000);

    return () => clearTimeout(timer);
  }, [thongBao, clearThongBao]);
  const handleAnswerChange = (questionID, selectedValue) => {
    //console.log('Selected answer:', selectedValue);
    const storedItems = JSON.parse(localStorage.getItem('Itemquestion')) || [];

    const updatedItems = storedItems.map((item) =>
      item.idquestion === questionID ? { ...item, useranswer: selectedValue } : item,
    );
    localStorage.setItem('Itemquestion', JSON.stringify(updatedItems));
  };
  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      localStorage.setItem('questionIDcurrent', questions[currentIndex + 1].id);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      localStorage.setItem('questionIDcurrent', questions[currentIndex - 1].id);
    }
  };

  // Handle Touch Start
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  // Handle Touch Move
  const handleTouchMove = (e) => {
    if (!startX.current) return;

    const endX = e.touches[0].clientX;
    const diff = startX.current - endX;

    if (diff > 50) {
      next();
      startX.current = null;
    } else if (diff < -50) {
      prev();
      startX.current = null;
    }
  };
  const goToQuestion = (index) => {
    setCurrentIndex(index);
    localStorage.setItem('questionIDcurrent', questions[index].id);
  };
  return (
    <div className="w-full h-[100%] flex flex-col items-center justify-center px-4 bg-white shadow-md rounded-lg">
      {loading ? (
        <Loading />
      ) : (
        <div
          className="relative w-full overflow-y-auto overflow-x-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {thongBao && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
              <div
                className="
      min-w-[280px] max-w-[420px]
      px-4 py-3 rounded-xl shadow-lg
      border border-yellow-200
      bg-yellow-50 text-yellow-900
      flex items-center gap-2
      animate-slideDown
    "
              >
                <span className="text-lg">⚠️</span>
                <p className="text-sm font-medium">{thongBao}</p>
              </div>
            </div>
          )}
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {questions.map((q, index) => {
              const answers = q.answer.split('|'); // tách đáp án

              return (
                <div key={q.id} className="w-full shrink-0 p-6">
                  <div className="bg-white p-6 rounded-2xl shadow-md text-justify text-lg font-medium">
                    {/* Hiển thị câu hỏi */}

                    <div
                      dangerouslySetInnerHTML={{ __html: q.question1 }}
                      style={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        maxWidth: '100%',
                      }}
                    ></div>

                    {/* Hiển thị danh sách đáp án */}
                    <div className="mt-4 flex flex-col gap-3">
                      {answers.map((ans, ansIndex) => (
                        <label
                          key={ansIndex}
                          className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
                        >
                          <input
                            type="radio"
                            name={`question_${q.id}`} // mỗi câu hỏi có group radio riêng
                            value={alphabet[ansIndex]}
                            className="w-4 h-4"
                            onChange={() => handleAnswerChange(q.id, alphabet[ansIndex])}
                          />
                          <div
                            dangerouslySetInnerHTML={{ __html: ans }}
                            style={{
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere',
                              maxWidth: '100%',
                              fontWeight: 'normal',
                            }}
                            className="text-left"
                          ></div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dot indicators */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => goToQuestion(i)}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center
              text-sm font-semibold transition-all duration-200
              ${
                i === currentIndex
                  ? 'bg-blue-500 text-white scale-110 shadow-md'
                  : answeredMap.get(q.id)
                    ? 'bg-green-400 text-white hover:bg-green-500'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
          `}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {/* Buttons */}
      <div className="flex gap-4 mt-6 pb-[30px]">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-40"
        >
          ← Prev
        </button>
        {currentIndex === questions.length - 1 ? (
          <button
            onClick={() => handleSubmitTest(false)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold"
          >
            🚀 Nộp bài
          </button>
        ) : (
          <button
            onClick={next}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-40"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
