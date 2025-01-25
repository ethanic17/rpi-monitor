import React from "react";
import { Line } from "react-chartjs-2";

import "../index.css";

const Card = ({ title, content, chartData }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-8 m-4 max-w-lg cardhover">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <p className="text-gray-700 mb-6">{content}</p>
      {chartData && (
        <div className="h-64">
          <Line data={chartData} />
        </div>
      )}
    </div>
  );
};

export default Card;
