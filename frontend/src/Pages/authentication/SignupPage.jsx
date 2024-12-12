import React, { useState } from "react";
import "../../index.css";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const scriptURL = "https://script.google.com/macros/s/AKfycbzHp76v83ebTY-dn4HJSj6QCCkoZWo2pHqjY-_tWcyPnGP8g_-1R_EjG4nFpchPAO8xLA/exec";

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Phone No.", phoneNumber);
    formData.append("Email", email);
    formData.append("Pincode", pincode);

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("Thank you! Your form has been submitted.");
        setName("");
        setPhoneNumber("");
        setEmail("");
        setPincode("");
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error!", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-image grid grid-cols-1 xl:grid-cols-2">
      {/* Left Section */}
      <div className="flex flex-col w-full p-6 xl:p-12">
        <div className="flex flex-col justify-center h-2/3 mx-auto">
          <h2 className="text-white text-3xl md:text-4xl xl:text-5xl font-bold leading-tight">
            Welcome <span className="text-blue-300">To The</span>{" "}
            <span className="text-blue-400">Realm Of</span> Modern{" "}
            <span className="text-blue-400">Banking!</span>
          </h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white">1Million+</h2>
              <p className="text-white text-lg">Registered Businesses</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">$1Billion+</h2>
              <p className="text-white text-lg">Monthly Payments Value</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">1Million+</h2>
              <p className="text-white text-lg">Daily Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center p-6 bg-opacity-80">
        <div className="w-full max-w-md p-6 bg-white bg-opacity-10 backdrop-blur-md border border-gray-700 rounded-lg shadow-lg">
          <h2 className="text-gray-200 text-3xl font-bold mb-4">Signup</h2>
          <p className="text-gray-400 text-lg mb-4">
            Just a few details to get you started!
          </p>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 text-lg mb-4 border border-gray-300 rounded-lg bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 text-lg mb-4 border border-gray-300 rounded-lg bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email ID"
              className="w-full p-3 text-lg mb-4 border border-gray-300 rounded-lg bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Pincode"
              className="w-full p-3 text-lg mb-4 border border-gray-300 rounded-lg bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Signup
            </button>
            <div className="flex items-center justify-center my-7">
              <div className="w-1/3 border-t border-gray-500"></div>
              <span className="mx-4 text-gray-500 text-lg sm:text-xl font-bold">
                Or
              </span>
              <div className="w-1/3 border-t border-gray-500"></div>
            </div>
            <p className="text-center text-gray-400 text-lg mt-6">
              Already registered?{" "}
              <Link
                to="/login-page"
                className="text-blue-400 underline hover:text-blue-500"
              >
                Login
              </Link>
            </p>
             {/* Footer Links */}
             <div className="flex justify-center gap-4 text-gray-500 text-sm sm:text-base mt-7">
              <Link to="#">Terms & Conditions</Link>
              <Link to="#">Support</Link>
              <Link to="#">Customer Care</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
