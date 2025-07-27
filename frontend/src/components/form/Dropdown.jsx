import React from "react";

export default function Dropdown({
  options = [],
  placeholder = "Select an option",
  onSelect,
  isOpen,
  setOpenDropdown,
  id,
  value,
}) {
  const handleOptionClick = (option) => {
    onSelect(option); // Notify parent of the selected option
    setOpenDropdown(null); // Close dropdown after selection
  };

  const toggleDropdown = (e) => {
    e.preventDefault(); // Prevent default form submission
    setOpenDropdown(isOpen ? null : id); // Toggle dropdown open/close
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <button
        className={`w-full border border-[#16195E] bg-[#010449] text-black text-[16px] py-[11px] mb-4 pl-6 rounded-xl shadow-md font-medium text-start focus:outline-none hover:border-[#5793A4] hover:bg-[#1a1c5d] transition-all duration-300 ${
          value ? "text-white" : "text-gray-400"
        }`}
        onClick={toggleDropdown}
      >
        {value || placeholder}
        <span
          className={`float-right text-gray-400 mr-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full bg-[#010449] border border-[#16195E] rounded-lg shadow-lg overflow-hidden transition-transform duration-300 z-10">
          <ul className="divide-y divide-[#1a1c5d]">
            {options.length > 0 ? (
              options.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="py-3 px-6 text-white cursor-pointer hover:bg-[#5793A4] hover:text-[#010449] transition-all duration-200"
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="py-3 px-6 text-gray-500">No options available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}


