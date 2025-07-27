import React, { useState,useEffect } from "react";
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

function BusinessLoan({ type, openAccordion, handleAccordionClick }) {
    const sections = {
           eligibility: [
               {
                   heading: "Credit Score Requirements",
                   content: "A credit score of 720+ significantly improves your approval chances and helps secure better interest rates. Business credit history and CIBIL MSME Rank (CMR) of 6 or below are preferred for optimal loan terms.",
                   icon: <BsSpeedometer2 className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Business Vintage",
                   content: "Your business should be operational for at least 3 years with consistent revenue generation. We evaluate business stability, growth trajectory, and market positioning for loan assessment.",
                   icon: <IoDocumentTextOutline className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Financial Performance",
                   content: "Minimum annual turnover of ₹10 lakh with positive cash flow and profitability trends. We analyze your business financials, debt service coverage ratio, and working capital requirements.",
                   icon: <IoMdContacts className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Age and Experience",
                   content: "Business owners must be between 21-65 years with relevant industry experience. We evaluate management expertise, business acumen, and succession planning for long-term viability.",
                   icon: <MdOutlineDataExploration className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
           ],
           documents: [
               {
                   heading: "Identity and Address Proof",
                   content: "Valid government-issued photo identification (Aadhaar, PAN, Passport) for all directors/partners and current business address verification documents. We accept utility bills, property tax receipts, or lease agreements.",
                   icon: <BsSpeedometer2 className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Business Registration Documents",
                   content: "Certificate of incorporation, partnership deed, GST registration, trade license, and professional licenses where applicable. Complete business registration and compliance documentation required.",
                   icon: <IoDocumentTextOutline className="w-8 lg:w-8 h-7 lg:h-8" />,
               },
               {
                   heading: "Financial Statements",
                   content: "Audited financial statements (2-3 years), profit & loss statements, balance sheets, cash flow statements, and ITR filings. Comprehensive financial documentation for business assessment.",
                   icon: <TbListDetails className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Banking and Additional Documents",
                   content: "Business bank statements (12 months), existing loan statements, project reports (if applicable), and any collateral documents. Our team ensures thorough verification.",
                   icon: <MdOutlineDataExploration className="w-7 h-6 lg:w-6  lg:h-6"/>,
               },
           ],
           apply:[
               {
                   heading: "Business Assessment",
                   content: "Complete our comprehensive business evaluation form including financial projections, funding requirements, and business plans. Our experts analyze your business model and growth potential.",
                   icon: <BsSpeedometer2 className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Financial Evaluation",
                   content: "Receive detailed financial assessment within 48 hours through our specialized business evaluation team. Get indicative loan amount, interest rates, and customized repayment options.",
                   icon: <IoDocumentTextOutline className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Documentation and Verification",
                   content: "Our dedicated business loan specialists assist with document collection, verification, and compliance checks. Streamlined process ensures accuracy and faster approval times.",
                   icon: <TbListDetails className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Approval and Disbursement",
                   content: "Final loan approval typically completed within 48-72 hours after documentation. Funds are disbursed as per agreed terms with complete transparency and tracking capabilities.",
                   icon: <MdOutlineDataExploration className="w-7 h-6 lg:w-6  lg:h-6"/>,
               },
           ],
           offer:[
               {
                   heading: "Competitive Interest Rates",
                   content: "Access market-leading interest rates starting from 11.5% per annum. Choose between fixed and floating rate options based on your business strategy and cash flow requirements.",
                   icon: <BsSpeedometer2 className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Flexible Loan Amount",
                   content: "Borrow from ₹5 lakh to ₹40 crore based on your business requirements and eligibility. Higher loan amounts available for established businesses with strong financial performance.",
                   icon: <IoDocumentTextOutline className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Extended Repayment Terms",
                   content: "Choose repayment tenure from 12-100 months with flexible EMI options. Customize your repayment schedule to match your business cash flow cycles and seasonal variations.",
                   icon: <IoMdContacts className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Collateral-Free Options",
                   content: "Unsecured business loans available for qualified businesses without collateral requirements. Simplified approval process based on business performance and creditworthiness.",
                   icon: <TbListDetails className="w-7 h-6 lg:w-6  lg:h-6" />,
               },
               {
                   heading: "Business Support Services",
                   content: "Benefit from our comprehensive business support including financial advisory, business planning assistance, and dedicated relationship management throughout your business journey.",
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
            "Here are the key requirements we evaluate for business loan approval."
        ],
        documents: [
            "Our streamlined documentation process makes your application experience smooth.",
            "Here's what you'll need to have ready for a hassle-free business loan process."
        ],
        apply:[
            "Follow our simple step-by-step application process designed for your convenience.",
            "From application to disbursement, we make your business loan straightforward and transparent."
        ],
        offer:[
            "Discover the comprehensive benefits and features of our business loan products.",
            "We're committed to providing value at every step of your business financing journey."
        ]
    };

    const images = {
        eligibility: "/businessloanimg/eligibility.webp",
        documents: "/commonloanimg/documentrequired.png",
        apply:"/businessloanimg/apply.png",
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
            <BusinessLoan type="eligibility" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
            <BusinessLoan type="documents" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
            <BusinessLoan type="apply" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
            <BusinessLoan type="offer" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
        </div>
    );
}
