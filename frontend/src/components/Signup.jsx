import React, { useState } from "react";
import axios from "axios";

export default function Signup({ switchPage, setUserRole, setUserName }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role

  const handleSignup = async () => {
    try {
      // 1️⃣ Create user
      await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        role,
      });

      // 2️⃣ Automatically login after signup
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // 3️⃣ Store token and update parent state
      localStorage.setItem("token", res.data.token);
      setUserRole(res.data.role);
      setUserName(res.data.name);

      // 4️⃣ Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("student");
    } catch (err) {
      alert(err.response?.data?.message || "Signup/Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          Signup
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleSignup}
          className="w-full bg-purple-500 hover:bg-purple-600 p-2 rounded text-white font-bold transition duration-300"
        >
          Signup
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={switchPage}
            className="text-purple-700 cursor-pointer font-semibold hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
