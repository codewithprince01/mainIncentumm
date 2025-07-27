import React from "react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#010080] to-[#0A1536] text-white">
      <div className="max-w-4xl mx-auto text-center px-6">
        {/* Checkmark Icon */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
          Thank You!
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl mb-8">
          Your application has been successfully submitted. Our team will review
          your details and get back to you shortly.
        </p>

        {/* Additional Information */}
        <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-8">
          <p className="text-sm sm:text-base">
            For any queries, feel free to contact us at{" "}
            <a
              href="mailto:services@incentum.loans"
              className="text-blue-400 hover:underline"
            >
              services@incentum.loans
            </a>
            .
          </p>
        </div>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
