import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 🔐 Password Strength Function
  const getStrength = () => {
    if (password.length < 6) return "Weak";
    if (password.length < 10) return "Medium";
    return "Strong";
  };

  // const handleSignup = (e) => {
  //   e.preventDefault();

  //   if (!name || !email || !password || !confirmPassword) {
  //     setError("All fields are required");
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match");
  //     return;
  //   }

  //   setError("");
  //   setSuccess(true);

  //   // ⏳ Redirect after 2 sec
  //   setTimeout(() => {
  //     localStorage.setItem("token", "dummy");
  //     navigate("/home");
  //   }, 2000);
  // };
  const handleSignup = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("https://mocku-backend-1v48.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg);
      return;
    }

    alert("Signup successful ✅");
    navigate("/login");

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
};

  return (
    <div className="min-h-screen flex">

      {/* ⚪ LEFT */}
      <div className="flex-1 flex justify-center items-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-80">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Account
          </h2>

          {/* ❌ Error */}
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">
              {error}
            </p>
          )}

          {/* 🎉 Success */}
          {success && (
            <p className="text-green-500 text-sm mb-3 text-center">
              Account created successfully 🎉
            </p>
          )}

          <form onSubmit={handleSignup}>
            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-2 border rounded focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 🔐 Strength Indicator */}
            {password && (
              <p
                className={`text-sm mb-3 ${
                  getStrength() === "Weak"
                    ? "text-red-500"
                    : getStrength() === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                Strength: {getStrength()}
              </p>
            )}

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 mb-4 border rounded focus:ring-2 focus:ring-indigo-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Button */}
            <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* 🔵 RIGHT */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">MockU 🚀</h1>

        <p className="text-lg text-center max-w-md">
          Join thousands of students preparing for placements and competitive exams.
        </p>

        <div className="mt-8 space-y-3 text-sm">
          <p>✔ 500+ Mock Tests</p>
          <p>✔ Real Exam Experience</p>
          <p>✔ Smart Performance Insights</p>
        </div>
      </div>

    </div>
  );
}

export default Signup;