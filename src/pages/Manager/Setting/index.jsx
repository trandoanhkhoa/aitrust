import { useEffect, useState } from 'react';
import ManagerApi from '../../../api/Manager';
export default function AdminSettingPanel() {
  const [useTime, setUseTime] = useState(false);
  const [shuffleQuestion, setShuffleQuestion] = useState(false);
  const [timeLimit, setTimeLimit] = useState(0);

  const handleUpdate = async () => {
    const res = await ManagerApi.editsetting(useTime, shuffleQuestion, timeLimit);
    if (res.status) alert(res.message);
    else alert(res.message);
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await ManagerApi.getsetting();
      setUseTime(res.time);
      setShuffleQuestion(res.shufflequestion);
      setTimeLimit(res.timelimit);
    };
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-lg">
      <div className="backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl shadow-xl p-8 text-slate-800">
        {/* Title */}
        <h2 className="text-xl font-semibold tracking-wide mb-1 text-slate-900">
          AI Evaluation Settings
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Control fairness and behavior of the AI test system
        </p>

        {/* useTime */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-medium text-slate-800">Use Time Limit</p>
            <p className="text-xs text-slate-500">Enable or disable countdown timer</p>
          </div>
          <ToggleSwitch enabled={useTime} setEnabled={setUseTime} />
        </div>

        {/* shuffleQuestion */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-medium text-slate-800">Shuffle Questions</p>
            <p className="text-xs text-slate-500">Randomize question order per user</p>
          </div>
          <ToggleSwitch enabled={shuffleQuestion} setEnabled={setShuffleQuestion} />
        </div>

        {/* time input */}
        <div className="mb-6">
          <label className="block text-sm mb-2 text-slate-600">Time Limit (minutes)</label>
          <input
            type="number"
            min={1}
            disabled={!useTime}
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="
        w-full rounded-lg
        bg-white/60
        border border-slate-300
        px-4 py-2
        text-slate-800
        placeholder-slate-400
        focus:outline-none
        focus:ring-2 focus:ring-cyan-400
        disabled:opacity-40
      "
          />
        </div>

        {/* button */}
        <button
          onClick={handleUpdate}
          className="
      w-full py-3 rounded-xl
      bg-gradient-to-r from-cyan-500 to-emerald-500
      text-white font-semibold tracking-wide
      hover:opacity-90 transition
      shadow-md
    "
        >
          Apply Settings
        </button>
      </div>
    </div>
  );
}

/* Toggle */
function ToggleSwitch({ enabled, setEnabled }) {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-14 h-7 flex items-center rounded-full p-1 transition
        ${enabled ? 'bg-emerald-400' : 'bg-slate-600'}`}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow-md transition
          ${enabled ? 'translate-x-7' : 'translate-x-0'}`}
      />
    </button>
  );
}
