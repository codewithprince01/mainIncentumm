import React, { useEffect, useState, useRef } from "react";

const Disclaimer = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const refs = {
    disclaimer: useRef(null),
    noAdvice: useRef(null),
    thirdPartyLinks: useRef(null),
    liability: useRef(null),
    changes: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.8 }
    );

    Object.values(refs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      Object.values(refs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-52 h-52 bg-blue-500/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-32 h-32 bg-blue-500/12 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute top-10 right-1/3 w-24 h-24 bg-blue-500/15 rounded-full blur-xl animate-pulse delay-700"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center py-8 px-6">
          <div className="relative" id="disclaimer" ref={refs.disclaimer}>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Disclaimer</h1>
            {/* Animated Underline */}
            <span
              className={`absolute left-1/2 transform -translate-x-1/2 bottom-[-2px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                visibleSections.disclaimer ? "w-full" : "w-0"
              }`}
            ></span>
          </div>
          <p className="text-lg md:text-2xl mt-2 text-gray-300 max-w-4xl">
            Welcome to <span className="text-blue-400 font-semibold">incentum.loans</span>, your trusted partner in
            financial solutions. Please read this disclaimer carefully before using our website.
          </p>
        </section>

        {/* Disclaimer Content */}
        <div className="bg-white/5 backdrop-blur-sm border-y border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Limitation of Liability Section */}
          <div className="relative" id="liability" ref={refs.liability}>
            <div className="inline-block relative">
              <h2 className="text-blue-400 text-4xl font-bold">
                Limitation of Liability
              </h2>
              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                  visibleSections.liability ? "w-full" : "w-0"
                }`}
              ></span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              In no event shall <span className="text-blue-400 font-semibold">incentum.loans</span>, its directors,
              employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special,
              consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill,
              or other intangible losses, resulting from (i) your access to or use of or inability to access or use the
              website; (ii) any conduct or content of any third party on the website; (iii) any content obtained from
              the website; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether
              based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we
              have been informed of the possibility of such damage.
            </p>
          </div>

          {/* Changes to This Disclaimer Section */}
          <div className="relative" id="changes" ref={refs.changes}>
            <div className="inline-block relative">
              <h2 className="text-blue-400 text-4xl font-bold">
                Changes to This Disclaimer
              </h2>
              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                  visibleSections.changes ? "w-full" : "w-0"
                }`}
              ></span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              We reserve the right to update or modify this Disclaimer at any time without prior notice. Your continued
              use of the website after any changes constitutes your acceptance of the revised Disclaimer.
            </p>
          </div>

          {/* No Professional Advice Section */}
          <div className="relative" id="noAdvice" ref={refs.noAdvice}>
            <div className="inline-block relative">
              <h2 className="text-blue-400 text-4xl font-bold">
                No Professional Advice
              </h2>
              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                  visibleSections.noAdvice ? "w-full" : "w-0"
                }`}
              ></span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              The content on this website does not constitute professional financial, legal, or tax advice. You should
              consult a qualified professional before making any financial decisions.{" "}
              <span className="text-blue-400 font-semibold">incentum.loans</span> is not responsible for any actions
              taken based on the information provided on this website.
            </p>
          </div>

          {/* Third-Party Links Section */}
          <div className="relative" id="thirdPartyLinks" ref={refs.thirdPartyLinks}>
            <div className="inline-block relative">
              <h2 className="text-blue-400 text-4xl font-bold">
                Third-Party Links
              </h2>
              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                  visibleSections.thirdPartyLinks ? "w-full" : "w-0"
                }`}
              ></span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              Our website may contain links to third-party websites or services that are not owned or controlled by{" "}
              <span className="text-blue-400 font-semibold">incentum.loans</span>. We have no control over, and assume
              no responsibility for, the content, privacy policies, or practices of any third-party websites or
              services. You acknowledge and agree that{" "}
              <span className="text-blue-400 font-semibold">incentum.loans</span> shall not be responsible or liable,
              directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with
              the use of or reliance on any such content, goods, or services available on or through any such websites
              or services.
            </p>
          </div>

          {/* Contact Us Section */}
          <div className="relative" id="contact" ref={refs.contact}>
            <div className="inline-block relative">
              <h2 className="text-blue-400 text-4xl font-bold">Contact Us</h2>
              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                  visibleSections.contact ? "w-full" : "w-0"
                }`}
              ></span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
            If you have any questions about this Disclaimer, please contact us at{" "}
              <a
                href="mailto:support@incentum.loans"
                className="text-blue-400 hover:underline"
              >
                support@incentum.loans
              </a>
              .
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;