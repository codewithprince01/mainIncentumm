import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SignupVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.phoneNumber || ""; // Auto-fill phone number

  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [showOtpField, setShowOtpField] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const api_key = "0a27b9b3-b744-11ef-8b17-0200cd936042"; // Replace with your actual 2Factor API key

  const sendOtp = async () => {
    setErrorMessage("");

    if (!phoneNumber || phoneNumber.length !== 10 || !/^[0-9]{10}$/.test(phoneNumber)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    const url = `https://2factor.in/API/V1/${api_key}/SMS/${phoneNumber}/AUTOGEN?OTPDeliveryMode=SMS`;

    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.Status === "Success") {
        alert("OTP sent successfully via SMS!");
        setSessionId(data.Details);
        setShowOtpField(true);
      } else {
        setErrorMessage(`Failed to send OTP. Message: ${data.Details}`);
      }
    } catch (error) {
      console.error("Error while sending OTP:", error.message);
      setErrorMessage("Could not send OTP. Please try again later.");
    }
  };

  const verifyOtp = async () => {
    setErrorMessage("");

    if (!otp || otp.length !== 6 || !/^[0-9]{6}$/.test(otp)) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!sessionId) {
      setErrorMessage("Session ID is missing. Please request OTP again.");
      return;
    }

    const url = `https://2factor.in/API/V1/${api_key}/SMS/VERIFY/${sessionId}/${otp}`;

    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.Status === "Success") {
        alert("OTP verified successfully!");
        navigate("/homePage"); // Redirect to home page
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error while verifying OTP:", error.message);
      setErrorMessage("Could not verify OTP. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-image flex items-center justify-center p-6">
      <div className="w-full max-w-md p-6 bg-white bg-opacity-10 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg">
        <h2 className="text-gray-200 text-3xl font-bold mb-4">OTP Verification</h2>
        <p className="text-white text-lg mb-4">Phone Number: {phoneNumber}</p>

        {errorMessage && (
          <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        {!showOtpField && (
          <button
            onClick={sendOtp}
            className="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Get OTP
          </button>
        )}

        {showOtpField && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyOtp();
            }}
          >
            <div className="flex gap-2 justify-center mt-6">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-10 h-10 text-center text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const otpArray = otp.split("");
                    otpArray[index] = e.target.value;
                    setOtp(otpArray.join(""));
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-6 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Verify OTP
            </button>
          </form>
        )}

        {showOtpField && (
          <p className="text-center text-gray-400 text-lg mt-6">
            Didn't receive the OTP?{" "}
            <button
              type="button"
              className="text-blue-400 underline hover:text-blue-500"
              onClick={sendOtp}
            >
              Resend OTP
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
