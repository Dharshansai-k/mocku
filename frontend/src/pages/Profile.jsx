import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Profile() {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);

  const [form, setForm] = useState({ name: "", phone: "" });
  const [activeTab, setActiveTab] = useState(null);

  const [stats, setStats] = useState({
    tests: 0,
    avgScore: 0,
    streak: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!storedUser) return;

        setUser(storedUser);

        setForm({
          name: storedUser.name || "",
          phone: storedUser.phone || "",
        });

        // 📊 Fetch results
        const res = await fetch(
          `https://mocku-backend-1v48.onrender.com/api/results/user/${storedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ FIXED
            },
          }
        );

        const data = await res.json();
        setResults(data);

        // 🔢 Stats
        const totalTests = data.length;

        let totalScore = 0;
        data.forEach((r) => {
          totalScore += (r.score / r.total) * 100;
        });

        const avgScore =
          totalTests === 0 ? 0 : Math.round(totalScore / totalTests);

        const streak = totalTests >= 3 ? 3 : totalTests;

        setStats({
          tests: totalTests,
          avgScore,
          streak,
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) return null;

  return (
    <Layout>
      <div className="p-6">

        {/* 👤 HEADER */}
        <div className="bg-blue-600 text-white p-6 rounded-xl text-center shadow">
          <h2 className="text-2xl font-bold">
            {user.name?.charAt(0) || "U"}
          </h2>
          <p className="text-lg mt-1">{user.name}</p>
          <p className="text-sm opacity-80">{user.email}</p>
        </div>

        {/* 📊 STATS */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-center">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-xl font-bold">{stats.tests}</p>
            <p className="text-gray-500 text-sm">Tests</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-xl font-bold">{stats.avgScore}%</p>
            <p className="text-gray-500 text-sm">Avg Score</p>
          </div>
        </div>

        {/* ⚙️ MENU */}
        <div className="bg-white mt-6 rounded-xl shadow divide-y">
          <div onClick={() => setActiveTab("edit")} className="p-4 hover:bg-gray-50 cursor-pointer">
            Edit Profile
          </div>

          <div onClick={() => setActiveTab("results")} className="p-4 hover:bg-gray-50 cursor-pointer">
            My Results
          </div>

          <div onClick={() => setActiveTab("saved")} className="p-4 hover:bg-gray-50 cursor-pointer">
            Saved Tests
          </div>

          <div onClick={() => setActiveTab("help")} className="p-4 hover:bg-gray-50 cursor-pointer">
            Help & Support
          </div>
        </div>

        {/* ✏️ EDIT PROFILE */}
        {activeTab === "edit" && (
          <div className="bg-white mt-4 p-4 rounded-xl shadow">
            <h3 className="font-bold mb-3">Edit Profile</h3>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Name"
            />

            <input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="border p-2 w-full mb-2"
              placeholder="Phone"
            />

            <button
              onClick={async () => {
                const token = localStorage.getItem("token");

                const res = await fetch(
                  "https://mocku-backend-1v48.onrender.com/api/auth/update",
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`, // ✅ FIXED
                    },
                    body: JSON.stringify(form),
                  }
                );

                const updated = await res.json();

                localStorage.setItem("user", JSON.stringify(updated));
                setUser(updated);
                setActiveTab(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        )}

        {/* 📊 RESULTS */}
        {activeTab === "results" && (
          <div className="bg-white mt-4 p-4 rounded-xl shadow">
            <h3 className="font-bold mb-3">My Results</h3>
              
            {results.length === 0 ? (
              <p className="text-gray-500">No tests yet</p>
            ) : (
              results.map((r, i) => (
                <div key={i} className="p-3 border-b">
                  <p className="font-medium">
                    {r.examTitle || `Test ${i + 1}`}
                  </p>

                  <p className="text-sm text-gray-500">
                    {r.examType || "General"} • {r.score}/{r.total}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ⭐ SAVED */}
        {activeTab === "saved" && (
          <div className="bg-white mt-4 p-4 rounded-xl shadow">
            <h3 className="font-bold mb-3">Saved Tests</h3>

            {(JSON.parse(localStorage.getItem("saved")) || []).length === 0 ? (
              <p className="text-gray-500">No saved tests</p>
            ) : (
              (JSON.parse(localStorage.getItem("saved")) || []).map((e, i) => (
                <p key={i}>{e.name}</p>
              ))
            )}
          </div>
        )}

        {/* 📞 HELP */}
        {activeTab === "help" && (
          <div className="bg-white mt-4 p-4 rounded-xl shadow">
            <h3 className="font-bold mb-3">Help & Support</h3>

            <p>Email: support@mocku.in</p>
            <p>Phone: +91 9876543210</p>

            <textarea
              placeholder="Write your issue..."
              className="border w-full mt-2 p-2"
            />

            <button className="bg-green-600 text-white px-4 py-2 mt-2 rounded">
              Send
            </button>
          </div>
        )}

      </div>
    </Layout>
  );
}

export default Profile;