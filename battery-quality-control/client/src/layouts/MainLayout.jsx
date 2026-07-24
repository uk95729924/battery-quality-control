import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 flex-1 bg-slate-100 min-h-screen flex flex-col overflow-hidden">

        <Navbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {children}
        </main>

      </div>
    </div>
  );
}

export default MainLayout;