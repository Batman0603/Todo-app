import { useState } from "react";
import Login from "./components/Login";
import Home from "./pages/Home";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <>
      {token ? (
        <Home setToken={setToken} />
      ) : (
        <Login setToken={setToken} />
      )}
    </>
  );
}

export default App;