import React, { useState, useEffect, useRef } from "react";
import {
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
  FaTelegramPlane,
  FaCommentDots,
} from "react-icons/fa";

export default function AllInOneChat() {
  const [isOpen, setIsOpen] = useState(false);
  const chatWidgetRef = useRef(null); // Create a ref

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatWidgetRef.current &&
      !chatWidgetRef.current.contains(event.target)
      ) {
        // Click is outside the widget
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Add the event listener only when the widget is open
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Remove the listener when the widget is closed
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up the listener when the component unmounts or isOpen changes
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 left-5 z-50"> {/* Added z-50 for higher z-index */}
      {/* Chat Widget Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white rounded-full flex items-center px-5 py-3 shadow-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
        >
          <FaCommentDots className="text-xl mr-2 animate-bounce" />
          <span>Talk to us</span>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse ml-2"></div>
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div
          className="relative w-80 bg-white rounded-xl shadow-lg border border-gray-300 animate-slide-in"
          style={{ animationDuration: "0.5s" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="flex items-center">
              <img
                src="/customercareimg.webp"
                alt="Customer Care"
                className="w-10 h-10"
              />
              <div className="ml-3">
                <h3 className="font-bold text-gray-800">Customer care</h3>
                <p className="text-green-500 text-sm">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800 transition-transform duration-300 transform hover:rotate-90"
            >
              &#10005;
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4">
            <div className="flex items-start mb-3">
              <img
                src="/customercareimg.webp"
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="bg-gray-100 rounded-lg p-3 animate-fade-in">
                <p className="text-gray-800">Hi there 👋</p>
                <p className="text-gray-800">How can I help you?</p>
              </div>
            </div>
          </div>

          {/* Chat Actions */}
          <div className="flex justify-around p-4 border-t border-gray-300">
            {/* WhatsApp */}
            <a
              href="https://wa.me/918767836233"
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow hover:bg-green-600 transition-all duration-300 transform hover:scale-110"
            >
              <FaWhatsapp className="text-white text-xl" />
            </a>
            {/* Email */}
            <a
              href="mailto:services@incentum.loans"
              className="w-16 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow hover:bg-blue-600 transition-all duration-300 transform hover:scale-110"
            >
              <FaEnvelope className="text-white text-xl" />
            </a>
            {/* Phone */}
            <a
              href="tel:+918767836233"
              className="w-16 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow hover:bg-green-700 transition-all duration-300 transform hover:scale-110"
            >
              <FaPhoneAlt className="text-white text-xl" />
            </a>
            {/* Telegram */}
            {/* <a
              href="https://t.me/8767836233"
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-12 bg-blue-400 rounded-xl flex items-center justify-center shadow hover:bg-blue-500 transition-all duration-300 transform hover:scale-110"
            >
              <FaTelegramPlane className="text-white text-xl" />
            </a> */}
          </div>
        </div>
      )}
    </div>
  );
}