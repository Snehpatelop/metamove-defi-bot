import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [status, setStatus] = useState("");

  const runTradingAgent = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/run`);
      setStatus(response.data);
    } catch (error) {
      setStatus("Error running trading agent");
    }
  };

  return (
    <div>
      <h1>MetaMove DeFi Trading Bot</h1>
      <button onClick={runTradingAgent}>Run Agent</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
