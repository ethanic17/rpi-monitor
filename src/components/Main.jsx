import React, { useState, useEffect } from "react";
import axios from "axios";

import Hostname from "../constants/hostname";
import "../index.css";

import www from "../assets/images/icons-ext/www.png";
import portainer from "../assets/images/icons-ext/portrainer.png";
import pihole from "../assets/images/icons-ext/Pi-hole_Logo.png";
import plex from "../assets/images/icons-ext/plex.png";
import grafana from "../assets/images/icons-ext/grafana.png";

const Main = ({ props }) => {
  // const [screenshot, setScreenshot] = useState(null);
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
        .catch((err) => console.error("Error fetching system data:", err));
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
    const fetchCpuUsage = () => {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/cpu`)
        .then((response) => {
          setData((prevData) => ({
            ...prevData,
            cpuUsage: response.data.cpuUsage,
          }));
        })
        .catch((err) => console.error("Error fetching CPU usage:", err));
    };

    fetchCpuUsage(); 

    const interval = setInterval(fetchCpuUsage, 1000); 
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
        .catch((err) => console.error("Error fetching voltage:", err));
    };

    fetchVoltage();

    const interval = setInterval(fetchVoltage, 1000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/neofetch`)
      .then((response) => response.text())
      .then((data) => setNeofetchOutput(data))
      .catch((error) =>
        console.error("Error fetching neofetch output:", error)
      );
  }, []);

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 m-4 text-left flex">
      <div className="w-1/2 pr-4">
        <div className="flex">
          <div className="w-1/2 pl-4">
            <h1>Host IP Address: </h1>
            <h1>MAC Address: </h1>
            <h3>Uptime: </h3>
            <h3>CPU Usage:</h3>
            <h3>CPU Voltage: </h3>
            <h3>Disk Usage: </h3>
            <br />
          </div>
          <div className="w-1/2 pl-4 text-right">
            <a className="hostname" href={Hostname} target="_blank">
              {Hostname}
            </a>
            <h1> {data.macAddressa}</h1>
            <h3>{formatUptime(data.uptime)}</h3>
            <h3>{data.cpuUsage}%</h3>
            <h3>{data.voltage} V</h3>
            <h3>
              {data.usage} // {data.available} available
            </h3>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="pl-4 px-3">
            <div className="flex flex-row">
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded"
                onClick={() => (
                  window.open(`https://connect.raspberrypi.com/devices`),
                  "_blank"
                )}
              >
                <div className="flex items-center">
                  <img class="logosize" src={www} alt="www" />
                  <span>RPi Connect</span>
                </div>
              </button>

              <button
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 text-sm rounded mx-2"
                onClick={() => (
                  window.open(`${process.env.REACT_APP_LOCAL_IP}:80`), "_blank"
                )}
              >
                <div className="flex items-center">
                  <img class="logosize" src={pihole} alt="Pihole Logo" />
                  <span> Pi-Hole</span>
                </div>
              </button>

              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 text-sm rounded mx-2"
                onClick={() => (
                  window.open(`${process.env.REACT_APP_LOCAL_IP}:9000`),
                  "_blank"
                )}
              >
                <div className="flex items-center">
                  <img class="logosize" src={portainer} alt="Portainer Logo" />
                  <span> Portainer (Docker)</span>
                </div>
              </button>

              <button
                class="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-3 text-sm rounded mx-2"
                onClick={() => (
                  window.open(`${process.env.REACT_APP_LOCAL_IP}:32400`),
                  "_blank"
                )}
              >
                <div className="flex items-center">
                  <img class="logosize" src={plex} alt="Plex" />
                  <span> Plex</span>
                </div>
              </button>

              <button
                class="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-3 text-sm rounded mx-2"
                onClick={() => (
                  window.open(`${process.env.REACT_APP_LOCAL_IP}:3000`),
                  "_blank"
                )}
              >
                <div className="flex items-center">
                  <img class="logosize" src={grafana} alt="grafana" />
                  <span> Grafana</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 pl-4 text-right formatdiv">
        {/* <img className="resizeimage" src={screenshot} alt="System Snapshot" /> */}
        {/* <p> Snapshot of Image</p> */}
        <pre>{neofetchOutput}</pre>
      </div>
    </div>
  );
};

export default Main;
