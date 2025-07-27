import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import { BsSpeedometer2 } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { IoMdContacts } from "react-icons/io";
import { TbListDetails } from "react-icons/tb";
import { MdOutlineDataExploration } from "react-icons/md";
import { motion } from "framer-motion";
import "aos/dist/aos.css";
import AOS from "aos";

function PersonalLoan({ type, openAccordion, handleAccordionClick }) {
    const sections = {
        eligibility: [
            {
                heading: "Credit Score Requirements",
                content: "A credit score of 720+ significantly improves your approval chances and helps secure better interest rates. Our team works with applicants across all credit ranges, offering personalized solutions and guidance to strengthen your personal loan application.",
                icon: <BsSpeedometer2 className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Income Verification",
                content: "Salaried professionals need minimum monthly income of ₹15,000 with 2+ years employment history. Self-employed individuals require stable business operations for 3+ years with consistent income documentation.",
                icon: <IoDocumentTextOutline className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Age and Employment Guidelines",
                content: "Applicants must be between 21-60 years for salaried employees and up to 65 years for self-employed individuals. We evaluate your complete employment stability and career progression.",
                icon: <IoMdContacts className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Financial Assessment",
                content: "Our comprehensive analysis includes Fixed Obligations to Income Ratio (FOIR) below 40%, existing financial commitments, and repayment capacity to ensure comfortable loan servicing.",
                icon: <MdOutlineDataExploration className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
        ],
        documents: [
            {
                heading: "Identity and Address Proof",
                content: "Valid government-issued photo identification (Aadhaar, PAN, Passport, Voter ID) and current address verification documents. We accept utility bills, bank statements, or rental agreements dated within the last 3 months.",
                icon: <BsSpeedometer2 className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Income Documentation",
                content: "Recent salary slips (3 months), Form 16, appointment letter, and bank statements (6 months) for salaried employees. Self-employed applicants need ITR (2 years), business financial statements, and comprehensive bank records (12 months).",
                icon: <IoDocumentTextOutline className="w-8 lg:w-8 h-7 lg:h-8" />,
            },
            {
                heading: "Employment Verification",
                content: "Employment certificate, experience letter, and HR contact details for verification. Self-employed individuals need business registration documents, GST registration, and professional licenses where applicable.",
                icon: <TbListDetails className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Additional Requirements",
                content: "Recent passport-size photographs, processing fee payment confirmation, and any lender-specific documentation. Our relationship managers provide complete guidance throughout the process.",
                icon: <MdOutlineDataExploration className="w-7 h-6 lg:w-6  lg:h-6"/>,
            },
        ],
        apply:[
            {
                heading: "Online Application",
                content: "Complete our streamlined digital application in under 10 minutes. Our user-friendly platform guides you through each step with real-time validation and helpful prompts for accurate information submission.",
                icon: <BsSpeedometer2 className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Quick Pre-Assessment",
                content: "Receive preliminary approval status within 30 minutes through our efficient evaluation system. Get indicative loan amount, interest rate options, and tenure recommendations tailored to your profile.",
                icon: <IoDocumentTextOutline className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Document Processing",
                content: "Our dedicated team assists with document collection and verification. Advanced digital processing ensures accuracy and faster turnaround times for your personal loan application.",
                icon: <TbListDetails className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Approval and Disbursement",
                content: "Final loan approval typically completed within 24-48 hours. Funds are disbursed directly to your bank account with complete transparency. Track your application status through our portal.",
                icon: <MdOutlineDataExploration className="w-7 h-6 lg:w-6  lg:h-6"/>,
            },
        ],
        offer:[
            {
                heading: "Competitive Interest Rates",
                content: "Access market-leading interest rates starting from 10.5% per annum. Choose between fixed and floating rate options based on your financial strategy and creditworthiness.",
                icon: <BsSpeedometer2 className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Flexible Loan Amount",
                content: "Borrow from ₹50,000 to ₹40 lakh based on your eligibility and income profile. Higher loan amounts available for qualified applicants with excellent credit profiles and stable income.",
                icon: <IoDocumentTextOutline className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Convenient Repayment Terms",
                content: "Choose repayment tenure from 12-60 months with the flexibility to prepay without penalties after 12 EMIs. Customize your EMI structure to match your financial planning and cash flow requirements.",
                icon: <IoMdContacts className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Minimal Documentation",
                content: "Experience hassle-free processing with minimal paperwork requirements. Our digital-first approach reduces documentation burden while maintaining security and compliance standards.",
                icon: <TbListDetails className="w-7 h-6 lg:w-6  lg:h-6" />,
            },
            {
                heading: "Quick Processing",
                content: "Experience industry-leading processing times with most applications approved within 24-48 hours. Our digital-first approach ensures minimal delays in your personal financing journey.",
                icon: <MdOutlineDataExploration className="w-7 h-6 lg:w-6  lg:h-6"/>,
            },
        ],
    };

    const titles = {
        eligibility: "Eligibility Requirements",
        documents: "Required Documentation",
        apply: "Application Process",
        offer: "Loan Features & Benefits",
    };

    const descriptions = {
        eligibility: [
            "Understanding our eligibility criteria helps you prepare a strong application.",
            "Here are the key requirements we evaluate for personal loan approval."
        ],
        documents: [
            "Our streamlined documentation process makes your application experience smooth.",
            "Here's what you'll need to have ready for a hassle-free personal loan process."
        ],
        apply:[
            "Follow our simple step-by-step application process designed for your convenience.",
            "From application to disbursement, we make your personal loan straightforward and transparent."
        ],
        offer:[
            "Discover the comprehensive benefits and features of our personal loan products.",
            "We're committed to providing value at every step of your personal financing journey."
        ]
    };

    const images = {
        eligibility: "/personalloanimg/Eligibility.webp",
        documents: "/commonloanimg/documentrequired.png",
        apply:"/personalloanimg/apply.webp",
        offer:"/commonloanimg/offer.png"
    };

     useEffect(() => {
            AOS.init({
                duration: 1000, 
                once: true, 
            });
        }, []);
    

        return (
            <div className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden" id={type} data-accordion-type={type}>
                {/* Enhanced background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-blue-800/30 to-blue-900/50"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-blue-900/20"></div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-8"
                        >
                            <div className="space-y-6">
                                <motion.h1 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg"
                                >
                                    {titles[type]}
                                </motion.h1>
                                
                                <div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full shadow-lg"></div>
                                
                                <div className="space-y-4">
                                    <motion.p 
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className="text-lg text-white leading-relaxed font-medium drop-shadow-sm"
                                    >
                                        {descriptions[type][0]}
                                    </motion.p>
                                    <motion.p 
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="text-lg text-blue-100 leading-relaxed drop-shadow-sm"
                                    >
                                        {descriptions[type][1]}
                                    </motion.p>
                                </div>
                            </div>

                            {/* Accordion */}
                            <div className="space-y-4">
                                {sections[type].map((section, index) => {
                                    const accordionKey = `${type}-${index + 1}`;
                                    const isOpen = openAccordion === accordionKey;
                                    
                                    return (
                                        <motion.div
                                            key={accordionKey}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="group"
                                        >
                                            <Accordion
                                                open={isOpen}
                                                className={`rounded-xl border transition-all duration-300 ${
                                                    isOpen 
                                                        ? 'bg-white/25 border-white/50 shadow-2xl backdrop-blur-lg' 
                                                        : 'bg-white/15 border-white/30 hover:bg-white/20 hover:border-white/40 backdrop-blur-lg'
                                                }`}
                                            >
                                                <AccordionHeader
                                                    onClick={() => handleAccordionClick(accordionKey)}
                                                    className="px-6 py-4 font-medium cursor-pointer text-white flex items-center gap-4 border-none hover:bg-white/10 transition-all duration-300"
                                                >
                                                    <motion.div 
                                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                                        animate={isOpen ? { 
                                                            scale: [1, 1.1, 1],
                                                            rotate: [0, 10, -10, 0] 
                                                        } : {}}
                                                        transition={{ 
                                                            duration: 2, 
                                                            repeat: isOpen ? Infinity : 0, 
                                                            repeatType: "reverse" 
                                                        }}
                                                        className="p-3 rounded-xl bg-gradient-to-br from-white/30 to-white/20 border border-white/40 backdrop-blur-sm shadow-lg"
                                                    >
                                                        {section.icon}
                                                    </motion.div>
                                                    <div className="flex-1 text-left">
                                                        <h3 className="text-lg font-bold text-white group-hover:text-yellow-300 transition-colors drop-shadow-sm">
                                                            {section.heading}
                                                        </h3>
                                                    </div>
                                                    <motion.div
                                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        whileHover={{ scale: 1.1 }}
                                                        className="w-8 h-8 rounded-full bg-white/25 border border-white/40 flex items-center justify-center backdrop-blur-sm"
                                                    >
                                                        <span className="text-white font-bold">+</span>
                                                    </motion.div>
                                                </AccordionHeader>
                                                
                                                <motion.div
                                                    initial={false}
                                                    animate={{ 
                                                        height: isOpen ? "auto" : 0,
                                                        opacity: isOpen ? 1 : 0
                                                    }}
                                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <AccordionBody className="px-6 pb-6 pt-0">
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                                            transition={{ duration: 0.3, delay: 0.1 }}
                                                            className="pl-16"
                                                        >
                                                            <p className="text-blue-100 leading-relaxed font-medium drop-shadow-sm">
                                                                {section.content}
                                                            </p>
                                                        </motion.div>
                                                    </AccordionBody>
                                                </motion.div>
                                            </Accordion>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Right Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative flex justify-center lg:justify-end"
                        >
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative z-10"
                                >
                                    <img
                                        src={images[type]}
                                        alt={`${titles[type]} Illustration`}
                                        className="w-full max-w-md lg:max-w-lg rounded-2xl shadow-2xl border-2 border-white/30"
                                    />
                                </motion.div>
                                
                                {/* Floating Element */}
                                <motion.div
                                    animate={{ y: [-8, 8, -8] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl border-2 border-white z-20"
                                >
                                    <motion.span 
                                        
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-lg">✨</span>
                                        <span className="text-white font-bold">Professional</span>
                                    </motion.span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }
        

export default function App() { 
    const [openAccordion, setOpenAccordion] = useState(null);

    const handleAccordionClick = (key) => {
        setOpenAccordion(openAccordion === key ? null : key);
    };

    return (
        <div>
            <PersonalLoan type="eligibility" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
            <PersonalLoan type="documents" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
            <PersonalLoan type="apply" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
            <PersonalLoan type="offer" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
        </div>
    );
}
