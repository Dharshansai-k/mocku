import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ SAFE DATA FETCH (VERY IMPORTANT)
  const data = location.state || {};

  const score = data.score || 0;
  const total = data.total || 0;
  const questions = data.questions || [];
  const answers = data.answers || [];
  const timeSpent = data.timeSpent || [];

  // 🛑 If no data → fallback UI
  if (!questions.length) {
    return (
      <Layout>
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold">No Result Data Found ❌</h2>
          <button
            onClick={() => navigate("/exams")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go to Exams
          </button>
        </div>
      </Layout>
    );
  }

  // 📊 Calculations
  const correct = questions.filter((q, i) => answers[i] === q.answer).length;
  const wrong = answers.filter((a, i) => a && a !== questions[i]?.answer).length;
  const skipped = total - (correct + wrong);
  const percentage = Math.round((correct / total) * 100);

  // 📊 Section Stats
  const subjectStats = {};

  questions.forEach((q, i) => {
    const subject = q.subject || "General";

    if (!subjectStats[subject]) {
      subjectStats[subject] = {
        correct: 0,
        wrong: 0,
        total: 0,
        time: 0,
      };
    }

    subjectStats[subject].total++;

    if (answers[i] === q.answer) {
      subjectStats[subject].correct++;
    } else if (answers[i]) {
      subjectStats[subject].wrong++;
    }

    subjectStats[subject].time += timeSpent[i] || 0;
  });

  return (
    <Layout>
      <div className="p-6">

        {/* 🔥 HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl text-center">
          <h1 className="text-5xl font-bold">{score}/{total}</h1>
          <p className="mt-2">{percentage}% Score</p>

          <div className="flex justify-center gap-6 mt-4 text-sm">
            <p>✅ {correct}</p>
            <p>❌ {wrong}</p>
            <p>⏭ {skipped}</p>
          </div>
        </div>

        {/* 📊 SECTION ANALYSIS */}
        <div className="bg-white mt-6 p-4 rounded-xl shadow">
          <h3 className="font-bold mb-3">📊 Section Analysis</h3>

          {Object.entries(subjectStats).map(([sec, data], i) => (
            <div key={i} className="border-b py-2">
              <div className="flex justify-between">
                <span>{sec}</span>
                <span>{data.correct}/{data.total}</span>
              </div>
              <p className="text-xs text-gray-500">
                ⏱ {data.time}s
              </p>
            </div>
          ))}
        </div>

        {/* 📚 QUESTIONS REVIEW */}
        <div className="bg-white mt-6 p-4 rounded-xl shadow">
          <h3 className="font-bold mb-4">📚 Answer Review</h3>

          {questions.map((q, i) => (
            <div key={i} className="mb-6 border-b pb-4">

              <p className="font-medium">
                Q{i + 1}. {q.question}
              </p>

              {q.options.map((opt, j) => (
                <div
                  key={j}
                  className={`p-2 mt-1 rounded ${
                    opt === q.answer
                      ? "bg-green-200"
                      : opt === answers[i]
                      ? "bg-red-200"
                      : "bg-gray-100"
                  }`}
                >
                  {opt}
                </div>
              ))}

              {/* ⏱ TIME */}
              <p className="text-sm text-gray-500 mt-2">
                ⏱ Time Spent: {timeSpent[i] || 0} sec
              </p>
            </div>
          ))}
        </div>

        {/* 🔘 BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/exams")}
            className="flex-1 bg-gray-200 py-3 rounded-xl"
          >
            🔄 Retake
          </button>

          <button
            onClick={() => navigate("/home")}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
          >
            🏠 Home
          </button>
        </div>

      </div>
    </Layout>
  );
}

export default Result;