import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Button({ loanType = 'Personal Loan' }) {
  // Direct route mapping to bypass redirect
  const getDirectRoute = (loanType) => {
    const routeMap = {
      'Home Loan': '/home-loan-application',
      'Personal Loan': '/personal-loan-application', 
      'Vehicle Loan': '/vehicle-loan-application',
      'Business Loan': '/business-loan-application',
      'Mortgage Loan': '/mortgage-loan-application'
    };
    return routeMap[loanType] || '/home-loan-application';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {/* Apply Now Button */}
      <Link to={getDirectRoute(loanType)} className="w-full block">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-2xl">📋</span>
            <span>Apply Now</span>
            <motion.svg
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </motion.svg>
          </span>
        </motion.div>
      </Link>

      {/* Contact Us Button */}
      <Link to={'/contact-us'} className="w-full block">
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl border-2 border-slate-200 hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-2xl">📞</span>
            <span>Contact Us</span>
            <motion.svg
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </motion.svg>
          </span>
        </motion.div>
      </Link>
    </div>
  );
}
