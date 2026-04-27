import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const navItems = [
    { name: "Home", path: "/home" },
    { name: "Exams", path: "/exams" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
  ];

  const exams = ["JEE", "NEET", "SSC", "BANK", "UPSC", "GATE"];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔝 HEADER */}
      <div className="fixed top-0 left-0 w-full bg-white shadow z-50">
        <div className="flex justify-between items-center px-6 py-3">

          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(!open)} className="text-xl md:hidden">
              ☰
            </button>

            <img
              src={logo}
              alt="MockU"
              className="h-9 cursor-pointer"
              onClick={() => navigate("/home")}
            />
          </div>

          <div className="hidden md:flex gap-6 text-sm font-medium">
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={
                  location.pathname === item.path
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }
              >
                {item.name}
              </button>
            ))}

            {/* 👨‍💼 Admin */}
            {user?.role === "admin" && (
              <button onClick={() => navigate("/admin")}>
                Admin
              </button>
            )}

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* 📂 SIDEBAR */}
      {open && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow z-40 p-6">

          <h3 className="font-bold mb-4">Exams</h3>

          {exams.map((exam, i) => (
            <div
              key={i}
              onClick={() => {
                navigate("/exams");
                setOpen(false);
              }}
              className="p-2 rounded hover:bg-blue-100 cursor-pointer"
            >
              {exam}
            </div>
          ))}

          <button
            onClick={() => setOpen(false)}
            className="mt-6 text-red-500"
          >
            Close ✖
          </button>
        </div>
      )}

      {/* 📦 CONTENT */}
      <div className="pt-16 px-4 pb-16">{children}</div>

      {/* 📱 MOBILE NAV */}
      <div className="fixed bottom-0 w-full bg-white shadow flex justify-around p-3 md:hidden">
        <button onClick={() => navigate("/home")}>🏠</button>
        <button onClick={() => navigate("/exams")}>📚</button>
        <button onClick={() => navigate("/dashboard")}>📊</button>
        <button onClick={() => navigate("/profile")}>👤</button>
      </div>

    </div>
  );
}

export default Layout;