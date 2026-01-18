import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white/70 backdrop-blur-xl border-r border-slate-200 p-6">
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-xl font-semibold text-slate-900">AI Admin</h1>
        <p className="text-xs text-slate-500">Trust Evaluation Platform</p>
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-sm">
        <SidebarItem to="/dashboard" icon="📊" label="Dashboard" />
        <SidebarItem to="/manageuser" icon="👤" label="Users" />
        <SidebarItem to="/question" icon="📄" label="Questions" />
        <SidebarItem to="/settingtest" icon="⚙️" label="Settings" />
      </nav>
      <div className="my-6 border-t border-slate-200" />
      {/* Logout */}{' '}
      <button className=" mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition ">
        {' '}
        🚪 Logout{' '}
      </button>
    </aside>
  );
}

function SidebarItem({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
        ${
          isActive
            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
            : 'text-slate-600 hover:bg-slate-100'
        }
      `
      }
    >
      <span>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}
