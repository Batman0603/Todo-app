import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function Home({ setToken }) {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  const token = localStorage.getItem("token");

  // 🔄 Fetch Todos
  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ➕ Add Todo
  const addTodo = async () => {
    if (!task.trim()) return;

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: task }),
      });

      if (res.ok) {
        const newTodo = await res.json();

        setTodos((prev) => [...prev, newTodo]); // ⚡ instant update
        setTask("");
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // 🔁 Toggle Complete
  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updated = await res.json();

      setTodos((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // ❌ Delete Todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "radial-gradient(circle at top, #1a1a1a, #050505)",
        color: "white",
      }}
    >
      {/* 🔥 SIGN OUT */}
      <button
        onClick={handleLogout}
        className="btn-glass"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "120px",
        }}
      >
        Sign Out
      </button>

      {/* 🧊 TITLE */}
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        My Tasks 🚀
      </h1>

      {/* ➕ ADD TASK */}
      <div
        className="glass-card"
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <input
          className="input-glass"
          placeholder="Enter new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />

        <button className="btn-glass" onClick={addTodo}>
          Add Task
        </button>
      </div>

      {/* 📋 TODO LIST */}
      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gap: "20px",
          maxWidth: "600px",
          marginInline: "auto",
        }}
      >
        {todos.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.6 }}>
            No tasks yet...
          </p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="glass-card"
              style={{
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* LEFT SIDE */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* ✅ TOGGLE BUTTON */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="btn-glass"
                  style={{
                    width: "40px",
                    background: todo.completed
                      ? "#00ffcc33"
                      : "#ff4d4d33",
                  }}
                >
                  {todo.completed ? "✓" : "✗"}
                </button>

                {/* 📝 TASK TEXT */}
                <span
                  style={{
                    textDecoration: todo.completed
                      ? "line-through"
                      : "none",
                    opacity: todo.completed ? 0.6 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  {todo.title}
                </span>
              </div>

              {/* ❌ DELETE */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="btn-glass"
                style={{ width: "80px" }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;