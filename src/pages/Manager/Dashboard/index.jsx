import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
  CartesianGrid,
} from 'recharts';

import UserTable from '../Dashboard/usertable';
import ManagerApi from '../../../api/Manager';

const mauBieuDo = ['#22d3ee', '#34d399', '#60a5fa', '#a78bfa', '#fbbf24'];
/**Design an admin dashboard UI in AI Glassmorphism style, with high readability,
 * trust-oriented colors (slate, cyan, emerald), modern, minimal, human-centered,
 * suitable for AI evaluation platforms. */
export default function Dashboard() {
  const [users, setUsers] = useState([]);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [useTime, setUseTime] = useState(-1);
  const [testType, setTestType] = useState(-1);

  const [chartData, setchartData] = useState([]);
  const [chartDataSurvey, setchartDataSurcey] = useState([]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { score, count, percentage } = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 rounded-lg p-2 text-sm">
          <p>
            <b>Điểm:</b> {score}
          </p>
          <p>
            <b>Số lượng:</b> {count}
          </p>
          <p>
            <b>Tỷ lệ:</b> {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };
  const handleReportSubmit = async () => {
    const payload = {
      fromdate: fromDate || null,
      todate: toDate || null,
      useTime: useTime ?? -1,
      typeoftest: testType ?? -1,
    };
    const res = await ManagerApi.getreportrate(payload);
    const ressurvey = await ManagerApi.getreportsurvey(payload);
    const resuser = await ManagerApi.getscores(payload);
    setchartData(res);
    setchartDataSurcey(ressurvey);
    setUsers(resuser);
  };
  const handleExportExcel = async () => {
    const payload = {
      fromdate: fromDate || null,
      todate: toDate || null,
      useTime: useTime ?? -1,
      typeoftest: testType ?? -1,
    };
    try {
      const res = await ManagerApi.exportExcel(payload);

      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.xlsx';
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export Excel failed', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await ManagerApi.getscores({
        fromdate: null,
        todate: null,
        useTime: -1,
        testoftype: -1,
      });
      //console.log(res);
      setUsers(res);
    };
    const fetchChartData = async () => {
      const res = await ManagerApi.getreportrate({
        fromdate: null,
        todate: null,
        useTime: -1,
        testoftype: -1,
      });
      //console.log(res);
      setchartData(res);
    };
    const fetchChartDataSurvey = async () => {
      const res = await ManagerApi.getreportsurvey({
        fromdate: null,
        todate: null,
        useTime: -1,
        testoftype: -1,
      });
      setchartDataSurcey(res);
      //console.log(res);
    };
    fetchData();
    fetchChartData();
    fetchChartDataSurvey();
  }, []);

  return (
    <div className="min-h-screen p-6 text-slate-900">
      <h1 className="text-2xl font-bold mb-6">📊 AI Evaluation Dashboard</h1>

      {/* KPI CARDS */}
      <div className="flex flex-wrap gap-6 mb-8">
        {/* Completed Tests */}
        <div className="w-[320px] rounded-2xl bg-white/70 backdrop-blur-xl border border-slate-200 p-5 shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl text-white shadow-md">
              🤖
            </div>
            <span className="text-sm font-semibold text-slate-700">Completed Tests</span>
          </div>

          <div className="text-4xl font-extrabold text-slate-900">{users.length}</div>
          <p className="text-sm text-slate-600 mt-1">Users finished the test</p>
          <span className="text-xs font-medium text-emerald-600 mt-2 block">▲ updated</span>
        </div>

        {/* Correct Rate */}
        <div className="w-[320px] rounded-2xl bg-white/70 backdrop-blur-xl border border-slate-200 p-5 shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-xl text-white shadow-md">
              ✅
            </div>
            <span className="text-sm font-semibold text-slate-700">Correct Rate</span>
          </div>

          <div className="text-4xl font-extrabold text-slate-900">45%</div>
          <p className="text-sm text-slate-600 mt-1">Overall accuracy</p>
          <span className="text-xs font-medium text-emerald-600 mt-2 block">▲ stable</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8 bg-white/70 backdrop-blur-xl rounded-2xl p-5 border border-slate-200 shadow-sm">
        {/* From date */}
        <div>
          <label className="text-sm mb-1 block text-slate-700">From date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-900 focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* To date */}
        <div>
          <label className="text-sm mb-1 block text-slate-700">To date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-900 focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* Use time */}
        <div>
          <label className="text-sm mb-1 block text-slate-700">Use time</label>
          <select
            value={useTime}
            onChange={(e) => setUseTime(e.target.value)}
            className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-900 focus:ring-2 focus:ring-cyan-400 outline-none"
          >
            <option value="-1">All</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Type of test */}
        <div>
          <label className="text-sm mb-1 block text-slate-700">Type of test</label>
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="w-full rounded-lg bg-white border border-slate-300 p-2 text-slate-900 focus:ring-2 focus:ring-cyan-400 outline-none"
          >
            <option value="-1">All</option>
            <option value="0">Gemini Pro 3</option>
            <option value="1">Developing AI</option>
          </select>
        </div>

        {/* FILTER BUTTON */}
        <div className="flex items-end">
          <button
            onClick={() => {
              handleReportSubmit();
            }}
            className="
        w-full h-[42px]
        rounded-xl
        bg-gradient-to-r from-cyan-500 to-emerald-500
        text-white font-semibold
        shadow-md shadow-cyan-500/30
        hover:scale-[1.02] hover:shadow-lg
        active:scale-95
        transition-all duration-200
        flex items-center justify-center gap-2
      "
          >
            🔍 Filter
          </button>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              handleExportExcel();
            }}
            className="
        w-full h-[42px]
        rounded-xl
        bg-gradient-to-r from-cyan-500 to-emerald-500
        text-white font-semibold
        shadow-md shadow-cyan-500/30
        hover:scale-[1.02] hover:shadow-lg
        active:scale-95
        transition-all duration-200
        flex items-center justify-center gap-2
      "
          >
            📤 ExportExcel
          </button>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* BAR CHART */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">
            Hallucination Rate (%) – Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="range" stroke="#475569" />
              <YAxis unit="%" stroke="#475569" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              />

              <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={mauBieuDo[index]} />
                ))}
                <LabelList dataKey="count" position="middle" fill="#0f172a" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">
            Hallucination Rate (%) – Ratio
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="percentage"
                nameKey="range"
                outerRadius={110}
                label={({ range, percentage }) => `${range}: ${percentage}%`}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={mauBieuDo[index]} />
                ))}
                <LabelList dataKey="count" position="middle" fill="#0f172a" fontSize={12} />
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-800">Survey Analysis</h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {chartDataSurvey.map((survey) => (
            <div
              key={survey.surveyID}
              className="bg-white rounded-2xl shadow p-6 border border-slate-200"
            >
              <h3 className="text-lg font-semibold mb-1">{survey.question}</h3>

              <p className="text-sm text-slate-500 mb-4">
                Điểm trung bình: <b>{survey.avgScore}</b>
              </p>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={survey.details}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="score" />
                  <YAxis unit="%" />
                  <Tooltip content={<CustomTooltip />} />

                  <Bar dataKey="percentage" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="count" position="top" fill="#0f172a" fontSize={12} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>

      <UserTable users={users} />
    </div>
  );
}
