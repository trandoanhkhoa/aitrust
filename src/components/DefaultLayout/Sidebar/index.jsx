import { useState } from 'react';

function Sidebar() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace('/login');
  };

  return (
    <>
      {/* ===== Nút mở menu (chỉ hiện trên mobile / tablet) ===== */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* ===== Overlay khi mở sidebar trên mobile ===== */}
      {open && (
        <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden" />
      )}

      {/* ===== Sidebar ===== */}
      <div
        className={`
          fixed md:static top-0 left-0 h-screen
          w-56 bg-gradient-to-b from-slate-900 to-slate-800
          text-white flex flex-col p-4 shadow-xl
          transform transition-transform duration-300 z-50
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <h1 className="text-xl font-bold mb-6 tracking-wide">📖 CRTest</h1>

        <nav className="flex flex-col gap-3 text-slate-300">
          <button
            onClick={handleLogout}
            className="text-left hover:text-white transition flex items-center gap-2"
          >
            ⬅️ Logout
          </button>
        </nav>

        <div className="mt-auto text-slate-500 text-sm">© 2025 AI Platform</div>
      </div>
    </>
  );
}

export default Sidebar;
