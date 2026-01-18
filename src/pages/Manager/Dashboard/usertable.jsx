import { useState, Fragment, use } from 'react';
import AnswerUsers from '../../../api/Manager';
export default function UserTable({ users = [] }) {
  const [openUser, setOpenUser] = useState(null);
  const [details, setDetails] = useState([]);
  const [openConversation, setOpenConversation] = useState(false);
  const [conversationDetails, setConversationDetails] = useState([]);

  const [showDetail, setShowDetail] = useState(false);
  const [surveyDetail, setSurveyDetail] = useState([]);

  const formatDurationFromTimeSpan = (timeSpan) => {
    if (!timeSpan) return 'N/A';

    // "07:02:50.9430000"
    const [time, fraction] = timeSpan.split('.');
    const [hours, minutes, seconds] = time.split(':');

    return (
      `${hours.padStart(2, '0')}:` + `${minutes.padStart(2, '0')}:` + `${seconds.padStart(2, '0')}`
    );
  };
  const toggleDetail = async (userId) => {
    if (openUser === userId) {
      setOpenUser(null);
      return;
    }
    // TODO: fetch detail by userId
    const res = await AnswerUsers.getscoredetail(userId);
    setDetails(res);
    setOpenUser(userId);
  };

  const showDetailConversation = async (userid, questionid) => {
    const res = await AnswerUsers.getconversationdetail(userid, questionid);
    setConversationDetails(res);
    setOpenConversation(true);
  };
  const showDetailSurvey = async (userId) => {
    if (showDetail) {
      setShowDetail(false);
      return;
    }

    const res = await AnswerUsers.getsurveydetail(userId);
    setSurveyDetail(res);
    setShowDetail(true);
  };

  return (
    <>
      {openConversation && (
        <div
          onClick={() => setOpenConversation(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <div
            className="relative
        w-full max-w-2xl
        max-h-[80vh]
        rounded-2xl
        bg-white/80 backdrop-blur-xl
        border border-slate-200
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        flex flex-col"
          >
            {/* HEADER (sticky) */}
            <div
              className="sticky top-0 z-20
          flex items-center justify-between
          px-6 py-4
          bg-white/90 backdrop-blur-xl
          border-b border-slate-200
          rounded-t-2xl"
            >
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                🤖 AI Conversation Review
              </h2>

              <button
                onClick={() => setOpenConversation(false)}
                className="
            w-9 h-9 rounded-full
            bg-white
            border border-slate-200
            text-slate-600 font-bold
            shadow
            hover:bg-rose-100 hover:text-rose-600
            transition"
              >
                ✕
              </button>
            </div>

            {/* CONTENT (scroll) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {conversationDetails.map((c, i) => (
                <div key={i} className="space-y-2">
                  {/* User */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-xl bg-slate-100 text-slate-800 px-4 py-2 text-sm">
                      <span className="block text-xs font-semibold text-slate-500 mb-1">User</span>
                      {c.questionuser}
                    </div>
                  </div>

                  {/* AI */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-2 text-sm shadow-md">
                      <span className="block text-xs font-semibold text-white/80 mb-1">AI</span>
                      {c.answerai}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
               bg-black/30 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
        relative
        w-full max-w-4xl
        max-h-[80vh]
        rounded-2xl
        bg-white/80 backdrop-blur-xl
        border border-slate-200
        shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        flex flex-col
      "
          >
            {/* HEADER */}
            <div
              className="
          sticky top-0 z-20
          flex items-center justify-between
          px-6 py-4
          bg-white/90 backdrop-blur-xl
          border-b border-slate-200
          rounded-t-2xl
        "
            >
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                📊 Survey Detail Review
              </h2>

              <button
                onClick={() => setShowDetail(false)}
                className="
            w-9 h-9 rounded-full
            bg-white
            border border-slate-200
            text-slate-600 font-bold
            shadow
            hover:bg-rose-100 hover:text-rose-600
            transition
          "
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-slate-600 border-b">
                    <th className="py-3 text-left">Survey ID</th>
                    <th className="py-3 text-left">Question</th>
                    <th className="py-3 text-center">Answer</th>
                  </tr>
                </thead>

                <tbody>
                  {surveyDetail.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-none hover:bg-slate-100/50 transition"
                    >
                      <td className="py-3 font-medium text-slate-700">{item.surveyId}</td>

                      <td className="py-3 text-slate-700 max-w-xl">{item.question}</td>

                      <td className="py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        item.answer >= 4
                          ? 'bg-emerald-100 text-emerald-700'
                          : item.answer >= 2
                            ? 'bg-cyan-100 text-cyan-700'
                            : 'bg-rose-100 text-rose-700'
                      }`}
                        >
                          {item.answer}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div
        className="rounded-2xl overflow-hidden border border-slate-200 
                  bg-white/80 backdrop-blur-xl
                  shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
      >
        <table className="w-full text-sm text-slate-800">
          {/* HEADER */}
          <thead className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-100">
            <tr>
              <th className="w-12 py-4"></th>
              <th className="text-left py-4 font-semibold">User</th>
              <th className="text-center py-4 font-semibold">Score</th>
              <th className="text-center py-4 font-semibold">Total Score</th>
              <th className="text-center py-4 font-semibold">Submitted At</th>
              <th className="text-center py-4 font-semibold">Duration</th>
              <th className="text-center py-4 font-semibold"></th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <Fragment key={u.userID}>
                {/* USER ROW */}
                <tr
                  className="border-b last:border-b-0 
                           hover:bg-cyan-50/40 transition"
                >
                  <td className="text-center py-1">
                    <button
                      onClick={() => toggleDetail(u.userID)}
                      className="w-8 h-8 rounded-full 
                             bg-slate-100 text-slate-700
                             hover:bg-cyan-100 hover:text-cyan-700
                             transition font-bold"
                    >
                      {openUser === u.userID ? '−' : '+'}
                    </button>
                  </td>

                  <td className="py-3">
                    <div className="font-semibold text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-500">
                      ID: {u.userID} - Type of test: {u.typeoftest}
                    </div>
                  </td>

                  <td className="text-center py-2">
                    <span
                      className="px-4 py-1.5 rounded-full
                                 bg-gradient-to-r from-emerald-400 to-cyan-400
                                 text-slate-900 font-bold shadow-sm"
                    >
                      {u.totalScore}
                    </span>
                  </td>
                  <td className="text-center py-2">
                    <span
                      className="px-4 py-1.5 rounded-full
                                 bg-gradient-to-r from-emerald-400 to-cyan-400
                                 text-slate-900 font-bold shadow-sm"
                    >
                      {Number(u.avgScore).toFixed(2)}
                    </span>
                  </td>
                  <td className="text-center py-1">
                    {new Date(u.startedAt).toLocaleString('vi-VN')} -{' '}
                    {new Date(u.submittedAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="text-center py-1">{formatDurationFromTimeSpan(u.duration)}</td>
                  <td className="text-center py-1">
                    <button
                      className="ml-auto
                                  px-4 py-2 rounded-xl
                                  bg-white/70 backdrop-blur-md
                                  border border-slate-200
                                  text-slate-800 font-medium text-sm
                                  shadow-sm
                                  cursor-pointer
                                  hover:bg-gradient-to-r hover:from-cyan-500 hover:to-emerald-500
                                  hover:text-white
                                  hover:shadow-md hover:shadow-cyan-400/30
                                  transition-all duration-300"
                      onClick={() => showDetailSurvey(u.userID)}
                    >
                      Detail of Survey
                    </button>
                  </td>
                </tr>

                {/* DETAIL ROW */}
                {openUser === u.userID && (
                  <tr className="bg-slate-50">
                    <td colSpan="7" className="p-6">
                      <div className="space-y-4">
                        {details.length === 0 && (
                          <div className="italic text-slate-500 flex items-center gap-2">
                            🤖 <span>AI is analyzing user answers...</span>
                          </div>
                        )}

                        {details.map((d, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-slate-200 
                                   bg-white/90 backdrop-blur
                                   p-5 shadow-sm hover:shadow-md transition"
                          >
                            {/* Question */}
                            <div
                              className="text-slate-900 font-medium mb-2"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                              dangerouslySetInnerHTML={{ __html: d.questionContent }}
                            />

                            {/* Answers */}
                            <div className="text-sm space-y-1">
                              <p>
                                <span className="font-semibold text-cyan-700">Your:</span>{' '}
                                <span className="text-slate-700">{d.userAnswer}</span>
                              </p>
                              <p>
                                <span className="font-semibold text-emerald-700">Correct:</span>{' '}
                                <span className="text-slate-700">{d.correctAnswer}</span>
                              </p>
                              <p>
                                <span className="font-semibold text-red-700">Hallucination:</span>{' '}
                                <span className="text-slate-700">{d.hallucinationAnswer}</span>
                              </p>
                            </div>

                            {/* Meta */}
                            <div className="mt-3 flex items-center gap-6 text-xs text-slate-500">
                              <span>🔁 Try: {d.tryTimes}</span>
                              <span>⭐ Score: {d.score}</span>

                              <button
                                className="ml-auto
                                  px-4 py-2 rounded-xl
                                  bg-white/70 backdrop-blur-md
                                  border border-slate-200
                                  text-slate-800 font-medium text-sm
                                  shadow-sm
                                  cursor-pointer
                                  hover:bg-gradient-to-r hover:from-cyan-500 hover:to-emerald-500
                                  hover:text-white
                                  hover:shadow-md hover:shadow-cyan-400/30
                                  transition-all duration-300"
                                onClick={() => showDetailConversation(d.userId, d.questionId)}
                              >
                                🤖 Detail of Conversation
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
