import React, { useEffect, useState, useRef } from "react";

const Terms = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const refs = {
    termsOfService: useRef(null),
    acceptanceOfTerms: useRef(null),
    userResponsibilities: useRef(null),
    intellectualProperty: useRef(null),
    limitationsOfLiability: useRef(null),
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
          <div className="relative" id="termsOfService" ref={refs.termsOfService}>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Terms of Service</h1>
            {/* Animated Underline */}
            <span
              className={`absolute left-1/2 transform -translate-x-1/2 bottom-[-2px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                visibleSections.termsOfService ? "w-full" : "w-0"
              }`}
            ></span>
          </div>
          <p className="text-lg md:text-2xl mt-2 text-gray-300 max-w-4xl">
            Welcome to <span className="text-blue-400 font-semibold">INCENTUM</span>, where financial innovation meets
            customer-centric excellence. Please read these Terms of Service carefully before using our website.
          </p>
        </section>

        {/* Terms of Service Content */}
        <div className="bg-white/5 backdrop-blur-sm border-y border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Acceptance of Terms Section */}
          <div className="relative" id="acceptanceOfTerms" ref={refs.acceptanceOfTerms}>
            <div className="inline-block relative">
              <h2 className="text-blue-400 text-4xl font-bold">Acceptance of Terms</h2>
              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                  visibleSections.acceptanceOfTerms ? "w-full" : "w-0"
                }`}
              ></span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree to
              these terms, please do not use our website.
            </p>
          </div>

          {/* User Responsibilities Section */}
          <div className="relative" id="userResponsibilities" ref={refs.userResponsibilities}>
            <div className="inline-block relative">
              <h2 className="text-blue-400 text-4xl font-bold">User Responsibilities</h2>
              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                  visibleSections.userResponsibilities ? "w-full" : "w-0"
                }`}
              ></span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              You are responsible for maintaining the confidentiality of your account and password and for restricting
              access to your account. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </div>

          {/* Intellectual Property Section */}
          <div className="relative" id="intellectualProperty" ref={refs.intellectualProperty}>
            <div className="inline-block relative">
              <h2 className="text-blue-400 text-4xl font-bold">Intellectual Property</h2>
              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                  visibleSections.intellectualProperty ? "w-full" : "w-0"
                }`}
              ></span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              All content on this website, including text, graphics, logos, and images, is the property of{" "}
              <span className="text-blue-400 font-semibold">INCENTUM</span> and is protected by intellectual property
              laws. You may not use, reproduce, or distribute any content without our prior written permission.
            </p>
          </div>

          {/* Limitations of Liability Section */}
          <div className="relative" id="limitationsOfLiability" ref={refs.limitationsOfLiability}>
            <div className="inline-block relative">
              <h2 className="text-blue-400 text-4xl font-bold">Limitations of Liability</h2>
              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                  visibleSections.limitationsOfLiability ? "w-full" : "w-0"
                }`}
              ></span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              <span className="text-blue-400 font-semibold">INCENTUM</span> shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including without limitation, loss of profits,
              data, use, goodwill, or other intangible losses, resulting from your use of or inability to use the
              website.
            </p>
          </div>

          {/* Changes to This Agreement Section */}
          <div className="relative" id="changes" ref={refs.changes}>
            <div className="inline-block relative">
              <h2 className="text-blue-400 text-4xl font-bold">Changes to This Agreement</h2>
              {/* Animated Underline */}
              <span
                className={`absolute left-0 bottom-[-6px] h-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-in-out ${
                  visibleSections.changes ? "w-full" : "w-0"
                }`}
              ></span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mt-4">
              We reserve the right to update or modify these Terms of Service at any time without prior notice. Your
              continued use of the website after any changes constitutes your acceptance of the revised Terms of Service.
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
              If you have any questions about these Terms of Service, please contact us at{" "}
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

export default Terms;