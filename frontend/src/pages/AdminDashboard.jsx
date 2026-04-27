import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    tests: 0,
    attempts: 0,
    avgScore: 0,
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");

        const usersRes = await fetch(
          "http://localhost:5000/api/auth/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const users = await usersRes.json();

        const resultsRes = await fetch(
          "http://localhost:5000/api/results/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const resultsData = await resultsRes.json();

        if (!Array.isArray(users) || !Array.isArray(resultsData)) {
          console.log("API error", users, resultsData);
          return;
        }

        setResults(resultsData);

        const totalUsers = users.length;
        const totalTests = resultsData.length;

        let totalScore = 0;
        let totalAttempts = 0;

        resultsData.forEach((r) => {
          totalScore += (r.score / r.total) * 100;
          totalAttempts += r.total;
        });

        const avgScore =
          totalTests === 0 ? 0 : Math.round(totalScore / totalTests);

        setStats({
          users: totalUsers,
          tests: totalTests,
          attempts: totalAttempts,
          avgScore,
        });

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <Layout>
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-6">
          Admin Dashboard 👨‍💼
        </h1>

        {/* 📊 Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className="bg-white p-4 rounded-xl shadow hover:shadow-xl hover:-translate-y-1 transition text-center"
            >
              <p className="text-xl font-bold">
                {loading ? "..." : value}
              </p>
              <p className="text-gray-500 capitalize">{key}</p>
            </div>
          ))}
        </div>

        {/* 🔘 Navigation */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/admin/panel")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Manage Exams
          </button>

          <button
            onClick={() => navigate("/admin/create")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Exam
          </button>
        </div>

        {/* 🏆 Leaderboard */}
        <div className="bg-white mt-6 p-4 rounded-xl shadow">
          <h3 className="font-bold mb-3">Top Performers</h3>

          {results.length === 0 ? (
            <p className="text-gray-500">No data yet</p>
          ) : (
            [...results]
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((r, i) => (
                <div key={i} className="flex justify-between border-b py-2">
                  <span>{r.userId?.name || "User"}</span>
                  <span>{r.score}/{r.total}</span>
                </div>
              ))
          )}
        </div>

      </div>
    </Layout>
  );
}

export default AdminDashboard;