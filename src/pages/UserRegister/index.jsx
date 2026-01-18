import { useEffect, useState } from 'react';
import UserApi from '../../api/UserApi';

export default function UserRegisterInfo() {
  const [missingFields, setMissingFields] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    major: '',
    studyYear: 0,
    gpa: 0,
    yearofbirth: 0,
  });
  const checkMissingFields = (data) => {
    const missing = [];

    if (!data.name) missing.push('Họ tên');
    if (!data.email) missing.push('Email');
    if (!data.gender) missing.push('Giới tính');
    if (!data.major) missing.push('Ngành học');
    if (!data.studyYear || data.studyYear === 0) missing.push('Năm học');
    if (!data.gpa || data.gpa === 0) missing.push('GPA');
    if (!data.yearofbirth || data.yearofbirth === 0) missing.push('Năm sinh');

    return missing;
  };
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const missing = checkMissingFields(form);

      // ❗ DÙNG BIẾN LOCAL
      if (missing.length > 0) {
        setMissingFields(missing);
        alert('Vui lòng nhập đầy đủ thông tin!🥲');
        return;
      }

      // Nếu không thiếu gì
      setMissingFields([]);
      setIsReady(true);

      setLoading(true);

      const res = await UserApi.registeracc(form);
      if (res.status) {
        // const checksendMail = await UserApi.sendmail(res.userid);
        // if (!checksendMail.status) {
        //   alert('❌ Gửi email xác nhận thất bại. Vui lòng kiểm tra lại email đã nhập.');
        //   return;
        // }
        localStorage.setItem(
          'registerInfo',
          JSON.stringify({
            username: res.username,
            password: res.password,
          }),
        );
        window.location.href = '/registersuccess/';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-emerald-50 p-6 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Đăng ký thông tin cá nhân</h1>
          <p className="text-slate-600 mt-1">Vui lòng điền đầy đủ và chính xác thông tin của bạn</p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input label="Họ và tên" name="name" value={form.name} onChange={handleChange} />
          <Input label="Email" name="email" value={form.email} onChange={handleChange} />

          <Select
            label="Giới tính"
            name="gender"
            value={form.gender}
            onChange={handleChange}
            options={['Nam', 'Nữ', 'Khác']}
          />

          <Select
            label="Năm đang học"
            name="studyYear"
            value={form.studyYear}
            onChange={handleChange}
            options={['1', '2', '3', '4', '5', '6', '7', 'Đã tốt nghiệp']}
          />
          <Select
            label="Nhóm Ngành"
            name="major"
            value={form.major}
            onChange={handleChange}
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
            type="number"
            name="gpa"
            min={0}
            max={4}
            step={0.01}
            inputMode="decimal"
            label="GPA (4.0)"
            onChange={(e) => {
              const value = e.target.value;

              if (value === '') {
                handleChange(e);
                return;
              }

              const num = Number(value);
              if (!isNaN(num) && num >= 0 && num <= 4) {
                handleChange(e);
              }
            }}
          />
          <Input
            label="Năm sinh"
            name="yearofbirth"
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={4}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                handleChange(e);
              }
            }}
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
  );
}

/* ---------- Components ---------- */

function Input({ label, ...props }) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <input
        {...props}
        className="
          w-full px-4 py-3 rounded-xl
          border border-slate-200
          bg-white/70
          focus:outline-none
          focus:ring-2 focus:ring-emerald-400
        "
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <select
        {...props}
        className="
          w-full px-4 py-3 rounded-xl
          border border-slate-200
          bg-white/70
          focus:outline-none
          focus:ring-2 focus:ring-emerald-400
        "
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
