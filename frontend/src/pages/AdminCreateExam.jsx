import { useState } from "react";
import Layout from "../components/Layout";

function AdminCreateExam() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [duration, setDuration] = useState(60);
  const [jsonInput, setJsonInput] = useState("");

  const token = localStorage.getItem("token");

  const createExam = async () => {
    try {
      // ✅ Parse JSON
      const questions = JSON.parse(jsonInput);

      // ✅ Validation
      if (!Array.isArray(questions)) {
        return alert("Questions must be array");
      }

      const res = await fetch("https://mocku-backend-1v48.onrender.com/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          type,
          duration,
          totalMarks: questions.length,
          questions,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (res.ok) {
        alert("✅ Exam Created");

        setTitle("");
        setType("");
        setDuration(60);
        setJsonInput("");
      } else {
        alert(data.msg || "Error creating exam");
      }

    } catch (err) {
      console.log(err);
      alert("❌ Invalid JSON format");
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          🛠 Create Exam
        </h1>

        {/* BASIC INFO */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">

          <input
            type="text"
            placeholder="Exam Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-3 w-full rounded mb-4"
          />

          <input
            type="text"
            placeholder="Exam Type (JEE/SSC/GATE)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-3 w-full rounded mb-4"
          />

          <input
            type="number"
            placeholder="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border p-3 w-full rounded"
          />
        </div>

        {/* JSON INPUT */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-bold mb-3">
            📄 Paste Questions JSON
          </h3>

          <textarea
            rows={18}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste JSON here...'
            className="border p-3 w-full rounded font-mono text-sm"
          />

          <button
            onClick={createExam}
            className="bg-blue-600 text-white px-6 py-3 rounded mt-4"
          >
            🚀 Create Exam
          </button>
        </div>

      </div>
    </Layout>
  );
}

export default AdminCreateExam;