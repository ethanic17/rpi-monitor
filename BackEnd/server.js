const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5000;

const os = require("os");
const si = require("systeminformation");
const fs = require("fs");

app.use(cors());

app.get("/neofetch", (req, res) => {
  exec("neofetch --stdout", (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error: ${error.message}`);
    }
    if (stderr) {
      return res.status(500).send(`Stderr: ${stderr}`);
    }
    res.send(stdout);
  });
});

app.get("/api/monitor", (req, res) => {
  exec("vcgencmd measure_clock arm", (err1, clockOutput) => {
    if (err1) {
      console.error(err1);
      res.status(500).send("error fetching cpu clock speed");
      return;
    }

    exec("vcgencmd measure_temp", (err2, tempOutput) => {
      if (err2) {
        console.error(err2);
        res.status(500).send("error fetching temperature");
        return;
      }

      exec("vcgencmd measure_clock core", (err3, gpuClockOutput) => {
        if (err3) {
          console.error(err3);
          res.status(500).send("error fetching GPU clock speed");
          return;
        }

          const clockSpeed = parseInt(clockOutput.split("=")[1]) / 1000000;
          const temperature = parseFloat(tempOutput.split("=")[1]);
          const gpuClock = parseInt(gpuClockOutput.split("=")[1]) / 1000000;

          res.json({ clockSpeed, temperature, gpuClock });
      });
    });
  });
});

app.get("/api/cpu", async (req, res) => {
  try {
    const load = await si.currentLoad();
    res.json({ cpuUsage: load.currentLoad.toFixed(2) });
  } catch (error) {
    console.error("error fetching CPU usage:", error);
    res.status(500).send("error fetching CPU usage");
  }
});

app.get("/api/memory", (req, res) => {
  const totalMemory = os.totalmem() / 1024 / 1024;
  const freeMemory = os.freemem() / 1024 / 1024;
  const usedMemory = totalMemory - freeMemory;

  res.json({
    totalMemory: totalMemory.toFixed(2),
    usedMemory: usedMemory.toFixed(2),
    freeMemory: freeMemory.toFixed(2),
  });
});

app.get("/api/system", (req, res) => {
  const uptime = os.uptime();
  const diskUsageC = "df -h / | tail -1 | awk '{print $3, $4, $5}'";
  const macAddressC = "cat /sys/class/net/eth0/address"; // eth0, wlan0

  exec(macAddressC, (err1, macAddress) => {
    if (err1) {
      console.error(err1);
      res.status(500).send("could not read MAC address");
      return;
    }

    exec(diskUsageC, (err2, diskUsage) => {
      if (err2) {
        console.error(err2);
        res.status(500).send("error fetching disk");
        return;
      }

      exec("vcgencmd measure_volts core", (err3, voltageOutput) => {
        if (err3) {
          console.error(err3);
          res.status(500).send("error fetching voltage");
          return;
        }

        const [used, available, usage] = diskUsage.trim().split(" ");
        const macAddressa = macAddress.trim();
        const voltage = parseFloat(voltageOutput.split("=")[1]);

        res.json({ macAddressa, uptime, used, available, usage, voltage });
      });
    });
  });
});

app.get("/api/network", async (req, res) => {
  try {
    const networkStats = await si.networkStats();
    const networkData = networkStats[0];

    const rxSpeed = (networkData.rx_sec / 1024 / 1024).toFixed(2);
    const txSpeed = (networkData.tx_sec / 1024 / 1024).toFixed(2);
    res.json({
      uploadSpeed: txSpeed,
      downloadSpeed: rxSpeed,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("error fetching network data:", error);
    res.status(500).send("error fetching network data");
  }
});

app.get("/api/cpu-history", async (req, res) => {
  try {
    const data = await MonitorData.find().sort({ timestamp: -1 }).limit(100);
    res.json(data.map(item => ({ timestamp: item.timestamp, cpuUsage: item.cpuUsage })));
  } catch (err) {
    res.status(500).send("error fetching CPU history");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/rpi-monitor", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const monitorSchema = new mongoose.Schema({
  clockSpeed: Number,
  temperature: Number,
  gpuClock: Number,
  cpuUsage: Number,
  timestamp: { type: Date, default: Date.now },
});

const MonitorData = mongoose.model("MonitorData", monitorSchema);

setInterval(() => {
  exec("vcgencmd measure_clock arm", (err1, clockOutput) => {
    if (err1) return;

    exec("vcgencmd measure_temp", (err2, tempOutput) => {
      if (err2) return;

      exec("vcgencmd measure_clock core", (err3, gpuClockOutput) => {
        if (err3) return;

        si.currentLoad().then(load => {
          const clockSpeed = parseInt(clockOutput.split("=")[1]) / 1000000;
          const temperature = parseFloat(tempOutput.split("=")[1]);
          const gpuClock = parseInt(gpuClockOutput.split("=")[1]) / 1000000;
          const cpuUsage = load.currentLoad.toFixed(2);

          const data = new MonitorData({
            clockSpeed,
            temperature,
            gpuClock,
            cpuUsage
          });
          data.save().catch((err) => console.error("error saving data:", err));
        });
      });
    });
  });
}, 1000);

//mongodb
app.get("/api/history", async (req, res) => {
  try {
    const data = await MonitorData.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (err) {
    res.status(500).send("error fetching history");
  }
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
