import React from "react";

export default function Input({ placeholder, name, value, onChange, error }) {
  return (
    <div>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border  bg-[#010449] text-white text-[16px] py-[12px] pl-6 rounded-xl mb-4 placeholder-white placeholder-opacity-60 shadow-md font-medium focus:outline-none  focus:ring-2  transition-all duration-300 ${
          error ? "border-red-500 focus:ring-red-500" : "border-[#1a1c5d] hover:border-[#5793A4] focus:ring-[#48A6A7]"
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}