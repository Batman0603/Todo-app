function TodoList({ todos, deleteTodo, toggleTodo }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="card-3d"
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span
            onClick={() => toggleTodo(todo.id)}
            style={{
              cursor: "pointer",
              textDecoration: todo.completed ? "line-through" : "none",
              opacity: todo.completed ? 0.5 : 1
            }}
          >
            {todo.title}
          </span>

          <button className="btn-3d" onClick={() => deleteTodo(todo.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default TodoList;