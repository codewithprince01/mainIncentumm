import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import "chart.js/auto";

const formatIndianCurrency = (number) => {
  return new Intl.NumberFormat("en-IN").format(number);
};

export default function EmiCalculator() {
  const [principle, setPrinciple] = useState(2500000);
  const [interest, setInterest] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // States to track invalid inputs
  const [isPrincipleInvalid, setIsPrincipleInvalid] = useState(false);
  const [isInterestInvalid, setIsInterestInvalid] = useState(false);
  const [isTenureInvalid, setIsTenureInvalid] = useState(false);

  // Maximum values
  const MAX_LOAN_AMOUNT = 50000000; // 5 crore
  const MAX_INTEREST = 18; // 18%
  const MAX_TENURE = 30; // 30 years

  useEffect(() => {
    calculateEMI();
  }, [principle, interest, tenure]);

  const calculateEMI = () => {
    if (!principle || !interest || !tenure) return;
    
    const monthlyRate = interest / 12 / 100;
    const numPayments = tenure * 12;
    const emiValue =
      (principle * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    const totalPayment = emiValue * numPayments;
    const totalInterestValue = totalPayment - principle;

    setEmi(Math.round(emiValue));
    setTotalInterest(Math.round(totalInterestValue));
    setTotalAmount(Math.round(totalPayment));
  };

  const handlePrincipleChange = (e) => {
    const value = e.target.value;
    if (value === "" || !isNaN(value)) {
      const parsedValue = value === "" ? "" : parseInt(value);
      if (parsedValue === "" || parsedValue <= MAX_LOAN_AMOUNT) {
        setPrinciple(parsedValue);
        setIsPrincipleInvalid(false);
      } else {
        setIsPrincipleInvalid(true);
      }
    }
  };

  const handleInterestChange = (e) => {
    const value = e.target.value;
    if (value === "" || !isNaN(value)) {
      const parsedValue = value === "" ? "" : parseFloat(value);
      if (parsedValue === "" || parsedValue <= MAX_INTEREST) {
        setInterest(parsedValue);
        setIsInterestInvalid(false);
      } else {
        setIsInterestInvalid(true);
      }
    }
  };

  const handleTenureChange = (e) => {
    const value = e.target.value;
    if (value === "" || !isNaN(value)) {
      const parsedValue = value === "" ? "" : parseInt(value);
      if (parsedValue === "" || parsedValue <= MAX_TENURE) {
        setTenure(parsedValue);
        setIsTenureInvalid(false);
      } else {
        setIsTenureInvalid(true);
      }
    }
  };

  const chartData = {
    labels: ["Principal Amount", "Interest Amount"],
    datasets: [
      {
        data: [principle || 0, totalInterest],
        backgroundColor: [
          "#1e40af", // Professional blue for principal
          "#64748b"  // Subtle gray for interest
        ],
        hoverBackgroundColor: [
          "#2563eb", // Lighter blue on hover
          "#94a3b8"  // Lighter gray on hover
        ],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = '₹' + formatIndianCurrency(context.parsed);
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const slideInRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4">
        <motion.div 
          {...fadeInUp}
          className="text-center mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4">
            EMI Calculator
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Calculate your Equated Monthly Installment (EMI) with our professional calculator. 
            Plan your finances with precision and confidence.
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Controls */}
            <motion.div {...slideInLeft} className="lg:col-span-2 space-y-6">
              
              {/* Loan Amount */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-lg font-semibold text-slate-800">
                    Loan Amount
                  </label>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{principle ? formatIndianCurrency(principle) : "0"}
                  </span>
                </div>
                
                <input
                  type="number"
                  value={principle}
                  onChange={handlePrincipleChange}
                  placeholder="Enter loan amount"
                  className={`w-full p-4 text-lg border-2 rounded-xl bg-slate-50 text-slate-800 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isPrincipleInvalid 
                      ? "border-red-400 bg-red-50" 
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                  }`}
                  max={MAX_LOAN_AMOUNT}
                />
                
                {isPrincipleInvalid && (
                  <p className="text-red-600 text-sm mt-2 font-medium">
                    Maximum loan amount is ₹5 crore
                  </p>
                )}
                
                <div className="mt-6">
                  <input
                    type="range"
                    min="100000"
                    max={MAX_LOAN_AMOUNT}
                    step="50000"
                    value={principle || 0}
                    onChange={handlePrincipleChange}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-blue"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-2">
                    <span>₹1L</span>
                    <span>₹5Cr</span>
                  </div>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-lg font-semibold text-slate-800">
                    Interest Rate (Per Annum)
                  </label>
                  <span className="text-2xl font-bold text-blue-600">
                    {interest || "0"}%
                  </span>
                </div>
                
                <input
                  type="number"
                  value={interest}
                  onChange={handleInterestChange}
                  placeholder="Enter interest rate"
                  step="0.1"
                  className={`w-full p-4 text-lg border-2 rounded-xl bg-slate-50 text-slate-800 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isInterestInvalid 
                      ? "border-red-400 bg-red-50" 
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                  }`}
                  max={MAX_INTEREST}
                />
                
                {isInterestInvalid && (
                  <p className="text-red-600 text-sm mt-2 font-medium">
                    Maximum interest rate is 18%
                  </p>
                )}
                
                <div className="mt-6">
                  <input
                    type="range"
                    min="6"
                    max={MAX_INTEREST}
                    step="0.1"
                    value={interest || 0}
                    onChange={handleInterestChange}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-blue"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-2">
                    <span>6%</span>
                    <span>18%</span>
                  </div>
                </div>
              </div>

              {/* Loan Tenure */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <label className="text-lg font-semibold text-slate-800">
                    Loan Tenure
                  </label>
                  <span className="text-2xl font-bold text-blue-600">
                    {tenure || "0"} Years
                  </span>
                </div>
                
                <input
                  type="number"
                  value={tenure}
                  onChange={handleTenureChange}
                  placeholder="Enter tenure in years"
                  className={`w-full p-4 text-lg border-2 rounded-xl bg-slate-50 text-slate-800 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isTenureInvalid 
                      ? "border-red-400 bg-red-50" 
                      : "border-slate-200 hover:border-slate-300 focus:border-blue-500"
                  }`}
                  max={MAX_TENURE}
                />
                
                {isTenureInvalid && (
                  <p className="text-red-600 text-sm mt-2 font-medium">
                    Maximum tenure is 30 years
                  </p>
                )}
                
                <div className="mt-6">
                  <input
                    type="range"
                    min="1"
                    max={MAX_TENURE}
                    step="1"
                    value={tenure || 0}
                    onChange={handleTenureChange}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-blue"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-2">
                    <span>1 Year</span>
                    <span>30 Years</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results Section */}
            <motion.div {...slideInRight} className="space-y-6">
              
              {/* EMI Result Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Monthly EMI
                </h2>
                <div className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold mb-2">
                    ₹{formatIndianCurrency(emi)}
                  </div>
                  <p className="text-blue-100 text-sm">
                    Equated Monthly Installment
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                  Loan Breakdown
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Principal Amount</span>
                    <span className="text-slate-800 font-bold">
                      ₹{principle ? formatIndianCurrency(principle) : "0"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Total Interest</span>
                    <span className="text-slate-800 font-bold">
                      ₹{formatIndianCurrency(totalInterest)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 bg-slate-50 rounded-lg px-4">
                    <span className="text-slate-700 font-semibold">Total Amount</span>
                    <span className="text-blue-600 font-bold text-lg">
                      ₹{formatIndianCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                  Payment Distribution
                </h3>
                
                <div className="relative h-64">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm text-slate-500 font-medium">Total</div>
                      <div className="text-lg font-bold text-slate-800">
                        ₹{formatIndianCurrency(totalAmount)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex justify-center gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-sm text-slate-600">Principal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-slate-500 rounded"></div>
                    <span className="text-sm text-slate-600">Interest</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}