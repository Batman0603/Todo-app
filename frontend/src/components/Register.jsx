import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, password }),
    });

    alert("User created! Now login.");
  };

  return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:"100vh"}}>
      <div className="card-3d" style={{padding:"30px", width:"300px"}}>
        <h2>Register</h2>

        <input className="input-3d" placeholder="Username"
          onChange={(e)=>setUsername(e.target.value)} />

        <input className="input-3d" type="password" placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)} />

        <button className="btn-3d" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;