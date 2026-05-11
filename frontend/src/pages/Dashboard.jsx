import { useEffect, useState } from "react";
import Layout from "../components/Layout";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [stats, setStats] = useState({
    tests: 0,
    avgScore: 0,
    accuracy: 0,
    grade: "N/A",
  });

  const [results, setResults] = useState([]);
  const [sectionStats, setSectionStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) return;

        const res = await fetch(
          `https://mocku-backend-1v48.onrender.com/api/results/user/${user._id}`
        );

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.log("Invalid results:", data);
          setLoading(false);
          return;
        }

        setResults(data);

        // 📊 Stats
        const totalTests = data.length;

        let totalScorePercent = 0;
        let correctAnswers = 0;
        let totalQuestions = 0;

        data.forEach((r) => {
          if (!r.total) return;

          totalScorePercent += (r.score / r.total) * 100;
          correctAnswers += r.score;
          totalQuestions += r.total;
        });

        const avgScore =
          totalTests === 0
            ? 0
            : Math.round(totalScorePercent / totalTests);

        const accuracy =
          totalQuestions === 0
            ? 0
            : Math.round((correctAnswers / totalQuestions) * 100);

        let grade = "F";
        if (avgScore >= 90) grade = "A+";
        else if (avgScore >= 75) grade = "A";
        else if (avgScore >= 60) grade = "B";
        else if (avgScore >= 40) grade = "C";

        setStats({
          tests: totalTests,
          avgScore,
          accuracy,
          grade,
        });

        // 📊 Section Analysis
        const secStats = {};

        data.forEach((r) => {
          r.questions?.forEach((q, i) => {
            const sec = q.subject || "General";

            if (!secStats[sec]) {
              secStats[sec] = { total: 0, correct: 0 };
            }

            secStats[sec].total++;

            if (r.answers?.[i] === q.answer) {
              secStats[sec].correct++;
            }
          });
        });

        setSectionStats(secStats);

        setLoading(false);
      } catch (err) {
        console.log("Dashboard error:", err);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <Layout>
      <div className="p-6">

        {/* 🔵 TOP STATS */}
        <div className="bg-blue-600 text-white rounded-xl p-6 flex justify-between text-center">
          <div>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.tests}
            </p>
            <p>Tests</p>
          </div>

          <div>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.avgScore + "%"}
            </p>
            <p>Avg Score</p>
          </div>

          <div>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.accuracy + "%"}
            </p>
            <p>Accuracy</p>
          </div>

          <div>
            <p className="text-2xl font-bold">
              {loading ? "..." : stats.grade}
            </p>
            <p>Grade</p>
          </div>
        </div>

        {/* 📈 GRAPH */}
        <div className="bg-white mt-6 p-4 rounded-xl shadow">
          <h3 className="font-bold mb-4">📈 Performance Trend</h3>

          {loading ? (
            <p>Loading...</p>
          ) : results.length === 0 ? (
            <p>No test data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={results.map((r, i) => ({
                  test: `T${i + 1}`,
                  score: r.score || 0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="test" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 📊 SECTION PERFORMANCE */}
        <div className="bg-white mt-6 p-4 rounded-xl shadow">
          <h3 className="font-bold mb-3">📊 Section Performance</h3>

          {Object.keys(sectionStats).length === 0 ? (
            <p className="text-gray-500">No data yet</p>
          ) : (
            Object.entries(sectionStats).map(([sec, data], i) => {
              const percent = Math.round(
                (data.correct / data.total) * 100
              );

              return (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm">
                    <span>{sec}</span>
                    <span>{percent}%</span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;