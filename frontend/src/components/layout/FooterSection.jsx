import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaArrowRight,
  FaShieldAlt,
  FaAward,
  FaClock,
  FaUsers
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
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
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/8 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-blue-500/12 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">I</span>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  INCENTUM
                </h1>
              </div>
              
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                Your trusted financial partner providing AI-driven loan solutions. From dream homes to business growth, we connect you with the best banking partners.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">50Cr+</div>
                  <div className="text-xs text-gray-400">Loans Disbursed</div>
                </div>
                <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">1000+</div>
                  <div className="text-xs text-gray-400">Happy Customers</div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-all duration-300 hover:scale-110 border border-white/20">
                  <FaFacebook className="w-5 h-5 text-blue-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-all duration-300 hover:scale-110 border border-white/20">
                  <FaTwitter className="w-5 h-5 text-blue-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-all duration-300 hover:scale-110 border border-white/20">
                  <FaLinkedin className="w-5 h-5 text-blue-400" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-all duration-300 hover:scale-110 border border-white/20">
                  <FaInstagram className="w-5 h-5 text-blue-400" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-3"></div>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "About Us", path: "/about-us" },
                  { name: "Contact", path: "/contact-us" },
                  { name: "EMI Calculator", path: "/emi-calculator" },
                  { name: "Apply Now", path: "/home-loan-application" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                    >
                      <FaArrowRight className="w-3 h-3 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="group-hover:translate-x-2 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Loan Products */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-3"></div>
                Loan Products
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Home Loan", path: "/home-loan" },
                  { name: "Vehicle Loan", path: "/vehicle-loan" },
                  { name: "Personal Loan", path: "/personal-loan" },
                  { name: "Business Loan", path: "/business-loan" },
                  { name: "Mortgage Loan", path: "/mortgage-loan" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path} 
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group"
                    >
                      <FaArrowRight className="w-3 h-3 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="group-hover:translate-x-2 transition-transform duration-300">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-3"></div>
                Get in Touch
              </h3>
              
              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FaPhone className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">+91 12345 67890</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">info@incentum.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-1">
                    <FaMapMarkerAlt className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">123 Financial District, Mumbai, India</span>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h4 className="font-semibold text-white mb-3">Stay Updated</h4>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center space-y-2">
                <FaShieldAlt className="w-8 h-8 text-blue-400" />
                <span className="text-sm text-gray-300">100% Secure</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <FaAward className="w-8 h-8 text-blue-400" />
                <span className="text-sm text-gray-300">RBI Registered</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <FaClock className="w-8 h-8 text-blue-400" />
                <span className="text-sm text-gray-300">24/7 Support</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <FaUsers className="w-8 h-8 text-blue-400" />
                <span className="text-sm text-gray-300">50+ Partners</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm">
                  © 2024 Incentum Financial Services. All rights reserved.
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link to="/disclaimer" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                  Disclaimer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
