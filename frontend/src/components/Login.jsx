import React, { useState } from "react";
import axios from "axios";

export default function Login({ setUserRole, setUserName, switchPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUserRole(res.data.role);
      setUserName(res.data.name);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">Login</h2>
        <input
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-purple-500 hover:bg-purple-600 p-2 rounded text-white font-bold"
          onClick={handleLogin}
        >
          Login
        </button>

        {/* Link to Signup */}
        <p className="mt-4 text-center text-sm text-gray-600">
          New user?{" "}
          <span
            onClick={switchPage}
            className="text-purple-700 cursor-pointer font-semibold hover:underline"
          >
            Signup here
          </span>
        </p>
      </div>
    </div>
  );
}
