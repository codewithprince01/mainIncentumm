import { useState, useEffect } from "react";
import PropTypes from "prop-types";
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

function HomeAccorrdion({ type, openAccordion, handleAccordionClick }) {
    const sections = {
        eligibility: [
            {
                heading: "Credit Score Requirements",
                content: "A credit score of 700+ significantly improves your approval chances and helps secure better interest rates. Our team works with applicants across all credit ranges, offering personalized solutions and guidance to strengthen your application.",
                icon: <BsSpeedometer2 className="w-6 h-6 text-yellow-400" />,
                color: "from-yellow-500 to-yellow-600"
            },
            {
                heading: "Income Verification",
                content: "Salaried professionals need 2+ years of consistent employment history, while self-employed individuals require 3+ years of stable business operations. We evaluate your complete financial profile for optimal loan structuring.",
                icon: <IoDocumentTextOutline className="w-6 h-6 text-green-400" />,
                color: "from-green-500 to-green-600"
            },
            {
                heading: "Age and Tenure Guidelines",
                content: "Applicants must be between 21-60 years at loan maturity (65 for self-employed). We offer flexible repayment terms up to 30 years, with some lenders providing extended options based on your profile.",
                icon: <IoMdContacts className="w-6 h-6 text-blue-400" />,
                color: "from-blue-500 to-blue-600"
            },
            {
                heading: "Financial Assessment",
                content: "Our comprehensive analysis includes Fixed Obligations to Income Ratio (FOIR), existing commitments, and future financial goals to ensure comfortable repayment throughout your loan tenure.",
                icon: <TbListDetails className="w-6 h-6 text-purple-400" />,
                color: "from-purple-500 to-purple-600"
            },
        ],
        documents: [
            {
                heading: "Identity and Address Proof",
                content: "Valid government-issued photo identification (Aadhaar, PAN, Passport, Voter ID) and current address verification documents. We accept utility bills, bank statements, or rental agreements dated within the last 3 months.",
                icon: <IoMdContacts className="w-6 h-6 text-cyan-400" />,
                color: "from-cyan-500 to-cyan-600"
            },
            {
                heading: "Income Documentation",
                content: "Recent salary slips (3 months), Form 16, and bank statements (6 months) for salaried employees. Self-employed applicants need ITR (2 years), financial statements, and comprehensive bank records (12 months).",
                icon: <IoDocumentTextOutline className="w-6 h-6 text-emerald-400" />,
                color: "from-emerald-500 to-emerald-600"
            },
            {
                heading: "Property Papers",
                content: "Complete property documentation including sale deed, approved building plans, NOC from builder, property tax receipts, and legal clearance certificates. Our legal team ensures thorough verification.",
                icon: <TbListDetails className="w-6 h-6 text-orange-400" />,
                color: "from-orange-500 to-orange-600"
            },
            {
                heading: "Additional Requirements",
                content: "Recent passport-size photographs, processing fee payment confirmation, and any lender-specific documentation. Our relationship managers provide complete guidance throughout the process.",
                icon: <MdOutlineDataExploration className="w-6 h-6 text-pink-400" />,
                color: "from-pink-500 to-pink-600"
            },
        ],
        apply: [
            {
                heading: "Online Application",
                content: "Complete our streamlined digital application in under 10 minutes. Our user-friendly platform guides you through each step with real-time validation and helpful prompts for accurate information submission.",
                icon: <IoDocumentTextOutline className="w-6 h-6 text-indigo-400" />,
                color: "from-indigo-500 to-indigo-600"
            },
            {
                heading: "Quick Pre-Assessment",
                content: "Receive preliminary approval status within 30 minutes through our efficient evaluation system. Get indicative loan amount, interest rate options, and tenure recommendations tailored to your profile.",
                icon: <BsSpeedometer2 className="w-6 h-6 text-teal-400" />,
                color: "from-teal-500 to-teal-600"
            },
            {
                heading: "Document Processing",
                content: "Our dedicated team assists with document collection and verification. Advanced digital processing ensures accuracy and faster turnaround times for your loan application.",
                icon: <TbListDetails className="w-6 h-6 text-amber-400" />,
                color: "from-amber-500 to-amber-600"
            },
            {
                heading: "Approval and Disbursement",
                content: "Final loan approval typically completed within 24-48 hours. Funds are disbursed directly to the seller/builder with complete transparency. Track your application status through our portal.",
                icon: <MdOutlineDataExploration className="w-6 h-6 text-lime-400" />,
                color: "from-lime-500 to-lime-600"
            },
        ],
        offer: [
            {
                heading: "Competitive Interest Rates",
                content: "Access market-leading interest rates starting from 8.35% per annum. Choose between fixed and floating rate options based on your financial strategy and risk preferences.",
                icon: <BsSpeedometer2 className="w-6 h-6 text-rose-400" />,
                color: "from-rose-500 to-rose-600"
            },
            {
                heading: "Flexible Loan Amount",
                content: "Borrow up to 90% of property value for ready-to-move properties and 80% for under-construction projects. Higher loan amounts available for premium properties and qualified applicants.",
                icon: <IoDocumentTextOutline className="w-6 h-6 text-violet-400" />,
                color: "from-violet-500 to-violet-600"
            },
            {
                heading: "Extended Repayment Terms",
                content: "Choose repayment tenure up to 30 years with the flexibility to prepay without penalties. Customize your EMI structure to match your financial planning and cash flow requirements.",
                icon: <IoMdContacts className="w-6 h-6 text-sky-400" />,
                color: "from-sky-500 to-sky-600"
            },
            {
                heading: "Value-Added Services",
                content: "Benefit from our comprehensive service package including property valuation, legal assistance, insurance guidance, and dedicated relationship management throughout your loan journey.",
                icon: <TbListDetails className="w-6 h-6 text-fuchsia-400" />,
                color: "from-fuchsia-500 to-fuchsia-600"
            },
            {
                heading: "Tax Benefits",
                content: "Maximize your tax savings with deductions up to ₹1.5 lakh under Section 80C for principal repayment and ₹2 lakh under Section 24(b) for interest payments.",
                icon: <MdOutlineDataExploration className="w-6 h-6 text-emerald-400" />,
                color: "from-emerald-500 to-emerald-600"
            },
            {
                heading: "Quick Processing",
                content: "Experience industry-leading processing times with most applications approved within 24-48 hours. Our digital-first approach ensures minimal delays in your home buying journey.",
                icon: <MdOutlineDataExploration className="w-6 h-6 text-orange-400" />,
                color: "from-orange-500 to-orange-600"
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
            "Here are the key requirements we evaluate for loan approval."
        ],
        documents: [
            "Our streamlined documentation process makes your application experience smooth.",
            "Here's what you'll need to have ready for a hassle-free process."
        ],
        apply: [
            "Follow our simple step-by-step application process designed for your convenience.",
            "From application to disbursement, we make it straightforward and transparent."
        ],
        offer: [
            "Discover the comprehensive benefits and features of our home loan products.",
            "We're committed to providing value at every step of your home financing journey."
        ]
    };

    const images = {
        eligibility: "/homeloanimg/eligibility.png",
        documents: "/commonloanimg/documentrequired.png",
        apply: "/homeloanimg/apply.png",
        offer: "/commonloanimg/offer.png"
    };

    useEffect(() => {
        AOS.init({
            duration: 800, 
            once: true, 
        });
    }, []);

    return (
        <div className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden" data-accordion-type={type}>
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
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl lg:text-5xl font-bold text-white drop-shadow-lg"
                            >
                    {titles[type]}
                            </motion.h2>
                            
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

HomeAccorrdion.propTypes = {
    type: PropTypes.string.isRequired,
    openAccordion: PropTypes.string,
    handleAccordionClick: PropTypes.func.isRequired,
};

export default function App() { 
    const [openAccordion, setOpenAccordion] = useState(null);

    const handleAccordionClick = (key) => {
        setOpenAccordion(openAccordion === key ? null : key);
    };

    return (
        <div className="space-y-0">
            <HomeAccorrdion type="eligibility" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
            <HomeAccorrdion type="documents" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
            <HomeAccorrdion type="apply" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
            <HomeAccorrdion type="offer" openAccordion={openAccordion} handleAccordionClick={handleAccordionClick} />
        </div>
    );
}
