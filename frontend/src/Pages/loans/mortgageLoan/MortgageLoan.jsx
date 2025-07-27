
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import EmiCalculator from "../../homePage/homecomponents/EmiCalculator";
import PersonalAccordion from "./MortgageAccordion";
import LoanNav from "../../../components/loanSec/LoanNav";
import Button from "../../../components/loanSec/Button";

export default function MortgageLoan() {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const premiumFeatures = [
    {
      icon: "🏦",
      title: "Competitive Rates",
      description: "Starting from 9.5% per annum",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: "⚡",
      title: "Quick Processing",
      description: "Approval in 48-72 hours",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100"
    },
    {
      icon: "📋",
      title: "Property Valuation",
      description: "Professional assessment",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      icon: "🛡️",
      title: "Secure Platform",
      description: "Bank-grade security",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    },
  ];

  const valuePropositions = [
    {
      icon: "🎯",
      title: "Smart Property Evaluation",
      description: "Our advanced system analyzes your property value and matches you with the most suitable mortgage loan products from our network of trusted banking partners.",
      features: ["Property Analysis", "Rate Comparison", "Loan-to-Value Options"],
      gradient: "from-blue-600 to-blue-700"
    },
    {
      icon: "⚡",
      title: "Streamlined Processing",
      description: "Experience efficient loan processing with our digital-first approach, designed to minimize paperwork and reduce approval times significantly.",
      features: ["Digital Documentation", "Quick Verification", "Fast Approval"],
      gradient: "from-emerald-600 to-emerald-700"
    },
    {
      icon: "💎",
      title: "Value-Added Benefits",
      description: "Access exclusive offers, cashback opportunities, and premium services that add significant value to your mortgage loan experience.",
      features: ["Cashback Offers", "Premium Support", "Exclusive Deals"],
      gradient: "from-purple-600 to-purple-700"
    }
  ];

  const trustIndicators = [
    { value: "₹50Cr+", label: "Loans Disbursed", icon: "💰" },
    { value: "1,000+", label: "Happy Customers", icon: "👥" },
    { value: "50+", label: "Banking Partners", icon: "🏦" },
    { value: "99.2%", label: "Approval Rate", icon: "✅" }
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        {/* Enhanced Floating Elements */}
        <motion.div
          animate={{ 
            y: [-15, 15, -15], 
            rotate: [0, 2, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-60 shadow-lg"
        />
        <motion.div
          animate={{ 
            y: [15, -15, 15], 
            rotate: [0, -2, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full opacity-60 shadow-lg"
        />
        <motion.div
          animate={{ 
            y: [-10, 10, -10], 
            rotate: [0, 3, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full opacity-50 shadow-lg"
        />
        <motion.div
          animate={{ 
            y: [10, -10, 10], 
            rotate: [0, -1, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 right-1/3 w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full opacity-40 shadow-lg"
        />
        
        {/* Main Content */}
        <div className="relative z-10 pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
              
              {/* Left Content */}
              <div className="space-y-8">
                <motion.div {...slideInLeft}>
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-xl border-2 border-blue-200"
                  >
                    <span className="font-bold text-base tracking-wide uppercase flex items-center gap-3">
                      <motion.span 
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="text-2xl"
                      >
                        🏦
                      </motion.span>
                      <span className="text-white drop-shadow-sm">Mortgage Loan Solutions</span>
                    </span>
                  </motion.div>
                </motion.div>

                <motion.div {...fadeInUp} className="space-y-6">
                  <motion.h1 
                    className="text-5xl lg:text-6xl font-bold leading-tight text-slate-800"
                    whileInView={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    Get Loan Against
                    <br />
                    <span className="text-blue-600 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                      Your Property
                    </span>
                    <br />
                    Today
                  </motion.h1>
                  
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "5rem" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full"
                  ></motion.div>
                </motion.div>

                <motion.p
                  {...fadeInUp}
                  className="text-xl text-slate-700 leading-relaxed max-w-2xl font-medium"
                >
                  Mortgage loans are an essential financial tool for unlocking the value of your equity in existing property. They offer a cost-effective way to fund major expenses, consolidate debt, or invest in new opportunities.
                </motion.p>

                {/* Enhanced CTA Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="w-full max-w-lg"
                >
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button loanType="Mortgage Loan" />
                  </motion.div>
                </motion.div>

                {/* Enhanced Trust Indicators */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="grid grid-cols-2 gap-6 w-full max-w-lg pt-8 border-t border-slate-200"
                >
                  {trustIndicators.map((indicator, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -3 }}
                      className="text-center bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100"
                    >
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0] 
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          repeatType: "reverse",
                          delay: index * 0.5
                        }}
                        className="text-2xl mb-2"
                      >
                        {indicator.icon}
                      </motion.div>
                      <motion.div 
                        className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1"
                        whileInView={{ 
                          scale: [1, 1.1, 1],
                          color: ["#2563eb", "#1d4ed8", "#2563eb"]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {indicator.value}
                      </motion.div>
                      <div className="text-slate-600 text-sm font-medium">{indicator.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Right Image Section with Features */}
              <motion.div 
                {...slideInRight}
                className="relative flex flex-col items-center space-y-8 pt-16"
              >
                {/* Image */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <motion.img
                      src="/personalloanimg/personalgif.gif"
                      alt="Mortgage Loan Experience"
                      className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl border border-slate-200"
                      whileInView={{ 
                        boxShadow: [
                          "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                          "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
                          "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>
                  
                  {/* Enhanced Floating Labels */}
                  <motion.div
                    animate={{ 
                      y: [-10, 10, -10],
                      rotate: [0, 2, -2, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -right-6 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-full text-sm font-bold shadow-xl border-2 border-white z-20"
                  >
                    <span className="flex items-center gap-2">
                      <motion.span 
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-lg"
                      >
                        ✅
                      </motion.span>
                      <span className="text-white font-bold">Pre-Approved</span>
                    </span>
                  </motion.div>
                  
                  <motion.div
                    animate={{ 
                      y: [10, -10, 10],
                      rotate: [0, -2, 2, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-full text-sm font-bold shadow-xl border-2 border-white z-20"
                  >
                    <span className="flex items-center gap-2">
                      <motion.span 
                        animate={{ 
                          scale: [1, 1.3, 1],
                          rotate: [0, 180, 360] 
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="text-lg"
                      >
                        💎
                      </motion.span>
                      <span className="text-white font-bold">Best Rates</span>
                    </span>
                  </motion.div>
                </div>

                {/* Enhanced Features Grid */}
                <motion.div 
                  {...fadeInUp}
                  className="grid grid-cols-2 gap-6 mt-28 w-full max-w-lg pt-10"
                >
                  {premiumFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                        activeFeature === index 
                          ? `bg-gradient-to-br ${feature.bgGradient} border-white shadow-2xl` 
                          : `bg-white border-slate-200 hover:bg-gradient-to-br hover:${feature.bgGradient}`
                      }`}
                    >
                      <div className="relative z-10">
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 10, -10, 0] 
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            repeatType: "reverse",
                            delay: index * 0.3
                          }}
                          className="text-4xl mb-4"
                        >
                          {feature.icon}
                        </motion.div>
                        <h4 className="text-slate-800 font-bold text-lg mb-3">{feature.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">{feature.description}</p>
                      </div>
                      <motion.div 
                        className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full transform translate-x-6 -translate-y-6`}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360] 
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      ></motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Proposition Section - Enhanced Visibility */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          animate={{ 
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            rotate: [0, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full opacity-20"
        />
        <motion.div
          animate={{ 
            x: [100, -100, 100],
            y: [50, -50, 50],
            rotate: [0, -360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full opacity-20"
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6"
              whileInView={{ 
                scale: [1, 1.02, 1],
                color: ["#1e293b", "#3b82f6", "#1e293b"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Why Choose Our Service?
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "5rem" }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-8 rounded-full"
            ></motion.div>
            <motion.p 
              className="text-xl text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              We provide comprehensive mortgage loan solutions with professional service, 
              competitive rates, and personalized support throughout your journey.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {valuePropositions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200 hover:shadow-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <motion.div 
                    className="text-5xl mb-6"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0] 
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      repeatType: "reverse",
                      delay: index * 0.5
                    }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
                  <p className="text-slate-700 mb-6 leading-relaxed font-medium">{item.description}</p>
                  
                  <div className="space-y-3">
                    {item.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={featureIndex} 
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1, duration: 0.3 }}
                      >
                        <motion.div 
                          className="w-3 h-3 bg-blue-600 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: featureIndex * 0.2 
                          }}
                        ></motion.div>
                        <span className="text-slate-700 font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <motion.div 
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-5 rounded-full transform translate-x-12 -translate-y-12`}
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360] 
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                ></motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Additional Sections */}
      <div className="bg-slate-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <LoanNav />
          <PersonalAccordion />
          <EmiCalculator />
        </motion.div>
      </div>
    </>
  );
}
