import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const [activeValue, setActiveValue] = useState(0);
  
  const refs = {
    hero: useRef(null),
    story: useRef(null),
    mission: useRef(null),
    values: useRef(null),
    team: useRef(null),
    stats: useRef(null),
    cta: useRef(null),
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
      { threshold: 0.2 }
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

  // Auto-rotate values every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const values = [
    {
      title: "Innovation First",
      description: "We leverage cutting-edge technology and AI to revolutionize financial services.",
      icon: "🚀",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Customer Centric",
      description: "Every decision we make is centered around delivering exceptional customer value.",
      icon: "❤️",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Trust & Transparency",
      description: "We build lasting relationships through honest, transparent financial guidance.",
      icon: "🛡️",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Excellence Driven",
      description: "We set industry benchmarks through our commitment to service excellence.",
      icon: "⭐",
      color: "bg-blue-50 border-blue-200"
    }
  ];

  const teamMembers = [
    {
      name: "Rajesh Kumar",
      position: "Chief Executive Officer",
      bio: "Visionary leader with 15+ years in fintech, driving digital transformation.",
      emoji: "👨‍💼"
    },
    {
      name: "Priya Sharma",
      position: "Chief Technology Officer",
      bio: "AI expert passionate about innovative financial solutions and user experience.",
      emoji: "👩‍💻"
    },
    {
      name: "Amit Patel",
      position: "Head of Operations",
      bio: "Operations excellence specialist ensuring seamless customer experiences.",
      emoji: "👨‍🔧"
    },
    {
      name: "Sneha Gupta",
      position: "Head of Customer Success",
      bio: "Customer advocacy champion with expertise in relationship management.",
      emoji: "👩‍💼"
    }
  ];

  const stats = [
    { number: "1,000+", label: "Happy Customers", icon: "👥" },
    { number: "₹50Cr+", label: "Loans Processed", icon: "💰" },
    { number: "98%", label: "Approval Rate", icon: "✅" },
    { number: "24/7", label: "Customer Support", icon: "🕒" }
  ];

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
      <section 
        id="hero" 
        ref={refs.hero}
        className="relative min-h-screen flex items-center justify-center px-4 py-20"
      >
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="mb-4 animate-fade-in">
            <div className="inline-block mb-3">
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 shadow-lg">
                <span className="text-blue-400 font-semibold text-sm">
                  ABOUT INCENTUM
                </span>
              </div>
            </div>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Redefining <span className="text-blue-400">Financial</span> Excellence
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.3s'}}>
            Where innovation meets trust, and your financial dreams become reality. 
            We&apos;re not just a financial consultancy—we&apos;re your partners in building a prosperous future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Link
              to="/co-applicant-form-detail-one"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <span>Start Your Journey</span>
            </Link>
            
            <Link
              to="/contact-us"
              className="bg-transparent border-2 border-gray-300/60 text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-300/10 hover:border-blue-400 hover:text-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <span>Get in Touch</span>
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '0.5s'}}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl mb-2">
                  {stat.icon}
                </div>
                <div className="text-xl font-bold text-blue-400 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-blue-600 text-sm font-medium mb-2">Scroll to explore</div>
          <div className="w-6 h-10 border-2 border-blue-200 rounded-full flex justify-center mx-auto">
            <div className="w-1 h-3 bg-blue-400 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section 
        id="story" 
        ref={refs.story}
        className="relative py-20 px-4 bg-white/5 backdrop-blur-sm border-y border-white/10"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`animate-fade-in ${visibleSections.story ? 'opacity-100' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <div className="mb-4">
                <div className="inline-block mb-3">
                  <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 shadow-lg">
                    <span className="text-blue-400 font-semibold text-sm">
                      OUR STORY
                    </span>
                  </div>
                </div>
                
                <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
                  Built on <span className="text-blue-400">Innovation</span> & Trust
                </h2>
                
                <div className="space-y-4 text-gray-300">
                  <p>
                    Founded with a vision to democratize financial services, INCENTUM emerged from the belief that 
                    everyone deserves access to transparent, efficient, and rewarding financial solutions.
                  </p>
                  
                  <p>
                    Our journey began with a simple question: &quot;How can we make financial services more accessible, 
                    transparent, and beneficial for everyone?&quot; Today, we&apos;re proud to be pioneers in customer 
                    incentivization and AI-driven financial consultancy.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-2">2019</div>
                  <div className="text-gray-300 text-sm">Founded</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-2">50K+</div>
                  <div className="text-gray-300 text-sm">Customers Served</div>
                </div>
              </div>
            </div>

            <div className={`animate-fade-in ${visibleSections.story ? 'opacity-100' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-lg">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Mission Driven</h4>
                    <p className="text-gray-300 text-sm">Empowering financial dreams</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Future Ready</h4>
                    <p className="text-gray-300 text-sm">AI-powered solutions</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Customer First</h4>
                    <p className="text-gray-300 text-sm">Your success priority</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Excellence</h4>
                    <p className="text-gray-300 text-sm">Setting industry benchmarks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section 
        id="mission" 
        ref={refs.mission}
        className="relative py-20 px-4"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 shadow-lg">
                <span className="text-blue-400 font-semibold text-sm">
                  MISSION & VISION
                </span>
              </div>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Driving <span className="text-blue-400">Change</span> in Finance
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className={`bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-lg animate-fade-in ${visibleSections.mission ? 'opacity-100' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <div className="flex items-start mb-6">
                <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mr-5">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-blue-400">Our Mission</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To revolutionize financial accessibility through innovative technology, transparent processes, 
                and customer-centric solutions that empower individuals and businesses to achieve their financial goals 
                with confidence and ease.
              </p>
            </div>

            <div className={`bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-lg animate-fade-in ${visibleSections.mission ? 'opacity-100' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
              <div className="flex items-start mb-6">
                <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center mr-5">
                  <span className="text-2xl">🔮</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-blue-400">Our Vision</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                To become the most trusted and innovative financial platform globally, where every customer 
                experiences seamless, rewarding, and personalized financial services that transform their 
                relationship with money and investments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section 
        id="values" 
        ref={refs.values}
        className="relative py-20 px-4"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 shadow-lg">
                <span className="text-blue-400 font-semibold text-sm">
                  CORE VALUES
                </span>
              </div>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Values That <span className="text-blue-400">Define</span> Us
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Our principles guide every decision and shape every interaction with our customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`relative bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transition-all duration-300 cursor-pointer animate-fade-in hover:scale-105 ${
                  activeValue === index ? 'border-blue-400/50 shadow-xl' : 'hover:border-blue-400/30'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
                onMouseEnter={() => setActiveValue(index)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">{value.icon}</span>
                  </div>
                  
                  <h3 className="font-display text-xl font-bold text-white mb-3">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section 
        id="team" 
        ref={refs.team}
        className="relative py-20 px-4"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-4 py-2 shadow-lg">
                <span className="text-blue-400 font-semibold text-sm">
                  OUR TEAM
                </span>
              </div>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Meet the <span className="text-blue-400">Visionaries</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Passionate professionals dedicated to transforming your financial journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transition-all duration-300 group animate-fade-in hover:scale-105 ${visibleSections.team ? 'opacity-100' : 'opacity-0'}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{member.emoji}</span>
                  </div>
                  
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    {member.name}
                  </h3>
                  
                  <p className="text-blue-400 font-medium mb-3 text-sm">
                    {member.position}
                  </p>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>

                  <div className="flex justify-center space-x-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors duration-300 cursor-pointer">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500/30 transition-colors duration-300 cursor-pointer">
                      <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        id="stats" 
        ref={refs.stats}
        className="relative py-20 px-4 bg-white/5 backdrop-blur-sm border-y border-white/10"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Numbers That <span className="text-blue-400">Speak</span>
            </h2>
            <p className="text-lg text-gray-300">
              Our achievements reflect our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg transition-all duration-300 group animate-fade-in hover:scale-105 ${visibleSections.stats ? 'opacity-100' : 'opacity-0'}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        ref={refs.cta}
        className="relative py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <div className={`animate-fade-in ${visibleSections.cta ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Financial Future?
            </h2>
            
            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-3xl mx-auto">
              Join thousands of satisfied customers who have achieved their financial goals with INCENTUM. 
              Your success story starts here.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/home-loan-application"
                className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-md hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300"
              >
                <span>Apply for Loan</span>
              </Link>
              
              <Link
                to="/contact-us"
                className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default AboutUs;
