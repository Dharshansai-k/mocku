import { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function AdminCreateExam() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [exam, setExam] = useState({
    title: "",
    type: "JEE",
    duration: 180,
    totalMarks: 300,
    questions: [],
  });

  const [q, setQ] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    subject: "General",
    difficulty: "easy",
  });

  // ➕ Add one question to the list
  const addQuestion = () => {
    if (!q.question || q.options.some((o) => !o) || !q.answer) {
      alert("Fill question, all options, and answer");
      return;
    }

    setExam((prev) => ({
      ...prev,
      questions: [...prev.questions, q],
    }));

    // reset form
    setQ({
      question: "",
      options: ["", "", "", ""],
      answer: "",
      subject: "General",
      difficulty: "easy",
    });
  };

  // 🚀 Submit exam to backend
  const submitExam = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/exams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(exam),
    });

    const data = await res.json();

    console.log("Response:", data); // 🔥 DEBUG

    if (!res.ok) {
      alert(data.message || "Error creating exam");
      return;
    }

    alert("Exam created successfully ✅");
  } catch (err) {
    console.log(err);
    alert("Server error ❌");
  }
};

  return (
    <Layout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
          Create Exam 🧠
        </h1>

        {/* 📝 Exam Info */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <input
            placeholder="Exam Title"
            value={exam.title}
            onChange={(e) =>
              setExam({ ...exam, title: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />

          <select
            value={exam.type}
            onChange={(e) =>
              setExam({ ...exam, type: e.target.value })
            }
            className="border p-2 w-full mb-2"
          >
            <option>JEE</option>
            <option>GATE</option>
            <option>RBI</option>
            <option>SSC</option>
          </select>

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={exam.duration}
            onChange={(e) =>
              setExam({ ...exam, duration: Number(e.target.value) })
            }
            className="border p-2 w-full mb-2"
          />

          <input
            type="number"
            placeholder="Total Marks"
            value={exam.totalMarks}
            onChange={(e) =>
              setExam({ ...exam, totalMarks: Number(e.target.value) })
            }
            className="border p-2 w-full"
          />
        </div>

        {/* ❓ Question Builder */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h3 className="font-bold mb-3">Add Question</h3>

          <input
            placeholder="Question"
            value={q.question}
            onChange={(e) =>
              setQ({ ...q, question: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />

          {q.options.map((opt, i) => (
            <input
              key={i}
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => {
                const updated = [...q.options];
                updated[i] = e.target.value;
                setQ({ ...q, options: updated });
              }}
              className="border p-2 w-full mb-2"
            />
          ))}

          <input
            placeholder="Correct Answer"
            value={q.answer}
            onChange={(e) =>
              setQ({ ...q, answer: e.target.value })
            }
            className="border p-2 w-full mb-2"
          />

          <button
            onClick={addQuestion}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Question
          </button>
        </div>

        {/* 📋 Preview */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h3 className="font-bold mb-3">
            Questions Added: {exam.questions.length}
          </h3>

          {exam.questions.map((q, i) => (
            <p key={i} className="text-sm border-b py-1">
              {i + 1}. {q.question}
            </p>
          ))}
        </div>

        {/* 🚀 Submit */}
        <button
          onClick={submitExam}
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          Create Exam
        </button>

      </div>
    </Layout>
  );
}

export default AdminCreateExam;