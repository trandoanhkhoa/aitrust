import { useEffect, useState } from 'react';
import Question from '../../api/QuestionApi';

export default function QuizSlide() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemQuestion, setItemQuestion] = useState(() => {
    const saved = localStorage.getItem('Itemquestion');
    return saved ? JSON.parse(saved) : [];
  });
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Question.getQuestions();
        setQuestions(res);

        const items = res.map((q) => ({
          idquestion: q.id,
          trytimes: 0,
          useranswer: '',
        }));
        localStorage.setItem('Itemquestion', JSON.stringify(items));
        localStorage.setItem('questionIDcurrent', res[0]?.id);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAnswerChange = (questionID, selectedValue) => {
    const storedItems = JSON.parse(localStorage.getItem('Itemquestion')) || [];

    const updatedItems = storedItems.map((item) =>
      item.idquestion === questionID ? { ...item, useranswer: selectedValue } : item,
    );

    setItemQuestion(updatedItems);
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
  const question = questions[currentIndex];
  if (loading) return <Loading />;
  if (!question) return null;

  const answers = question.answer.split('|');
  const currentAnswer = itemQuestion.find((i) => i.idquestion === question.id)?.useranswer;
  return (
    <div className="w-full flex justify-center px-2 sm:px-4">
      <div className="w-full max-w-[850px]">
        {/* ================= NAVIGATION ================= */}
        <div className="mb-3 flex items-center justify-between gap-3">
          {/* PREV */}
          <button
            disabled={currentIndex === 0}
            onClick={prev}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-40"
          >
            ← Prev
          </button>

          <div className="px-4 py-2 rounded-full bg-gray-100 font-semibold">
            {currentIndex + 1} / {questions.length}
          </div>

          {/* NEXT */}
          <button
            disabled={currentIndex === questions.length - 1}
            onClick={next}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-40"
          >
            Next →
          </button>
        </div>
        {/* CARD */}
        <div
          className="
          bg-white
          rounded-xl
          shadow-md
          flex flex-col

          h-[75vh]
          sm:h-[80vh]
          md:h-[80vh]
        "
        >
          {/* ================= QUESTION (SCROLL) ================= */}
          <div
            className="
            flex-1
            overflow-y-auto
            p-3
            sm:p-4
            md:p-6
            text-left
            sm:text-justify

            text-sm
            sm:text-base
            md:text-lg

            break-words
            max-w-full
            [&_img]:max-w-full
            [&_img]:h-auto
            [&_table]:block
            [&_table]:max-w-full
            [&_table]:overflow-x-auto
            [&_pre]:whitespace-pre-wrap
            [&_code]:break-words
          "
            dangerouslySetInnerHTML={{ __html: question.question1 }}
          />

          {/* ================= ANSWERS (SCROLL) ================= */}
          <div
            className="
            border-t
            flex-1
            overflow-y-auto

            px-3
            sm:px-4
            md:px-6
            py-3
          "
          >
            <div className="flex flex-col gap-3">
              {answers.map((ans, idx) => (
                <label
                  key={idx}
                  className="
                  flex
                  items-start
                  gap-3
                  p-2
                  rounded-lg
                  cursor-pointer
                  hover:bg-gray-100
                "
                >
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    checked={currentAnswer === alphabet[idx]}
                    onChange={() => handleAnswerChange(question.id, alphabet[idx])}
                  />
                  <div
                    dangerouslySetInnerHTML={{ __html: ans }}
                    className="
                    break-words
                    text-sm
                    sm:text-base
                    max-w-full
                  "
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Đang tải câu hỏi...</p>
      </div>
    </div>
  );
}
