import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Added motion for animation
import EmiCalculator from "../../homePage/homecomponents/EmiCalculator";
import BusinessAccordion from "./BusinessAccordion";
import LoanNav from "../../../components/loanSec/LoanNav";
import Button from "../../../components/loanSec/Button";

export default function BusinessLoan() {
  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.7 } },
  };

  return (
    <>
      <div className="scroll-smooth focus:scroll-auto">
        <div className="landingheader">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-0">
            {/* Left Section */}
            <div className="mt-4 lg:mt-[70px] lg:ml-[120px]">
              <motion.div {...slideInLeft}>
                <button className="mb-4 lg:mb-6 hover:scale-105 hover:shadow-lg transform transition-all duration-300">
                  <Link
                    className="bg-primary text-white text-sm sm:text-md px-4 py-3 md:px-5 md:py-3 rounded-full font-medium hover:bg-blue-800"
                  >
                    BUSINESS LOAN
                  </Link>
                </button>
              </motion.div>

              <motion.h2
                {...fadeInUp}
                className="font-bold text-[26px] sm:text-[48px] lg:text-[50px] leading-[44px] sm:leading-[60px] lg:leading-[55px]"
              >
                Fuel Your Business Ambitions with Ease
              </motion.h2>

              {/* Mobile View GIF */}
              <div className="flex lg:hidden justify-center items-center mt-12 lg:mt-[310px]">
                <motion.img
                  {...scaleIn}
                  src="/businessloanimg/busenessLoan.gif"
                  alt="Business Loan GIF"
                  className="h-auto max-w-full w-[300px] sm:w-[500px] lg:w-[700px] lg:h-[500px]"
                />
              </div>

              <motion.p
                {...fadeInUp}
                className="text-md sm:text-lg lg:text-[14px] leading-[20px] sm:leading-[25px] lg:leading-[29px] text-gray-800 mt-4 lg:mt-3"
              >
                Whether you're expanding your operations, upgrading equipment, or covering day-to-day expenses, our AI-driven consultation ensures you secure the best loan for your business needs. Experience a seamless process, tailored to your requirements.
              </motion.p>

              <motion.p
                {...fadeInUp}
                className="text-md sm:text-lg lg:text-[14px] leading-[20px] sm:leading-[25px] lg:leading-[29px] text-gray-800"
              >
                With options for flexible repayment terms, competitive rates, and fast approvals, we take the stress out of securing financing, leaving you free to focus on growing your business.
              </motion.p>

              <motion.h2
                {...fadeInUp}
                className="text-xl lg:text-[22px] mt-4 lg:mt-6 lg:leading-7"
              >
                Ready to take your business to new heights?
              </motion.h2>

              <motion.div {...slideInLeft}>
                <Link to="/business-details-BusinessLoan">
                  <Button />
                </Link>
              </motion.div>
            </div>

            {/* Right Section */}
            <div className="justify-center hidden lg:block items-center lg:mt-[70px]">
              <motion.img
                {...slideInRight}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.3)",
                }}
                transition={{ duration: 0.3 }}
                src="/businessloanimg/busenessLoan.gif"
                alt="Business Loan GIF"
                className="h-auto max-w-full w-[300px] sm:w-[350px] lg:w-[650px] lg:ml-[50px] lg:h-[549px] rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="landingfooter">
          <motion.div {...fadeInUp}>
            <LoanNav />
            <BusinessAccordion />
            <EmiCalculator />
          </motion.div>
        </div>
      </div>
    </>
  );
}
