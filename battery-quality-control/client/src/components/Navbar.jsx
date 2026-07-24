import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Sirf login session remove hoga
    localStorage.removeItem("isLoggedIn");

    alert("Logged out successfully");

    navigate("/login");
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-8">
      <h1 className="text-xl font-bold">
        Intelligent Electrode Quality Control System
      </h1>

      <button
        onClick={handleLogout}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;