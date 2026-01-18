import { useEffect, useState } from 'react';
import UserApi from '../../api/UserApi';
export default function UserProfileDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const tokenRaw = localStorage.getItem('token');
      const userID = tokenRaw ? JSON.parse(tokenRaw)?.[0]?.userID : null;

      if (!userID) return;

      try {
        const userInfo = await UserApi.getuserinfo(userID);
        //console.log('USER INFO:', userInfo);
        setUser(userInfo);
      } catch (err) {
        console.error('Fetch user error:', err);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Không có thông tin người dùng
      </div>
    );
  }
  const Editpage = () => {
    window.location.href = '/edituser';
  };
  const nextPage = () => {
    window.location.href = '/instructions';
  };
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-emerald-50 p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl mt-[15px]">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">Thông tin cá nhân</h1>
            <p className="text-slate-600 mt-1">
              Kiểm tra và xác nhận thông tin cá nhân sau khi đăng nhập
            </p>
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-100 to-cyan-100 border border-emerald-300 shadow-sm">
              <p className="text-slate-800 font-medium">
                ⚠️ Vui lòng kiểm tra kỹ thông tin cá nhân.
                <span className="font-normal text-slate-600">
                  Bạn có thể tùy sửa thông tin hoặc bấm tiếp tục để sang trang mới.
                </span>
              </p>
            </div>
          </div>

          {/* Glass Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex flex-col items-center md:w-1/3">
                {/* Avatar */}
                <div
                  className="w-32 h-32 rounded-full 
                  bg-gradient-to-br from-emerald-400 to-cyan-400
                  flex items-center justify-center
                  text-white text-4xl font-semibold
                  shadow-lg"
                >
                  {user.name?.charAt(0)}
                </div>

                {/* Name */}
                <p className="mt-4 text-slate-800 text-lg font-semibold text-center">{user.name}</p>

                {/* GPA */}
                <span
                  className="mt-2 px-3 py-1 text-sm rounded-full 
                   bg-emerald-100 text-emerald-700"
                >
                  GPA {user.gpa}
                </span>

                {/* Edit Button */}
                <button
                  onClick={Editpage}
                  className="
                    mt-6
                    inline-flex items-center gap-2
                    px-4 py-2
                    rounded-lg
                    bg-white
                    border border-emerald-300
                    text-emerald-600 font-medium
                    shadow-sm
                    hover:bg-emerald-50
                    hover:border-emerald-400
                    transition
                    active:scale-95
                      "
                >
                  <span className="text-base">✏️</span>
                  <span>Sửa thông tin</span>
                </button>
              </div>

              {/* Info */}
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InfoItem label="Email" value={user.email ?? 'Chưa có thông tin'} />
                <InfoItem label="Giới tính" value={user.gender ?? 'Chưa có thông tin'} />
                <InfoItem label="Ngành học" value={user.major ?? 'Chưa có thông tin'} />
                <InfoItem label="Năm đang học" value={user.studyYear ?? 'Chưa có thông tin'} />
                <InfoItem label="Năm sinh" value={user.yearofbirth ?? 'Chưa có thông tin'} />
                <InfoItem label="GPA" value={user.gpa ?? 'Chưa có thông tin'} highlight />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-end w-full max-w-4xl">
          <button
            onClick={nextPage}
            className="
      flex items-center gap-2
      px-6 py-3
      rounded-xl
      bg-gradient-to-r from-emerald-500 to-cyan-500
      text-white font-medium
      shadow-lg
      hover:from-emerald-600 hover:to-cyan-600
      hover:shadow-xl
      transition-all duration-300
      active:scale-95
    "
          >
            Tiếp tục
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </>
  );
}

function InfoItem({ label, value, highlight = false }) {
  return (
    <div
      className={`p-4 rounded-2xl border ${
        highlight ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white/60'
      }`}
    >
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="text-slate-800 font-medium">{value}</p>
    </div>
  );
}
