import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Login({ setToken }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔐 LOGIN
  const handleLogin = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
    } else {
      alert("Invalid credentials");
    }
  };

  // 🆕 REGISTER
  const handleRegister = async () => {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("User registered! Now login.");
      setIsRegister(false);
    } else {
      alert(data.detail || "Registration failed");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "radial-gradient(circle at top, #1a1a1a, #050505)"
    }}>
      <div className="glass-card glow" style={{ padding: "30px", width: "320px" }}>
        
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          {isRegister ? "Create Account 🆕" : "Welcome Back 👋"}
        </h2>

        <input
          className="input-glass"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input-glass"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn-glass"
          onClick={isRegister ? handleRegister : handleLogin}
        >
          {isRegister ? "Sign Up" : "Login"}
        </button>

        {/* 🔄 TOGGLE */}
        <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}>
          {isRegister ? "Already have an account?" : "New user?"}
          <span
            style={{ marginLeft: "8px", cursor: "pointer", color: "#aaa" }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login" : "Sign Up"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;