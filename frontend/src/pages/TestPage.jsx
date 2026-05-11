import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function TestPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState([]);
  const [review, setReview] = useState([]);
  const [timeSpent, setTimeSpent] = useState([]);

  const [time, setTime] = useState(300); // ✅ 5 mins default

  const exam = location.state?.exam;

  // 📊 Stats before submit
  const getStats = () => {
    let attempted = 0;
    let reviewCount = 0;

    answers.forEach((a, i) => {
      if (a) attempted++;
      if (review[i]) reviewCount++;
    });

    return {
      attempted,
      unattempted: questions.length - attempted,
      review: reviewCount,
    };
  };

  // 🚀 Load exam
  useEffect(() => {
    const loadExam = async () => {
      try {
        let examQuestions = [];

        if (exam) {
          examQuestions = exam.questions || [];
          setTime((exam.duration || 5) );
        } else {
          const res = await fetch("https://mocku-backend-1v48.onrender.com/api/exams");
          const data = await res.json();
          examQuestions = data[0]?.questions || [];
        }

        setQuestions(examQuestions);
        setAnswers(Array(examQuestions.length).fill(""));
        setReview(Array(examQuestions.length).fill(false));
        setTimeSpent(Array(examQuestions.length).fill(0));
      } catch (err) {
        console.log(err);
      }
    };

    loadExam();
  }, [exam]);

  // ⏱️ Timer
  useEffect(() => {
    if (questions.length === 0) return;

    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev === 1) handleSubmit();
        return prev - 1;
      });

      setTimeSpent((prev) => {
        const updated = [...prev];
        updated[current] += 1;
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [current, questions]);

  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleSelect = (opt) => {
    const updated = [...answers];
    updated[current] = opt;
    setAnswers(updated);
  };

  const toggleReview = () => {
    const updated = [...review];
    updated[current] = !updated[current];
    setReview(updated);
  };

  // 🚀 CONFIRM BEFORE SUBMIT
  const confirmSubmit = () => {
    const stats = getStats();

    const msg = `
Attempted: ${stats.attempted}
Unattempted: ${stats.unattempted}
Marked for Review: ${stats.review}

Do you want to submit?
`;

    if (window.confirm(msg)) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      let score = 0;

      questions.forEach((q, i) => {
        if (answers[i] === q.answer) score++;
      });

      const user = JSON.parse(localStorage.getItem("user"));

      await fetch("https://mocku-backend-1v48.onrender.com/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          score,
          total: questions.length,

          examTitle: exam?.title,
          examType: exam?.type,

          answers,
          questions,
          timeSpent,
          totalTime: (exam?.duration || 5) * 60 - time,
        }),
      });

      navigate("/result", {
        state: {
          score,
          total: questions.length,
          questions,
          answers,
          timeSpent, // 🔥 IMPORTANT
        },
      });

    } catch (err) {
      console.log(err);
      alert("Error saving result ❌");
    }
  };

  // 🛑 Prevent crash
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading Exam...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">

      {/* 🔝 Header */}
      <div className="flex justify-between mb-6 items-center">
        <h2 className="text-xl font-bold">
          {exam?.title || "Mock Test"}
        </h2>
        <p className="text-lg font-semibold bg-slate-800 px-4 py-2 rounded">
          ⏱ {formatTime()}
        </p>
      </div>

      <div className="flex gap-6">

        {/* 📄 Question */}
        <div className="flex-1 bg-slate-800 p-6 rounded-xl">

          <h3 className="mb-4 text-lg">
            Q{current + 1}. {questions[current].question}
          </h3>

          {questions[current].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className={`block w-full text-left p-3 mb-2 rounded
                ${
                  answers[current] === opt
                    ? "bg-green-500"
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
            >
              {opt}
            </button>
          ))}

          <button
            onClick={toggleReview}
            className={`mt-3 px-4 py-2 rounded ${
              review[current] ? "bg-yellow-500" : "bg-gray-600"
            }`}
          >
            {review[current] ? "Marked ⭐" : "Mark for Review"}
          </button>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrent(current - 1)}
              disabled={current === 0}
              className="bg-gray-500 px-4 py-2 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              onClick={() => setCurrent(current + 1)}
              disabled={current === questions.length - 1}
              className="bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* ✅ Updated Submit */}
          <button
            onClick={confirmSubmit}
            className="mt-6 w-full bg-indigo-600 py-3 rounded"
          >
            Submit Test
          </button>
        </div>

        {/* 📊 Palette */}
        <div className="w-60 bg-slate-800 p-4 rounded-xl">
          <h3 className="mb-4 font-semibold">Questions</h3>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`p-2 rounded
                  ${
                    review[i]
                      ? "bg-yellow-500"
                      : answers[i]
                      ? "bg-green-500"
                      : "bg-slate-600"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TestPage;