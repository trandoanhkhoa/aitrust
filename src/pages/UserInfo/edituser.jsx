import { useEffect, useState } from 'react';
import UserApi from '../../api/UserApi';

export default function UserRegisterInfo() {
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    gender: '',
    major: '',
    studyYear: 0,
    gpa: 0,
    yearofbirth: 0,
  });

  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const hasError = (field) => missingFields.includes(field);
  const checkMissingFields = (data) => {
    const missing = [];

    if (!data.name) missing.push('name');
    if (!data.email) missing.push('email');
    if (!data.gender) missing.push('gender');
    if (!data.major) missing.push('major');
    if (!data.studyYear || data.studyYear === 0) missing.push('studyYear');
    if (!data.gpa || data.gpa === 0) missing.push('gpa');
    if (!data.yearofbirth || data.yearofbirth === 0) missing.push('yearofbirth');

    return missing;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!isReady) {
        alert('Bạn vui lòng nhập đầy đủ thông tin !🥲');
        return;
      }
      const res = await UserApi.edituser(form);
      if (res.status) {
        //alert(res.message);
        window.location.href = '/userinfo';
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert('❌ Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fecthDatauser = async () => {
      const tokenRaw = localStorage.getItem('token');
      const userID = tokenRaw ? JSON.parse(tokenRaw)?.[0]?.userID : null;
      const res = await UserApi.getuserinfo(userID);
      //console.log(res);
      setForm({
        id: res.id,
        name: res.name,
        email: res.email,
        gender: res.gender,
        major: res.major,
        studyYear: res.studyYear,
        gpa: res.gpa,
        yearofbirth: res.yearofbirth,
      });
    };
    fecthDatauser();
  }, []);
  useEffect(() => {
    const missing = checkMissingFields(form);
    setMissingFields(missing);
    setIsReady(missing.length === 0);
  }, [form]);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-emerald-50 p-6 flex justify-center items-center">
        <div className="w-full max-w-3xl bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">Chỉnh sửa thông tin cá nhân</h1>
            <p className="text-slate-600 mt-1">Vui kiểm tra và chỉnh sửa thông tin của bạn</p>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Họ và tên"
              name="name"
              error={hasError('name')}
              value={form.name}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              error={hasError('email')}
              value={form.email}
              onChange={handleChange}
            />

            <Select
              label="Giới tính"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              error={hasError('gender')}
              options={['Nam', 'Nữ', 'Khác']}
            />

            <Select
              label="Năm đang học"
              name="studyYear"
              value={form.studyYear}
              onChange={handleChange}
              error={hasError('studyYear')}
              options={['1', '2', '3', '4', '5', '6', '7', 'Đã tốt nghiệp']}
            />
            <Select
              label="Nhóm Ngành"
              name="major"
              value={form.major}
              onChange={handleChange}
              error={hasError('major')}
              options={[
                'Công nghệ & Kỹ thuật',
                'Kinh tế & Kinh doanh',
                'Sức khỏe & Y tế',
                'Xây dựng & Kiến trúc',
                'Khoa học Tự nhiên & Xã hội',
                'Nông nghiệp & Môi trường',
                'Dịch vụ & Nghệ thuật',
                'Giáo dục',
                'Khác',
              ]}
            />
            <Input
              label="GPA Tích lũy"
              name="gpa"
              type="number"
              value={form.gpa}
              onChange={handleChange}
              error={hasError('gpa')}
            />
            <Input
              label="Năm sinh"
              type="number"
              value={form.yearofbirth}
              name="yearofbirth"
              error={hasError('yearofbirth')}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="
              px-6 py-3 rounded-xl
              bg-gradient-to-r from-emerald-500 to-cyan-500
              text-white font-medium
              shadow-lg
              hover:from-emerald-600 hover:to-cyan-600
              transition-all
              active:scale-95
              disabled:opacity-50
            "
            >
              {loading ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Components ---------- */

function Input({ label, error, ...props }) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <input
        {...props}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white/70
          border
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-400'}
          focus:outline-none
          focus:ring-2
        `}
      />
      {error && <p className="text-xs text-red-500 mt-1">Trường này là bắt buộc</p>}
    </div>
  );
}

function Select({ label, options, error, ...props }) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <select
        {...props}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-white/70
          border
          ${error ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-emerald-400'}
          focus:outline-none
          focus:ring-2
        `}
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">Vui lòng chọn giá trị</p>}
    </div>
  );
}
