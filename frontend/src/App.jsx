import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5000/api/auth/me", { headers: { Authorization: token } })
        .then((res) => {
          setUserRole(res.data.role);
          setUserName(res.data.name);
        })
        .catch(() => localStorage.removeItem("token")); // invalid/expired token
    }
  }, []);

  if (!userRole) {
    return showLogin ? (
      <Login
        setUserRole={setUserRole}
        setUserName={setUserName}
        switchPage={() => setShowLogin(false)}
      />
    ) : (
      <Signup
        setUserRole={setUserRole} 
        setUserName={setUserName} 
        switchPage={() => setShowLogin(true)}
      />
    );
  }

  return userRole === "admin" ? <AdminDashboard /> : <StudentDashboard name={userName} />;
}
