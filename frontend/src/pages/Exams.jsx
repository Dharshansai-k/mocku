import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, useLocation } from "react-router-dom";

function Exams() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 Get type from sidebar (if exists)
  const initialType = location.state?.type || "JEE";

  const [type, setType] = useState(initialType);
  const [exams, setExams] = useState([]);

  const categories = ["JEE", "GATE", "NEET", "RBI", "UPSC", "SSC"];

  useEffect(() => {
    fetch(`http://localhost:5000/api/exams?type=${type}`)
      .then((res) => res.json())
      .then(setExams);
  }, [type]);

  return (
    <Layout>
      <div className="p-6">

        {/* 🔥 Categories */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {categories.map((c, i) => (
            <button
              key={i}
              onClick={() => setType(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  type === c
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 📚 Exams List */}
        <div className="grid md:grid-cols-3 gap-4">

          {exams.length === 0 ? (
            <p>No exams available</p>
          ) : (
            exams.map((exam, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
              >
                <h3 className="font-bold text-lg mb-2">
                  {exam.title}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {exam.questions.length} Questions
                </p>

                <p className="text-sm text-gray-500 mb-3">
                  ⏱ {exam.duration} mins
                </p>

                <button
                  onClick={() =>
                    navigate("/exams/test", { state: { exam } })
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                  Start Test
                </button>
              </div>
            ))
          )}

        </div>

      </div>
    </Layout>
  );
}

export default Exams;