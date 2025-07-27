import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import homeloan from '../../../assets/homeloan.webp';
import vehicleloan from '../../../assets/vehicleloan.webp';
import personalloan from '../../../assets/personalloan.webp';
import businessloan from '../../../assets/businessloan.webp';

const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("home-loan");
  const [activeIndex, setActiveIndex] = useState(1);

  // Map loan titles to application routes
  const getApplicationRoute = (loanTitle) => {
    const routeMap = {
      'Find Your Dream Home': '/home-loan-application',
      'Drive Your Dream Car': '/vehicle-loan-application',
      'Fuel Your Personal Goals': '/personal-loan-application',
      'Grow Your Business': '/business-loan-application',
      'Leverage Your Property': '/mortgage-loan-application'
    };
    return routeMap[loanTitle] || '/home-loan-application';
  };

  // Ensure scroll behavior is restored
  useEffect(() => {
    // Reset any scroll restrictions
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Ensure smooth scrolling is enabled
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      // Cleanup
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const carouselImages = ["/slimage1.jpg", "/slimage2.jpg", "/slimage3.jpg", "/slimage2.jpg"];

  const loanTypes = [
    {
      id: "home-loan",
      label: "Home Loan",
      title: "Find Your Dream Home",
      subtitle: "With Our Home Loan Solution",
      description: "Owning a home should be a joyous experience, not a source of stress. We understand that purchasing a home is one of the most significant financial decisions you&apos;ll ever make. That&apos;s why we&apos;ve developed advanced home loan solutions that give you access to competitive interest rates and flexible terms.",
      image: homeloan,
      route: "/home-loan",
      icon: "🏠",
      color: "emerald",
      features: ["Up to 90% Financing", "Flexible Tenure", "Quick Approval"]
    },
    {
      id: "car-loan",
      label: "Vehicle Loan",
      title: "Drive Your Dream Car",
      subtitle: "With Our Tailored Vehicle Loan Solution",
      description: "The journey toward owning your dream car should be filled with excitement, not roadblocks. Our advanced vehicle loan options are designed to take you from application to approval quickly and effortlessly. Whether you&apos;re looking for a sleek sports car or a family-friendly SUV.",
      image: vehicleloan,
      route: "/vehicle-loan",
      icon: "🚗",
      color: "blue",
      features: ["New & Used Cars", "Competitive Rates", "Fast Processing"]
    },
    {
      id: "personal-loan",
      label: "Personal Loan",
      title: "Fuel Your Personal Goals",
      subtitle: "With Our Flexible Personal Loan Solution",
      description: "Life is full of unexpected moments, and having access to quick, hassle-free funding can make all the difference. Whether you&apos;re renovating your home, covering medical expenses, or financing a personal project, our personal loan solutions are tailored to meet your individual needs.",
      image: personalloan,
      route: "/personal-loan",
      icon: "💰",
      color: "purple",
      features: ["No Collateral", "Quick Disbursal", "Minimal Documentation"]
    },
    {
      id: "business-loan",
      label: "Business Loan",
      title: "Grow Your Business",
      subtitle: "With Our Custom Business Loan Options",
      description: "Running a successful business requires careful planning and timely investments. Whether you&apos;re expanding your current operations or starting a brand-new venture, having access to reliable funding is essential. Our business loan options provide the financial support you need to grow sustainably.",
      image: businessloan,
      route: "/business-loan",
      icon: "🏢",
      color: "orange",
      features: ["Working Capital", "Equipment Finance", "Business Expansion"]
    },
    {
      id: "mortgage-loan",
      label: "Mortgage Loan",
      title: "Leverage Your Property",
      subtitle: "With Our Mortgage Loan Solutions",
      description: "Unlock the value of your property with our comprehensive mortgage loan solutions. Whether you need funds for business expansion, education, or other financial needs, our mortgage loans offer competitive rates and flexible repayment options tailored to your requirements.",
      image: businessloan,
      route: "/mortgage-loan",
      icon: "🏛️",
      color: "slate",
      features: ["Property Against Loan", "Higher Loan Amount", "Lower Interest Rates"]
    }
  ];

  return (
    <div id="features-section" className="relative bg-features-gradient min-h-screen py-20 pt-32">
      {/* Enhanced Background Patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-8"></div>
      <div className="absolute inset-0 bg-hexagon-pattern opacity-5"></div>
      
      {/* Floating Background Elements */}
      <div className="absolute top-40 left-20 w-32 h-32 bg-banking-accent/8 rounded-full animate-float blur-xl"></div>
      <div className="absolute bottom-60 right-30 w-28 h-28 bg-banking-lightBlue/6 rounded-full animate-bounce-slow blur-lg"></div>
      <div className="absolute top-80 right-10 w-24 h-24 bg-banking-skyBlue/7 rounded-full animate-spin-slow blur-md"></div>
      
      {/* Section Header */}
      <div className="relative z-10 text-center mb-20 opacity-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Comprehensive <span className="bg-gradient-to-r from-banking-accent via-banking-lightBlue to-banking-skyBlue bg-clip-text text-transparent">Loan Solutions</span>
          </h2>
          <p className="font-banking text-lg sm:text-xl text-gray-200 leading-relaxed">
            Discover our range of financial products designed to meet your every need. 
            From dream homes to business growth, we&apos;ve got you covered.
          </p>
        </div>
      </div>

      {/* Enhanced Navigation Tabs - Removed sticky positioning */}
      <div className="relative z-20 bg-banking-navy/90 backdrop-blur-md border-b border-banking-accent/30 opacity-100 animate-slide-down" style={{animationDelay: '0.9s'}}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center">
            <div className="flex bg-banking-dark/80 backdrop-blur-md rounded-2xl p-3 space-x-3 border border-banking-accent/40 overflow-x-auto shadow-2xl shadow-banking-accent/10 animate-scale-in">
              {loanTypes.map((loan, index) => (
                <button
                  key={loan.id}
                  className={`flex items-center space-x-2 px-6 sm:px-8 py-4 rounded-xl text-sm sm:text-base font-semibold whitespace-nowrap transition-all duration-300 animate-fade-in ${
                    activeTab === loan.id
                      ? `text-white bg-gradient-to-r from-banking-accent to-banking-lightBlue shadow-lg transform scale-105 border border-banking-accent/50 animate-glow`
                      : "text-gray-200 hover:text-white hover:bg-banking-navy/60 border border-transparent hover:animate-pulse"
                  }`}
                  onClick={() => {
                    const section = document.getElementById(loan.id);
                    if (section) {
                      // Add offset to prevent getting stuck at the top
                      const yOffset = -100; // Offset to leave space above the section
                      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      
                      window.scrollTo({ 
                        top: y, 
                        behavior: 'smooth' 
                      });
                      setActiveTab(loan.id);
                    }
                  }}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <span className="text-lg animate-bounce">{loan.icon}</span>
                  <span>{loan.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loan Sections */}
      <div className="relative z-10 container mx-auto px-4 space-y-24 mt-20 opacity-100">
        {loanTypes.map((loan, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={loan.id}
              id={loan.id}
              className="opacity-100 scroll-mt-24"
              style={{scrollMarginTop: '6rem'}}
            >
              <div className="bg-card-gradient backdrop-blur-md rounded-3xl p-8 lg:p-16 border border-banking-accent/30 hover:border-banking-accent/50 transition-all duration-500 group shadow-2xl shadow-banking-accent/5">
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
                  
                  {/* Image Section */}
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r from-banking-accent/20 to-banking-lightBlue/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                      <Link to={loan.route} className="relative block">
                        <img
                          src={loan.image}
                          alt={`${loan.label} Illustration`}
                          className="rounded-2xl w-full max-w-md shadow-2xl transform group-hover:scale-105 transition-all duration-500 border border-banking-accent/30"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-1/2 text-center lg:text-left">
                    <div className="mb-8">
                      <Link 
                        to={loan.route} 
                        className={`inline-flex items-center space-x-3 bg-gradient-to-r from-banking-accent to-banking-lightBlue text-white text-sm font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                      >
                        <span className="text-lg">{loan.icon}</span>
                        <span>{loan.label.toUpperCase()}</span>
                      </Link>
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-banking-dark mb-6 leading-tight">
                      {loan.title} <span className={`text-banking-accent`}>{loan.subtitle.split(' ').slice(-3).join(' ')}</span>
                    </h3>

                    <p className="font-banking text-lg text-banking-slate mb-10 leading-relaxed">
                      {loan.description}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                      {loan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-banking-accent/30 shadow-sm">
                          <svg className={`w-5 h-5 text-banking-accent`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-banking-dark text-sm font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                      <Link
                        to={loan.route}
                        className={`group bg-gradient-to-r from-banking-accent to-banking-lightBlue text-white font-semibold px-10 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2`}
                      >
                        <span>Learn More</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                      
                      <Link
                        to={getApplicationRoute(loan.title)}
                        className="bg-transparent border-2 border-banking-accent text-banking-accent font-semibold px-10 py-4 rounded-xl hover:bg-banking-accent hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                      >
                        <span>Apply Now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Success Stories Section */}
      <div className="relative z-10 mt-24 opacity-100">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-banking-accent/10 backdrop-blur-sm border border-banking-accent/30 rounded-full px-6 py-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-banking-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-banking-accent font-semibold text-sm tracking-wider">
                  VERIFIED SUCCESS STORIES
                </span>
              </div>
            </div>
          </div>
          
          <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Transforming <span className="bg-gradient-to-r from-banking-accent via-banking-lightBlue to-banking-skyBlue bg-clip-text text-transparent">Financial Dreams</span> Into Reality
          </h3>
          <p className="font-banking text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who have achieved their financial goals with INCENTUM. 
            <span className="text-banking-accent font-semibold"> Your success story could be next!</span>
          </p>
          
          {/* Success Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-banking-accent/30 hover:border-banking-accent/50 transition-all duration-300 group">
              <div className="text-3xl font-bold text-banking-accent mb-2 group-hover:scale-110 transition-transform duration-300">4.9★</div>
              <div className="text-gray-200 text-sm">Customer Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-banking-lightBlue/30 hover:border-banking-lightBlue/50 transition-all duration-300 group">
              <div className="text-3xl font-bold text-banking-accent mb-2 group-hover:scale-110 transition-transform duration-300">₹50Cr+</div>
              <div className="text-gray-200 text-sm">Dreams Funded</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-banking-skyBlue/30 hover:border-banking-skyBlue/50 transition-all duration-300 group">
              <div className="text-3xl font-bold text-banking-accent mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
              <div className="text-gray-200 text-sm">Success Rate</div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-4">
          <Swiper
            spaceBetween={30}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            modules={[Autoplay]}
            loop={true}
            slidesPerView={3}
            centeredSlides={true}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 25 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
          >
            {carouselImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`relative transition-all duration-500 ${
                    activeIndex === index 
                      ? "scale-110 z-10" 
                      : "opacity-70 scale-90"
                  }`}
                >
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-banking-accent/30 hover:border-banking-accent/50 transition-all duration-300 shadow-xl group">
                    <img
                      src={img}
                      alt={`Success Story ${index + 1}`}
                      className="w-full h-auto max-h-80 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Success Story Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 bg-banking-dark/90 backdrop-blur-sm rounded-lg p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-2 h-2 bg-banking-accent rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-banking-accent">SUCCESS STORY</span>
                      </div>
                      <p className="text-sm font-medium">Loan Approved Successfully</p>
                      <p className="text-xs text-gray-300">Fast • Secure • Reliable</p>
                    </div>
                  </div>
                  
                  {activeIndex === index && (
                    <div className="absolute inset-0 bg-gradient-to-t from-banking-accent/20 to-transparent rounded-2xl pointer-events-none"></div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-banking-accent/30 max-w-2xl mx-auto">
              <h4 className="font-display text-xl sm:text-2xl font-bold text-white mb-4">
                Ready to Write Your <span className="text-banking-accent">Success Story?</span>
              </h4>
              <p className="text-gray-200 mb-6 leading-relaxed">
                Join our community of successful borrowers and turn your financial dreams into reality.
              </p>
              <Link
                to="/loan-application"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-banking-accent to-banking-lightBlue text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span>Start Your Journey</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default FeaturesSection; 