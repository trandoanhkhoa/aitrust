import { useState, useEffect } from 'react';
import ManagerApi from '../../../api/Manager';

export default function AdminUserPage() {
  const [mode, setMode] = useState('add'); // 'add' | 'edit'
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [search, setSearch] = useState('');

  const closeDrawer = () => {
    setShowDrawer(false);
    setSelectedUser(null);
  };
  const openAdd = () => {
    setSelectedUser({
      name: '',
      email: '',
      password: '',
      gender: '',
      gpa: '',
      studyYear: '',
      doTest: false,
      role: 'User',
    });
    setShowDrawer(true);
    setMode('add');
  };

  const openEdit = (user) => {
    //console.log(user);
    setMode('edit');
    setSelectedUser(user);
    setShowDrawer(true);
  };

  const deleteUser = (id) => {
    if (confirm('Delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };
  const handleEditUser = async () => {
    const res = await ManagerApi.edituser(selectedUser);

    const users = await ManagerApi.getallusers();
    setUsers(users.data);
    if (res.status) alert(res.message);
    else {
      alert(res.message);
    }
  };
  const handleAddUser = async () => {
    const res = await ManagerApi.adduser(selectedUser);
    if (res.status) alert(res.message);
    else {
      alert(res.message);
    }
    const users = await ManagerApi.getallusers();
    setUsers(users.data);
  };
  const handleChange = (field, value) => {
    setSelectedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  useEffect(() => {
    const fetchdata = async () => {
      const res = await ManagerApi.getallusers();
      setUsers(res.data);

      //console.log(res.data);
    };
    fetchdata();
  }, []);
  return (
    <div className="min-h-screen p-6 text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold tracking-wide text-slate-900">User Management</h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-medium transition"
        >
          + Add User
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <input
          type="text"
          name="search"
          autoComplete="off"
          inputMode="search"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 px-4 py-2 rounded-lg
      bg-white/70 backdrop-blur-md
      border border-slate-200
      shadow-sm
      focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white/70 backdrop-blur-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Email</th>
              <th className="p-3 text-left font-medium">Major</th>
              <th className="p-3 text-left font-medium">Status</th>
              <th className="p-3 text-left font-medium">Role</th>
              <th className="p-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(
                (u) =>
                  u.name.toLowerCase().includes(search.toLowerCase()) ||
                  u.email.toLowerCase().includes(search.toLowerCase()),
              )
              .map((user) => (
                <tr key={user.id} className="border-t hover:bg-slate-50 transition">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3 text-slate-500">{user.email}</td>
                  <td className="p-3">{user.major}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        user.doTest === true
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.doTest ? 'Hoàn thành' : 'Chưa hoàn thành'}
                    </span>
                  </td>
                  <td className="p-3">{user.role}</td>

                  <td className="p-3 text-right space-x-3">
                    <button
                      onClick={() => openEdit(user)}
                      className="text-cyan-600 hover:text-cyan-500 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-500 hover:text-red-400 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 flex justify-end bg-black/20 backdrop-blur-sm">
          <div className="w-[400px] h-full bg-white/80 backdrop-blur-xl border-l border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              {mode === 'edit' ? 'Edit User' : 'Add User'}
            </h2>

            <div className="space-y-4">
              <input type="hidden" defaultValue={selectedUser?.id} />
              <input
                value={selectedUser?.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300"
              />
              <input
                value={selectedUser?.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300"
              />
              <input
                autoComplete="off"
                name="newpassword"
                value={selectedUser?.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300"
                type="password"
              />
              <input
                value={selectedUser?.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
                placeholder="Gender"
                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300"
              />
              <input
                value={selectedUser?.gpa || ''}
                onChange={(e) => handleChange('gpa', e.target.value)}
                placeholder="GPA"
                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300"
              />
              <input
                value={selectedUser?.studyYear || ''}
                onChange={(e) => handleChange('studyYear', e.target.value)}
                placeholder="Year of study"
                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300"
              />
              <select
                value={selectedUser.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!selectedUser?.doTest}
                  onChange={(e) => handleChange('doTest', e.target.checked)}
                  className="w-5 h-5 rounded border border-slate-300"
                />
                <label className="text-sm text-slate-700">Đã hoàn thành</label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => closeDrawer()}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  mode === 'edit' ? handleEditUser() : handleAddUser();
                }}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
