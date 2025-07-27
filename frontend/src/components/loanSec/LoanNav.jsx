import { useState } from "react";

export default function LoanNav() {
  const [activeSection, setActiveSection] = useState("");

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    
    // Find the accordion section by type
    const accordionSections = document.querySelectorAll('[data-accordion-type]');
    let targetSection = null;
    
    accordionSections.forEach(section => {
      if (section.getAttribute('data-accordion-type') === sectionId) {
        targetSection = section;
      }
    });
    
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }
  };

  const navItems = [
    { id: "eligibility", label: "Eligibility", icon: "✅" },
    { id: "documents", label: "Documents Required", icon: "📋" },
    { id: "apply", label: "How to apply", icon: "🚀" },
    { id: "offer", label: "What's the offer?", icon: "💎" }
  ];

  return (
    <div className="flex justify-center mt-4 mb-4 px-4">
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-3xl p-3 shadow-2xl border border-blue-600/30 backdrop-blur-sm">
        <div className="flex flex-wrap justify-center gap-3 lg:gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={`relative group px-6 lg:px-8 py-4 lg:py-5 rounded-2xl font-semibold text-sm lg:text-base transition-all duration-300 whitespace-nowrap ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                  : "text-blue-100 hover:text-white hover:bg-blue-700/50"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </span>
              
              {/* Hover effect underline */}
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full transition-all duration-300 ${
                activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
              }`}></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
