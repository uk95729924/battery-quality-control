import {
  FaHome,
  FaDatabase,
  FaCogs,
  FaBrain,
  FaMicroscope,
  FaChartLine,
  FaFileAlt,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      name: "Dataset",
      icon: <FaDatabase />,
      path: "/upload",
    },
    {
      name: "Preprocessing",
      icon: <FaCogs />,
      path: "/preprocessing",
    },
    {
      name: "Training",
      icon: <FaBrain />,
      path: "/train",
    },
    {
      name: "Diagnosis",
      icon: <FaMicroscope />,
      path: "/diagnosis",
    },
    {
      name: "Prognosis",
      icon: <FaChartLine />,
      path: "/prognosis",
    },
    {
      name: "Reports",
      icon: <FaFileAlt />,
      path: "/reports",
    },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white fixed left-0 top-0">

      {/* Logo */}
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        Electrode QC
      </div>

      {/* Menu */}
      <ul className="mt-6 px-3 space-y-2">

        {menuItems.map((item) => (

          <li key={item.name}>

            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200
              ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-gray-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>

              <span className="font-medium">
                {item.name}
              </span>
            </Link>

          </li>

        ))}

      </ul>

    </div>
  );
}

export default Sidebar;