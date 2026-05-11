import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://mocku-backend-1v48.onrender.com/api/exams")
      .then((res) => res.json())
      .then(setExams);
  }, []);

  const addExam = async () => {
    if (!title) return alert("Enter title");

    const res = await fetch("https://mocku-backend-1v48.onrender.com/api/exams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        type: "General",
        duration: 60,
        totalMarks: 100,
        questions: [],
      }),
    });

    const data = await res.json();
    setExams([...exams, data]);
    setTitle("");
  };

  return (
    <Layout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">Admin Panel ⚙️</h1>

        {/* ➕ Add Exam */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h3 className="font-bold mb-3">Quick Add Exam</h3>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Exam Title"
            className="border p-2 w-full mb-2"
          />

          <div className="flex gap-3">
            <button
              onClick={addExam}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add
            </button>

            <button
              onClick={() => navigate("/admin/create")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              ➕ Full Exam Builder
            </button>
          </div>
        </div>

        {/* 📚 Exams */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-bold mb-3">All Exams</h3>

          {exams.length === 0 ? (
            <p>No exams yet</p>
          ) : (
            exams.map((e, i) => (
              <div key={i} className="border-b py-2">
                {e.title}
              </div>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}

export default AdminPanel;