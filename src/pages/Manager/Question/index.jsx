import { useState, useEffect } from 'react';
import ManagerApi from '../../../api/Manager';
export default function QuestionManagement() {
  const [filter, setFilter] = useState('');
  const [questions, setquestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await ManagerApi.getallquestions();

      setquestions(res);
    };
    fetchData();
  }, []);
  const filteredQuestions = questions.filter((q) =>
    q.question1.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Question Management</h2>
            <p className="text-sm text-slate-600">
              Manage evaluation questions and hallucination control
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = '/addquestion';
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium shadow hover:opacity-90"
          >
            + Add Question
          </button>
        </div>

        {/* Filter */}
        <div className="mb-4 flex gap-3">
          <input
            type="text"
            placeholder="Search question..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-72 px-4 py-2 rounded-lg border border-slate-300 bg-white/60 text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Question</th>
                <th className="p-3 text-left">Correct Answer</th>
                <th className="p-3 text-left">Hallucination Answer</th>
                <th className="p-3 text-center">Try Times</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="border-t border-slate-200 hover:bg-slate-50 transition">
                  <td className="p-3 font-medium text-slate-800">{q.id}</td>
                  <td className="p-3 max-w-xs">
                    <div
                      className="text-slate-700 line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: q.question1 }}
                    />
                  </td>
                  {/* dangerouslySetInnerHTML={{ __html: q.question1 }} */}
                  <td className="p-3 text-emerald-600">{q.correctanswer}</td>
                  <td className="p-3 text-rose-600">{q.hallucinationanswer}</td>
                  <td className="p-3 text-center font-semibold">{q.timetries}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => (window.location.href = `addquestion/edit/${q.id}`)}
                      className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button className="px-3 py-1 rounded-lg bg-rose-500 text-white hover:bg-rose-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredQuestions.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500">
                    No questions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
