import { useState, useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  const [data, setdata] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:5500/");
    socket.on("connect", () => {
      socket.on("message", (message) => {
        setdata(message)
      });
    });
  }, []);

  return (
    <div>
      <h1>{data}</h1>
    </div>
  );
}

export default App;
