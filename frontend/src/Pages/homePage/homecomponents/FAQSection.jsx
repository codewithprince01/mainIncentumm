import { useState } from "react";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What are the eligibility criteria for a loan?",
      answer: "To be eligible for a loan, you need a credit score of 700 or higher, stable income for at least 2 years (salaried) or 3 years (self-employed), age between 21 and 60 (65 for self-employed) at loan maturity, and a good repayment capacity.",
    },
    {
      id: 2,
      question: "What documents are required to apply for a loan?",
      answer: "You need KYC documents (PAN, Aadhaar, Voter ID, Passport, proof of address), income proof, and other supporting documents.",
    },
    {
      id: 3,
      question: "How does the loan application process work?",
      answer: "The process involves consultation, offer shortlisting, document submission, approval, loan sanction, and disbursement, all streamlined for quick and hassle-free processing.",
    },
    {
      id: 4,
      question: "What are the key features and benefits of your loan solutions?",
      answer: "Our loan solutions offer customized incentives, high loan-to-value, flexible tenures, competitive interest rates, tax benefits, quick approvals.",
    },
    {
      id: 5,
      question: "What is the maximum loan amount I can get?",
      answer: "The maximum loan amount depends on your income, repayment capacity, and CIBIL Score.",
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-900 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl">
        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16">
          Frequently Asked <span className="text-blue-400">Questions</span>
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`border rounded-2xl transition-all duration-300 ${
                activeIndex === index
                  ? "bg-slate-700/90 border-blue-400/50 shadow-lg"
                  : "bg-slate-700/60 border-blue-400/30 hover:border-blue-400/40"
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-6 text-left text-white font-semibold focus:outline-none hover:bg-slate-600/30 rounded-2xl transition-all duration-300"
              >
                <span className="text-lg">{faq.question}</span>
                <span
                  className={`text-2xl font-bold text-blue-400 transition-transform duration-300 ${
                    activeIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                >
                  +
                </span>
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-6 text-gray-200 leading-relaxed border-t border-blue-400/20 pt-4">
                  {faq.answer || "Answer content goes here."}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
