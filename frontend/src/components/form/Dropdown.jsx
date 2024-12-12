import React, { useState } from "react";

export default function Dropdown({
  options = [],
  placeholder = "Select an option",
  onSelect,
  isOpen,
  setOpenDropdown,
  id,
}) {
 
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };    

  return (
    <div className="relative w-full">
      <button
 className={`w-full border border-blue-400 bg-[#D3EEFF] text-[16px] py-[11px] pl-6 rounded-xl shadow-md font-medium text-start focus:outline-none hover:bg-blue-200 transition-all duration-300 ${
          selectedOption ? "text-black" : "text-gray-400"}`}   onClick={() => setOpenDropdown(isOpen?null:id)}
      >
        {selectedOption || placeholder}
        <span className={`float-right text-gray-400 mr-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>
      <div
        className={`relative bg-[#D3EEFF] rounded-lg shadow-lg overflow-hidden transition-max-height duration-500 ease-in-out mb-4 ${
          isOpen ? "max-h-64" : "max-h-0"
        }`}
        style={{ transitionProperty: "max-height" }}
      >
        <ul className="divide-y divide-blue-300 ">
          {options.length > 0 ? (
            options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                className="py-3 px-6 text-gray-700 cursor-pointer  hover:bg-blue-300 hover:text-blue-900 transition-all duration-200 "
              >
                {option}
              </li>
            ))
          ) : (
            <li className="py-3 px-6 text-gray-500">No options available</li>
          )}
        </ul>
      </div>
    </div>
  );
}
