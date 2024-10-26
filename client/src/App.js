import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Components
import { LineChart, XAxis, Tooltip, CartesianGrid, Line } from "recharts";

function App() {
  const socketRef = useRef();
  const [data, setdata] = useState([]);

  useEffect(() => {
    // Initialize the socket connection if not already connected
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5500/");
    }

    // Listen for "message" event from the server
    socketRef.current.on("message", (message) => {
      setdata(message);
    });

    // Clean up on component unmount or before re-initializing
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  console.log(data);

  return (
    <div>
      <LineChart width={1000} height={400} data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <XAxis dataKey="name" />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line type="monotone" dataKey="x" stroke="#ff7300" yAxisId={0} />
        <Line type="monotone" dataKey="y" stroke="#387908" yAxisId={1} />
      </LineChart>
    </div>
  );
}

export default App;
