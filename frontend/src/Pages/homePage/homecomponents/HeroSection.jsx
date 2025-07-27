import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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

      {/* Floating Elements - Mobile Responsive */}
      <div className="absolute top-20 left-4 md:left-20 w-20 md:w-40 h-20 md:h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-4 md:right-20 w-32 md:w-52 h-32 md:h-52 bg-blue-500/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-2 md:left-10 w-16 md:w-32 h-16 md:h-32 bg-blue-500/12 rounded-full blur-xl animate-pulse delay-500"></div>
      <div className="absolute top-10 right-1/4 md:right-1/3 w-12 md:w-24 h-12 md:h-24 bg-blue-500/15 rounded-full blur-xl animate-pulse delay-700"></div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <section className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto text-center w-full">
          
          {/* Enhanced Badge */}
          <div className={`inline-flex items-center justify-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/50 rounded-full px-8 py-4 shadow-2xl shadow-blue-500/20">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold text-sm tracking-wider">
                  TRUSTED FINANCIAL PARTNER
                </span>
                <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Heading */}
          <div className={`mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-relaxed mb-4 px-2">
              <span className="text-white">Empowering Your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Financial Dreams
              </span>
              <br />
              <span className="text-white">With </span>
              <span className="text-blue-400">AI-Driven</span>
              <span className="text-white"> Solutions</span>
            </h1>
          </div>

          {/* Enhanced Subtitle */}
          <div className={`mb-8 md:mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-banking text-base sm:text-lg md:text-xl lg:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
              Your trusted broker connecting you with the best banking partners. 
              From application to disbursement, we handle every step of your loan journey 
              with <span className="text-blue-400 font-semibold">precision</span> and <span className="text-blue-300 font-semibold">care</span>.
            </p>
          </div>

          {/* Enhanced Stats Section */}
          <div className={`mb-8 md:mb-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto px-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-blue-500/40 hover:border-blue-500/60 transition-all duration-300 hover:scale-105">
                <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">₹50Cr+</div>
                <div className="text-gray-300 text-xs md:text-sm">Loans Disbursed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-blue-400/40 hover:border-blue-400/60 transition-all duration-300 hover:scale-105">
                <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">1,000+</div>
                <div className="text-gray-300 text-xs md:text-sm">Happy Customers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-blue-300/40 hover:border-blue-300/60 transition-all duration-300 hover:scale-105">
                <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">50+</div>
                <div className="text-gray-300 text-xs md:text-sm">Banking Partners</div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center transition-all duration-1000 delay-900 px-4 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link
                              to="/home-loan-application"
              className="group relative bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-600/40 transform hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <span className="text-sm md:text-base">Start Your Application</span>
                <svg className="w-4 md:w-5 h-4 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              to="/contact-us"
              className="group bg-transparent border-2 border-gray-300/60 text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-gray-300/10 hover:border-blue-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm w-full sm:w-auto text-center"
            >
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm md:text-base">Talk to Expert</span>
              </span>
            </Link>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className={`mt-8 md:mt-16 transition-all duration-1000 delay-1100 px-4 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 md:space-x-8 text-gray-300 text-xs md:text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 md:w-5 h-4 md:h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>RBI Registered</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 md:w-5 h-4 md:h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 md:w-5 h-4 md:h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default HeroSection;
