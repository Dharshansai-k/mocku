import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { GoogleLogin } from "@react-oauth/google";
//import jwtDecode from "jwt-decode";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   if (email && password) {
  //     localStorage.setItem("token", "dummy");
  //     navigate("/home");
  //   }
  // };
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("https://mocku-backend-1v48.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    // ❗ handle errors
    if (!res.ok) {
      alert(data.msg || "Login failed");
      return;
    }

    // ✅ store token + user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // 🔥 ROLE-BASED REDIRECT
    if (data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }

  } catch (err) {
    console.log(err);
    alert("Server error ❌");
  }
};

  return (
    <div className="min-h-screen flex">

      {/* 🔵 LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex-col justify-center items-center p-10">
        
        <h1 className="text-4xl font-bold mb-4 hover:scale-105 transition">
          MockU 🚀
        </h1>

        <p className="text-lg text-center max-w-md">
          Practice mock tests for placements and competitive exams.
          Analyze your performance and improve faster.
        </p>

        <div className="mt-8 space-y-3 text-sm">
          <p className="hover:translate-x-1 transition">✔ 500+ Mock Tests</p>
          <p className="hover:translate-x-1 transition">✔ Performance Analytics</p>
          <p className="hover:translate-x-1 transition">✔ Smart Insights</p>
        </div>
      </div>

      {/* ⚪ RIGHT SIDE */}
      <div className="flex-1 flex justify-center items-center bg-gray-100">

        <div className="bg-white p-8 rounded-xl shadow-lg w-80 hover:shadow-2xl transition">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Login to MockU
          </h2>

          <form onSubmit={handleLogin}>
            
            {/* 📧 Email */}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* 🔑 Password */}
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 🔘 Button */}
            <button
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 hover:scale-105 active:scale-95 transition mb-4"
            >
              Login
            </button>

          </form>

          {/* Divider */}
          <div className="text-center text-gray-400 mb-4">OR</div>

          {/* 🔐 Google Login (disabled safely) */}
          <div className="flex justify-center">
            {/* Google login placeholder (safe, no crash) */}
            <button
              className="border px-4 py-2 rounded text-gray-500 cursor-not-allowed"
              disabled
            >
              Google Login (Coming Soon)
            </button>
          </div>

          {/* 🔗 Signup */}
          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Signup
            </span>
          </p>

        </div>

      </div>
    </div>
  );
}

export default Login;