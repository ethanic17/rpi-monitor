import React, { useState, useEffect } from "react";
import axios from "axios";

import Hostname from "../constants/hostname";
import "../index.css";

import portainer from "../assets/images/icons-ext/portrainer.png";
import pihole from "../assets/images/icons-ext/Pi-hole_Logo.png";
import plex from "../assets/images/icons-ext/plex.png";
import grafana from "../assets/images/icons-ext/grafana.png";

const MobileMain = () => {
  const [neofetchOutput, setNeofetchOutput] = useState("");
  const [data, setData] = useState({
    macAddress: "",
    uptime: 0,
    used: "",
    available: "",
    usage: "",
    cpuUsage: 0,
    voltage: 0,
  });

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/system`)
        .then((response) => setData(response.data))
        .catch((err) => console.error("error fetching system data:", err));
    };

    fetchData();

    const interval = setInterval(() => {
      setData((prevData) => ({
        ...prevData,
        uptime: prevData.uptime + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchVoltage = () => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/system`)
        .then((response) => {
          setData((prevData) => ({
            ...prevData,
            voltage: response.data.voltage,
          }));
        })
        .catch((err) => console.error("error fetching voltage:", err));
    };

    fetchVoltage(); 

    const interval = setInterval(fetchVoltage, 1000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/neofetch`)
      .then((response) => response.text())
      .then((data) => setNeofetchOutput(data))
      .catch((error) => console.error("error fetching neofetch output:", error));
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

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 m-2 text-left">
      <div className="flex flex-col items-start">
        <h1>Host IP Address: <a className="hostname" href={Hostname} target="_blank" rel="noopener noreferrer">{Hostname}</a></h1>
        <h1>MAC Address: {data.macAddress}</h1>
        <h3>Uptime: {formatUptime(data.uptime)}</h3>
        <h3>CPU Usage: {data.cpuUsage}%</h3>
        <h3>CPU Voltage: {data.voltage} V</h3>
        <h3>Disk Usage: {data.usage} / {data.available} available</h3>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded" onClick={() => (window.location.href = `https://connect.raspberrypi.com/devices`)}>
          <div className="flex items-center">
            <img className="logosize mr-2" src={portainer} alt="portainer" />
            VNC (RPi Connect)
          </div>
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 text-sm rounded" onClick={() => (window.location.href = `${process.env.REACT_APP_LOCAL_IP}:80`)}>
          <div className="flex items-center">
            <img className="logosize mr-2" src={pihole} alt="Pihole Logo" />
            Pi-Hole
          </div>
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded" onClick={() => (window.location.href = `${process.env.REACT_APP_LOCAL_IP}:9000`)}>
          <div className="flex items-center">
            <img className="logosize mr-2" src={portainer} alt="Portainer Logo" />
            Portainer (Docker)
          </div>
        </button>
        <button className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-3 text-sm rounded" onClick={() => (window.location.href = `${process.env.REACT_APP_LOCAL_IP}:32400`)}>
          <div className="flex items-center">
            <img className="logosize mr-2" src={plex} alt="Plex" />
            Plex
          </div>
        </button>
        <button className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-3 text-sm rounded" onClick={() => (window.location.href = `${process.env.REACT_APP_LOCAL_IP}:3000`)}>
          <div className="flex items-center">
            <img className="logosize mr-2" src={grafana} alt="Grafana" />
            Grafana
          </div>
        </button>
      </div>

      <div className="mt-4">
        <pre className="text-xs overflow-auto">{neofetchOutput}</pre>
      </div>
    </div>
  );
};

export default MobileMain;