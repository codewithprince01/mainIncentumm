import React from "react";

const StatsCards = () => {
  return (
    <div className="flex flex-wrap gap-4 p-5 bg-green-50">
      {/* Card 1 - Clients */}
      <div className="flex items-center justify-between w-64 bg-white rounded-lg shadow-lg p-4">
        <div>
          <p className="text-gray-500 text-sm">Enrolled</p>
          <p className="text-blue-600 font-semibold text-lg mt-1">Clients</p>
        </div>
        <div className="relative">
          <svg className="w-16 h-16 text-blue-400" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="opacity-25"
            ></circle>
            <circle
              cx="18"
              cy="18"
              r="16"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="100"
              strokeDashoffset="70"
              strokeLinecap="round"
            ></circle>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-bold text-blue-600">
            19
          </span>
        </div>
      </div>

      {/* Card 2 - In Progress */}
      <div className="flex items-center justify-between w-64 bg-white rounded-lg shadow-lg p-4">
        <div>
          <p className="text-gray-500 text-sm">Application</p>
          <p className="text-yellow-600 font-semibold text-lg mt-1">
            In Progress
          </p>
        </div>
        <div className="relative">
          <svg className="w-16 h-16 text-yellow-400" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="opacity-25"
            ></circle>
            <circle
              cx="18"
              cy="18"
              r="16"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="100"
              strokeDashoffset="60"
              strokeLinecap="round"
            ></circle>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-bold text-yellow-600">
            22
          </span>
        </div>
      </div>

      {/* Card 3 - Total Loan Revenue */}
      <div className="flex items-center justify-between w-64 bg-white rounded-lg shadow-lg p-4">
        <div>
          <p className="text-gray-500 text-sm">Amount</p>
          <p className="text-green-600 font-semibold text-lg mt-1">
            Total loan Revenue
          </p>
        </div>
        <div className="relative">
          <svg className="w-16 h-16 text-green-400" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="opacity-25"
            ></circle>
            <circle
              cx="18"
              cy="18"
              r="16"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="100"
              strokeDashoffset="100"
              strokeLinecap="round"
            ></circle>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-bold text-green-600">
            0
          </span>
        </div>
      </div>

      {/* Card 4 - Application Pending */}
      <div className="flex items-center justify-between w-64 bg-white rounded-lg shadow-lg p-4">
        <div>
          <p className="text-gray-500 text-sm">Application</p>
          <p className="text-red-600 font-semibold text-lg mt-1">
             Pending
          </p>
        </div>
        <div className="relative">
          <svg className="w-16 h-16 text-red-400" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="opacity-25"
            ></circle>
            <circle
              cx="18"
              cy="18"
              r="16"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray="100"
              strokeDashoffset="90"
              strokeLinecap="round"
            ></circle>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-bold text-red-600">
            0
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
