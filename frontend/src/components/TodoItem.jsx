function TodoItem({ todo, deleteTodo, toggleTodo }) {
  return (
    <div style={{ margin: "10px 0" }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />

      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          marginLeft: "10px",
        }}
      >
        {todo.title}
      </span>

      <button onClick={() => deleteTodo(todo.id)} style={{ marginLeft: "10px" }}>
        Delete
      </button>
    </div>
  );
}

export default TodoItem;