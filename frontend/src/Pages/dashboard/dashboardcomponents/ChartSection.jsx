import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ChartSection = () => {
  // Chart Data
  const data = {
    labels: ["", "", "", "", "", "", "", ""],
    datasets: [
      {
        label: "Closed",
        data: [9, 12, 16, 19, 22, 24, 25, 26],
        borderColor: "#3B82F6", 
        backgroundColor: "#3B82F6",
        borderWidth: 3,
        pointBackgroundColor: "#3B82F6",
        tension: 0.4,
      },
      {
        label: "In Progress",
        data: [10, 12, 13, 15, 20, 22, 25, 26],
        borderColor: "#EAB308", 
        backgroundColor: "#EAB308",
        borderWidth: 3,
        pointBackgroundColor: "#EAB308",
        tension: 0.4,
      },
      {
        label: "Pending",
        data: [25, 23, 21, 19, 14, 11, 9, 8],
        borderColor: "#EF4444", 
        backgroundColor: "#EF4444",
        borderWidth: 3,
        pointBackgroundColor: "#EF4444",
        tension: 0.4,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    elements: {
      point: {
        radius: 5,
      },
    },
  };

  return (
    <div className="p-4 bg-gray-100">
      {/* Header */}
      <div className="flex items-center mb-2 gap-2">
        <img
          src="https://via.placeholder.com/30"
          alt="Chart Icon"
          className="w-6 h-6"
        />
        <h2 className="text-lg font-semibold">Application Status</h2>
      </div>

      {/* Chart */}
      
      <div className="bg-white rounded-md shadow-md p-4">
        <h3 className="text-sm font-medium mb-2">Chart</h3>
        <div className=" h-80 w-screen">
        <Line data={data} options={options} />
        </div>
      </div>


      {/* Footer */}
      <div className="flex justify-between items-center mt-4 px-2">
        <div className="text-center">
          <p className="text-2xl font-semibold">50</p>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-16 h-1 bg-blue-500 inline-block"></span> Closed
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold">12</p>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-16 h-1 bg-yellow-500 inline-block"></span> In Progress
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold">40</p>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-16 h-1 bg-red-500 inline-block"></span> Pending
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
