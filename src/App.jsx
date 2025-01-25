import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import "chart.js/auto";

import Header from "./components/Header";
import Card from "./components/Card";
import MemoryUsage from "./components/MemoryCard";
import Main from "./components/Main";
import MobileMain from "./components/MobileMain";

const App = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [data, setData] = useState({
    clockSpeed: 0,
    temperature: 0,
    gpuClock: 0,
    cpuUsage: 0,
  });
  const [history, setHistory] = useState([]);
  const [cpuHistory, setCpuHistory] = useState([]);

  const [memoryData, setMemoryData] = useState({
    totalMemory: 0,
    usedMemory: 0,
    freeMemory: 0,
  });

  const [networkData, setNetworkData] = useState([]);

  useEffect(() => {
    const fetchCpuUsage = () => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/cpu`)
        .then((response) => {
          setData((prevData) => ({
            ...prevData,
            cpuUsage: response.data.cpuUsage,
          }));
        })
        .catch((err) => console.error("error fetching CPU usage:", err));
    };

    fetchCpuUsage();

    const interval = setInterval(fetchCpuUsage, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchNetworkData = () => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/network`)
        .then((response) => {
          setNetworkData((prevData) => [...prevData, response.data]);
        })
        .catch((err) => console.error("error fetching network data:", err));
    };

    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/monitor`)
        .then((response) => {
          setData(response.data);
        })
        .catch((err) => console.error(err));

      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/history`)
        .then((response) => setHistory(response.data))
        .catch((err) => console.error(err));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCpuHistory = () => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/cpu-history`)
        .then((response) => setCpuHistory(response.data))
        .catch((err) => console.error("error fetching CPU history:", err));
    };

    fetchCpuHistory();
    const interval = setInterval(fetchCpuHistory, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCpuUsage = () => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/cpu`)
        .then((response) => {
          setData((prevData) => ({
            ...prevData,
            cpuUsage: response.data.cpuUsage,
          }));
        })
        .catch((err) => console.error("error fetching CPU usage:", err));
    };

    fetchCpuUsage(); 

    const interval = setInterval(fetchCpuUsage, 1000);
    return () => clearInterval(interval);
  }, []);

  const freqData = {
    labels: history.map((item) =>
      new Date(item.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "CPU Clock Speed (MHz)",
        data: history.map((item) => item.clockSpeed),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
      },
    ],
  };

  useEffect(() => {
    const fetchMemoryData = () => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/memory`)
        .then((response) => setMemoryData(response.data))
        .catch((err) => console.error("error fetching memory usage:", err));
    };

    fetchMemoryData();
    const interval = setInterval(fetchMemoryData, 1000);
    return () => clearInterval(interval);
  }, []);

  const tempData = {
    labels: history.map((item) =>
      new Date(item.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Temperature (°C)",
        data: history.map((item) => item.temperature),
        borderColor: "rgba(255,99,132,1)",
        fill: false,
      },
    ],
  };

  const gpuData = {
    labels: history.map((item) =>
      new Date(item.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "GPU Clock Speed (MHz)",
        data: history.map((item) => item.gpuClock),
        borderColor: "rgba(54, 162, 235, 1)",
        fill: false,
      },
    ],
  };

  const cpuUsageData = {
    labels: cpuHistory.map((item) =>
      new Date(item.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "CPU Usage (%)",
        data: cpuHistory.map((item) => item.cpuUsage),
        borderColor: "rgba(153, 102, 255, 1)",
        fill: false,
      },
    ],
  };

  const barData = {
    labels: ["Used Memory", "Free Memory"],
    datasets: [
      {
        label: "Memory Usage (MB)",
        data: [memoryData.usedMemory, memoryData.freeMemory],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const networkChartData = {
    labels: networkData.map((item) =>
      new Date(item.timestamp).toLocaleTimeString()
    ),
    datasets: [
      {
        label: "Upload Speed (Mbps)",
        data: networkData.map((item) => item.uploadSpeed),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
      {
        label: "Download Speed (Mbps)",
        data: networkData.map((item) => item.downloadSpeed),
        borderColor: "rgba(255, 99, 132, 1)",
        fill: false,
      },
    ],
  };

  const barOptions = { // index axis y? maybe x
    indexAxis: "x",
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const latestNetworkData = networkData[networkData.length - 1] || {
    uploadSpeed: 0,
    downloadSpeed: 0,
  };

  // fix tailwind import

  return (
    <div style={{ textAlign: "center", marginTop: "0px" }}>
      <Header />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
        {isMobile ? <MobileMain /> : <Main />}
      </div> 

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          title="CPU Clock Speed"
          content={`${data.clockSpeed} MHz`}
          chartData={freqData}
        />
        <Card
          title="GPU Clock Speed"
          content={`${data.gpuClock} MHz`}
          chartData={gpuData}
        />
        <Card
          title="Temperature"
          content={`${data.temperature} °C`}
          chartData={tempData}
        />
        <Card
          title="CPU Usage"
          content={`${data.cpuUsage}%`}
          chartData={cpuUsageData}
        />
        <Card
          title="Memory Usage"
          content={
            <MemoryUsage
              {...memoryData}
              barData={barData}
              barOptions={barOptions}
            />
          }
        />
        <Card
          title="Network Activity"
          content={`Upload: ${latestNetworkData.uploadSpeed} Mbps, Download: ${latestNetworkData.downloadSpeed} Mbps`}
          chartData={networkChartData}
        />
      </div>
    </div>
  );
};

export default App;
