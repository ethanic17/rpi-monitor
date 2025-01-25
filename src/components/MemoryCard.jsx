import React from "react";
import { Bar } from "react-chartjs-2";

const MemoryUsage = ({ totalMemory, usedMemory, freeMemory, barData, barOptions }) => {
  return (
    <div>
      <p>Used Memory: {usedMemory}MB / {totalMemory} MB</p>
      <p>Free Memory: {freeMemory} MB</p>
       <br />
      <Bar data={barData} options={barOptions} />
    </div>
  );
};

export default MemoryUsage;
