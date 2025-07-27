import React, { useState } from "react";
import { 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaHeadset,
  FaPaperPlane,
  FaCheckCircle
} from "react-icons/fa";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeOffice, setActiveOffice] = useState('mumbai');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 2000);
  };

  const contactMethods = [
    {
      title: "Call Us Now",
      subtitle: "Instant Support",
      value: "+91 98765 43210",
      icon: FaPhoneAlt,
      color: "blue",
      description: "Get immediate assistance from our expert team"
    },
    {
      title: "Email Us",
      subtitle: "Detailed Queries",
      value: "info@incentum.com",
      icon: FaEnvelope,
      color: "green",
      description: "Send us your detailed requirements and questions"
    },
    {
      title: "Visit Office",
      subtitle: "Personal Meeting",
      value: "Mumbai, India",
      icon: FaMapMarkerAlt,
      color: "purple",
      description: "Schedule a visit to our office for personalized service"
    }
  ];

  const features = [
    {
      icon: FaClock,
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your financial needs"
    },
    {
      icon: FaUsers,
      title: "Expert Team",
      description: "Experienced professionals dedicated to your success"
    },
    {
      icon: FaHeadset,
      title: "Multiple Channels",
      description: "Reach us via phone, email, chat, or in-person"
    }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-6 py-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <FaHeadset className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold text-sm tracking-wider">
                    GET IN TOUCH
                  </span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Let's Start Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Financial Journey
              </span>{" "}
              Together
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your financial future? Our expert team is here to guide you 
              every step of the way. Reach out today and discover how INCENTUM can help you achieve your goals.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-blue-500/50 transition-all duration-300 group hover:scale-105 shadow-xl"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${
                    method.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    method.color === 'green' ? 'from-green-500 to-green-600' :
                    'from-purple-500 to-purple-600'
                  } rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-blue-400 font-medium mb-3">{method.subtitle}</p>
                  <p className="text-gray-300 mb-4 font-medium">{method.value}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white/5 backdrop-blur-sm border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Side - Form */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    How Can We <span className="text-blue-400">Help</span> You?
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Fill out the form and our team will get back to you within 24 hours with personalized solutions.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select a subject</option>
                        <option value="home-loan">Home Loan Inquiry</option>
                        <option value="personal-loan">Personal Loan Inquiry</option>
                        <option value="business-loan">Business Loan Inquiry</option>
                        <option value="vehicle-loan">Vehicle Loan Inquiry</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements..."
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex items-center space-x-3">
                      <FaCheckCircle className="w-6 h-6 text-green-400" />
                      <div>
                        <p className="text-green-400 font-semibold">Message sent successfully!</p>
                        <p className="text-green-300 text-sm">We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Right Side - Features */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-white">Why Choose INCENTUM?</h3>
                  <div className="space-y-6">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                          <p className="text-gray-300">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h4 className="text-lg font-semibold text-white mb-4">Quick Response Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                                         <div className="text-center">
                       <div className="text-2xl font-bold text-blue-400 mb-1">&lt; 2hrs</div>
                       <div className="text-sm text-gray-300">Response Time</div>
                     </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">98%</div>
                      <div className="text-sm text-gray-300">Satisfaction Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">24/7</div>
                      <div className="text-sm text-gray-300">Availability</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">1000+</div>
                      <div className="text-sm text-gray-300">Happy Clients</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office Information */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Visit Our <span className="text-blue-400">Offices</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We have two convenient locations to serve you better - in Mumbai and Delhi's prime financial districts.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveOffice('mumbai')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeOffice === 'mumbai' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Mumbai Office
                </button>
                <button 
                  onClick={() => setActiveOffice('delhi')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeOffice === 'delhi' 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Delhi Office
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">
                  INCENTUM Financial Services - {activeOffice === 'mumbai' ? 'Mumbai' : 'Delhi'}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <FaMapMarkerAlt className="w-6 h-6 text-blue-400 mt-1" />
                    <div>
                      <p className="text-white font-medium">Address</p>
                      <p className="text-gray-300">
                        {activeOffice === 'mumbai' 
                          ? '123 Financial District, Bandra Kurla Complex, Mumbai - 400051, India'
                          : '456 Business Hub, Connaught Place, New Delhi - 110001, India'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FaPhoneAlt className="w-6 h-6 text-green-400 mt-1" />
                    <div>
                      <p className="text-white font-medium">Phone</p>
                      <p className="text-gray-300">
                        {activeOffice === 'mumbai' 
                          ? '+91 98765 43210'
                          : '+91 87654 32109'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FaEnvelope className="w-6 h-6 text-purple-400 mt-1" />
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <p className="text-gray-300">
                        {activeOffice === 'mumbai' 
                          ? 'mumbai@incentum.com'
                          : 'delhi@incentum.com'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FaClock className="w-6 h-6 text-yellow-400 mt-1" />
                    <div>
                      <p className="text-white font-medium">Business Hours</p>
                      <p className="text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <FaUsers className="w-6 h-6 text-blue-400 mt-1" />
                    <div>
                      <p className="text-white font-medium">Specialization</p>
                      <p className="text-gray-300">
                        {activeOffice === 'mumbai' 
                          ? 'Home Loans, Business Loans, Investment Advisory'
                          : 'Personal Loans, Vehicle Loans, Corporate Banking'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="aspect-w-16 aspect-h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FaMapMarkerAlt className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-white font-medium">Interactive Map</p>
                    <p className="text-gray-400 text-sm">
                      Visit us at our {activeOffice === 'mumbai' ? 'Mumbai' : 'Delhi'} office
                    </p>
                    <button 
                      onClick={() => window.open(
                        activeOffice === 'mumbai' 
                          ? 'https://maps.google.com/?q=Bandra+Kurla+Complex,+Mumbai'
                          : 'https://maps.google.com/?q=Connaught+Place,+New+Delhi'
                        , '_blank'
                      )}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
