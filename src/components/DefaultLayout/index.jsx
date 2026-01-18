import Topbar from './Topbar';
import Sidebar from './Sidebar';
// import Footer from './Footer';
export default function Layout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
