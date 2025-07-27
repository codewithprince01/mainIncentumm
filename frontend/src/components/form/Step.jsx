import React, { useState } from "react";

const StepNavigation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["1", "2", "3", "4"];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      alert("Completed!");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      alert("Already on first step");
    }
  };


  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-purple-100 via-blue-100 to-blue-200 min-h-screen">
      <div className="relative flex items-center justify-center w-full max-w-4xl">
       
        <svg
          className="absolute top-1/2 left-0 right-0 w-full h-6 -translate-y-1/2 z-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
        >
          <path
            d="M0 5 C 20 0, 40 10, 60 5 C 80 0, 100 10, 120 5"
            stroke="#4aa8ff"
            fill="transparent"
            strokeWidth="1"
          />
        </svg>
        <ul className="relative z-10 flex w-full justify-between">
          {steps.map((step, index) => (
            <li key={index} className="relative flex flex-col items-center">
             
              <div
                className={`flex items-center justify-center w-12 h-12 transform rotate-45 transition-all duration-500 ${
                  index < currentStep
                    ? "bg-green-500 text-white shadow-lg scale-110"
                    : index === currentStep
                    ? "bg-blue-500 text-white shadow-2xl scale-125"
                    : "bg-white text-blue-500 border-2 border-blue-300 scale-100"
                }`}
              >
                <span className="-rotate-45 font-bold text-lg">
                  {index < currentStep ? "✓" : step}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-12 flex space-x-4">
        <button
          onClick={handlePrevious}
          className="px-6 py-2 font-medium text-white bg-gray-500 rounded-full hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
          disabled={currentStep === 0}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-all duration-300 disabled:opacity-50"
          disabled={currentStep === steps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepNavigation;

