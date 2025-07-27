import { Link } from "react-router-dom";
import bankingSection from "../../../assets/bankingsection.webp";

const BankingSection = () => {
  return (
    <div className="relative bg-features-gradient py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-banking-accent/8 rounded-full animate-float blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-28 h-28 bg-banking-lightBlue/6 rounded-full animate-bounce-slow blur-lg"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-banking-skyBlue/7 rounded-full animate-spin-slow blur-md"></div>

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Enhanced Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="bg-banking-accent/10 backdrop-blur-sm border border-banking-accent/30 rounded-full px-8 py-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-banking-accent rounded-full animate-pulse"></div>
                  <span className="text-banking-accent font-semibold text-sm tracking-wider">
                    NEXT-GENERATION BANKING
                  </span>
                  <div className="w-3 h-3 bg-banking-lightBlue rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Experience Banking That&apos;s
              <br />
              <span className="bg-gradient-to-r from-banking-accent via-banking-lightBlue to-banking-skyBlue bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
                Swift, Smart & Seamless
              </span>
            </h2>
            
            <p className="font-banking text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-12">
              Join the revolution with <span className="text-banking-accent font-bold">INCENTUM</span> and unlock 
              cutting-edge financial solutions designed for the modern world. 
              <span className="text-banking-lightBlue font-semibold"> Your financial future starts here.</span>
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-banking-accent/30 hover:border-banking-accent/50 transition-all duration-300 group hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 bg-banking-accent/20 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-banking-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-300 text-sm">Instant approvals with AI-powered processing</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-banking-lightBlue/30 hover:border-banking-lightBlue/50 transition-all duration-300 group hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 bg-banking-lightBlue/20 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-banking-lightBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">100% Secure</h3>
                <p className="text-gray-300 text-sm">Bank-grade security with end-to-end encryption</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-banking-skyBlue/30 hover:border-banking-skyBlue/50 transition-all duration-300 group hover:scale-105">
                <div className="flex items-center justify-center w-12 h-12 bg-banking-skyBlue/20 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-banking-skyBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Customer First</h3>
                <p className="text-gray-300 text-sm">24/7 support with personalized solutions</p>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/home-loan-application"
                className="group relative bg-gradient-to-r from-banking-accent to-banking-lightBlue text-white font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl hover:shadow-banking-accent/40 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-banking-lightBlue to-banking-skyBlue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>Start Your Journey</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <Link
                to="/contact-us"
                className="group bg-white/10 backdrop-blur-md border-2 border-banking-accent/60 text-white font-bold text-lg px-10 py-5 rounded-2xl hover:bg-banking-accent/10 hover:border-banking-accent transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center space-x-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Talk to Expert</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Enhanced Image Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-banking-accent/20 to-banking-lightBlue/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-banking-accent/30 shadow-2xl">
              <img
                src={bankingSection}
                alt="Next-Generation Banking Experience"
                className="w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              
              {/* Image Overlay */}
              <div className="absolute inset-6 bg-gradient-to-t from-banking-dark/80 via-transparent to-transparent rounded-2xl flex items-end p-8 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="text-white">
                  <h4 className="text-xl font-bold mb-2">The Future of Banking</h4>
                  <p className="text-sm text-gray-200">Experience seamless digital banking with INCENTUM&apos;s innovative platform</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-16">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-gray-300">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-banking-emerald" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">RBI Registered & Compliant</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-banking-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">ISO 27001 Certified</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-banking-lightBlue" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">24/7 Premium Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingSection;
