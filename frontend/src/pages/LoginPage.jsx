// pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/client";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Both fields are required.");
      return;
    }
    try {
      const res = await loginUser(form);
      login(res.data);
      if (res.data.role === "staff") {
        navigate("/staff");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed.");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <div className="form-group">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleSubmit}>Login</button>
        <button onClick={() => navigate("/register")}>
          Don't have an account? Register
        </button>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  );
}