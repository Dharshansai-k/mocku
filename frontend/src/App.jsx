import { BrowserRouter, Routes, Route } from "react-router-dom";
import Exams from "./pages/Exams";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import TestPage from "./pages/TestPage";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminCreateExam from "./pages/AdminCreateExam";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 👤 User */}
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/test" element={<TestPage />} />
        <Route path="/result" element={<Result />} />
        <Route path="/profile" element={<Profile />} />

        {/* 👨‍💼 Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* ⚙️ Admin Panel */}
          <Route
            path="/admin/panel"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* ➕ Create Exam */}
          <Route
            path="/admin/create"
            element={
              <AdminRoute>
                <AdminCreateExam />
              </AdminRoute>
            }
          />

      </Routes>
    </BrowserRouter>
  );
}

export default App;