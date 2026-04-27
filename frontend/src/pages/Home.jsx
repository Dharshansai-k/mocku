import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const exams = ["JEE", "NEET", "SSC", "BANK", "UPSC", "GATE"];

  // ✅ Smooth scroll function
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-gray-100 text-gray-800">

      {/* 🔝 HEADER */}
      <div className="fixed top-0 left-0 w-full bg-white shadow z-50 flex justify-between items-center px-6 py-4">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button onClick={() => setOpen(!open)} className="text-xl">☰</button>

          <div onClick={() => navigate("/home")} className="flex items-center gap-2 cursor-pointer">
            <img src={logo} alt="MockU" className="h-10" />
            <span className="text-xl font-bold text-blue-600">MockU</span>
          </div>
        </div>

        {/* RIGHT NAV */}
        <div className="hidden md:flex gap-6 font-medium">
          <button onClick={() => navigate("/dashboard")} className="hover:text-blue-600">Dashboard</button>
          <button onClick={() => navigate("/profile")} className="hover:text-blue-600">Profile</button>
          <button onClick={() => navigate("/exams")} className="hover:text-blue-600">Exams</button>

          {/* 🔥 ADDED */}
          <button onClick={() => scrollTo("features")} className="hover:text-blue-600">Features</button>
          <button onClick={() => scrollTo("contact")} className="hover:text-blue-600">Contact</button>

          <button onClick={() => navigate("/login")} className="text-red-500">Logout</button>
        </div>
      </div>

      {/* 📂 SIDEBAR */}
      {open && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow z-50 p-6">
          <h3 className="font-bold mb-4 text-lg">Exams</h3>

          {exams.map((exam, i) => (
            <div
              key={i}
              onClick={() => {
                navigate("/exams", { state: { type: exam } });
                setOpen(false);
              }}
              className="p-3 rounded hover:bg-blue-100 cursor-pointer"
            >
              {exam}
            </div>
          ))}

          <button onClick={() => setOpen(false)} className="mt-6 text-red-500">
            Close ✖
          </button>
        </div>
      )}

      {/* 🔥 HERO */}
      <div className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center px-6">
        <h1 className="text-5xl font-bold mb-4">
          Crack Your Exams with MockU 🚀
        </h1>

        <p className="max-w-xl mx-auto text-lg opacity-90 mb-6">
          Practice real exam-level mock tests, analyze performance,
          and boost your rank faster than ever.
        </p>

        <button
          onClick={() => navigate("/exams")}
          className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold shadow hover:scale-105 transition"
        >
          Start Practicing
        </button>

        {/* Stats */}
        <div className="flex justify-center gap-10 mt-10 text-center">
          <div>
            <p className="text-2xl font-bold">10K+</p>
            <p className="text-sm opacity-80">Students</p>
          </div>
          <div>
            <p className="text-2xl font-bold">500+</p>
            <p className="text-sm opacity-80">Mock Tests</p>
          </div>
          <div>
            <p className="text-2xl font-bold">95%</p>
            <p className="text-sm opacity-80">Success Rate</p>
          </div>
        </div>
      </div>

      {/* 📚 POPULAR EXAMS */}
      <div className="py-16 px-6 bg-white">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Popular Exams
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "JEE", icon: "📘" },
            { name: "NEET", icon: "🧬" },
            { name: "SSC", icon: "📊" },
            { name: "BANK", icon: "🏦" },
            { name: "UPSC", icon: "🏛️" },
            { name: "GATE", icon: "⚙️" },
          ].map((exam, i) => (
            <div
              key={i}
              onClick={() => navigate("/exams", { state: { type: exam.name } })}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition cursor-pointer text-center"
            >
              <div className="text-3xl mb-2">{exam.icon}</div>
              <p className="font-semibold">{exam.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 💡 FEATURES */}
      <div id="features" className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-2xl font-bold mb-8">Why MockU?</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            📊 Performance Analytics
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            🧪 Real Exam Interface
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            ⚡ Instant Results
          </div>
        </div>
      </div>

      {/* 📞 CONTACT */}
      <div id="contact" className="bg-slate-900 text-white py-10 text-center">
        <h3 className="text-lg font-bold mb-2">Contact Us</h3>
        <p>support@mocku.in</p>
        <p className="text-sm text-gray-400 mt-2">
          © 2026 MockU. All rights reserved.
        </p>
      </div>

    </div>
  );
}

export default Home;