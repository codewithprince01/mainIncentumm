import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaClock, FaCalculator, FaChartLine } from 'react-icons/fa';

const ModernLoanDetails = ({ formData, onInputChange }) => {
  const [loanAmount, setLoanAmount] = useState(formData.loanAmount || 100000);
  const [loanTenure, setLoanTenure] = useState(formData.loanTenure || 12);
  const [emiAmount, setEmiAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [interestAmount, setInterestAmount] = useState(0);

  // Interest rate based on loan type (simplified calculation)
  const getInterestRate = (loanType) => {
    switch (loanType) {
      case 'home': return 8.5;
      case 'personal': return 12.0;
      case 'vehicle': return 9.5;
      case 'business': return 11.0;
      default: return 10.0;
    }
  };

  // Calculate EMI and other values
  useEffect(() => {
    const principal = parseFloat(loanAmount) || 0;
    const tenure = parseInt(loanTenure) || 1;
    const rate = getInterestRate(formData.loanType) / 100 / 12; // Monthly interest rate

    if (principal > 0 && tenure > 0) {
      // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
      const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
      const total = emi * tenure;
      const interest = total - principal;

      setEmiAmount(Math.round(emi));
      setTotalAmount(Math.round(total));
      setInterestAmount(Math.round(interest));
    }
  }, [loanAmount, loanTenure, formData.loanType]);

  // Update parent component when values change
  useEffect(() => {
    onInputChange('loanAmount', loanAmount);
    onInputChange('loanTenure', loanTenure);
  }, [loanAmount, loanTenure, onInputChange]);

  const handleAmountChange = (value) => {
    setLoanAmount(value);
  };

  const handleTenureChange = (value) => {
    setLoanTenure(value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatAmountShort = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  // Loan amount ranges based on loan type
  const getAmountRange = () => {
    switch (formData.loanType) {
      case 'home':
        return { min: 500000, max: 50000000, step: 100000 };
      case 'personal':
        return { min: 25000, max: 2000000, step: 25000 };
      case 'vehicle':
        return { min: 100000, max: 5000000, step: 50000 };
      case 'business':
        return { min: 100000, max: 10000000, step: 100000 };
      default:
        return { min: 50000, max: 5000000, step: 50000 };
    }
  };

  // Tenure ranges based on loan type
  const getTenureRange = () => {
    switch (formData.loanType) {
      case 'home':
        return { min: 12, max: 360, step: 12 }; // 1-30 years
      case 'personal':
        return { min: 6, max: 84, step: 6 }; // 6 months to 7 years
      case 'vehicle':
        return { min: 12, max: 84, step: 6 }; // 1-7 years
      case 'business':
        return { min: 12, max: 120, step: 6 }; // 1-10 years
      default:
        return { min: 6, max: 84, step: 6 };
    }
  };

  const amountRange = getAmountRange();
  const tenureRange = getTenureRange();

  // Calculate percentage for slider position
  const amountPercentage = ((loanAmount - amountRange.min) / (amountRange.max - amountRange.min)) * 100;
  const tenurePercentage = ((loanTenure - tenureRange.min) / (tenureRange.max - tenureRange.min)) * 100;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Loan Details</h3>
        <p className="text-gray-300">Drag the sliders below to set your loan amount and tenure, or enter values manually</p>
      </div>

      {/* Loan Amount Slider */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-600">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
            <FaMoneyBillWave className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white">Loan Amount</h4>
            <p className="text-gray-400">Select your desired loan amount</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Amount Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2 font-mono">
              {formatCurrency(loanAmount)}
            </div>
            <div className="text-lg text-gray-300">
              {formatAmountShort(loanAmount)}
            </div>
          </div>

          {/* Custom Slider */}
          <div className="relative">
            <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
              {/* Progress bar */}
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${amountPercentage}%` }}
              />
              
              {/* Slider thumb */}
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-4 border-green-500 transition-all duration-300 ease-out hover:scale-110 cursor-pointer"
                style={{ left: `${amountPercentage}%` }}
              />
            </div>
            
            {/* Hidden input for functionality */}
            <input
              type="range"
              min={amountRange.min}
              max={amountRange.max}
              step={amountRange.step}
              value={loanAmount}
              onChange={(e) => handleAmountChange(parseInt(e.target.value))}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Amount range labels */}
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatAmountShort(amountRange.min)}</span>
            <span>{formatAmountShort(amountRange.max)}</span>
          </div>

          {/* Manual Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Drag the slider or enter amount manually</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => handleAmountChange(parseInt(e.target.value) || amountRange.min)}
              min={amountRange.min}
              max={amountRange.max}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter loan amount"
            />
          </div>

          {/* Quick amount buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(() => {
              const getQuickAmounts = () => {
                switch (formData.loanType) {
                  case 'home':
                    return [500000, 1500000, 2500000, 5000000]; // 5L, 15L, 25L, 50L
                  case 'personal':
                    return [50000, 200000, 500000, 1000000]; // 50K, 2L, 5L, 10L
                  case 'vehicle':
                    return [200000, 500000, 1000000, 2000000]; // 2L, 5L, 10L, 20L
                  case 'business':
                    return [500000, 2000000, 5000000, 10000000]; // 5L, 20L, 50L, 1Cr
                  default:
                    return [100000, 500000, 1000000, 2000000]; // 1L, 5L, 10L, 20L
                }
              };
              return getQuickAmounts();
            })().map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountChange(amount)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  loanAmount === amount
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {formatAmountShort(amount)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loan Tenure Slider */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-600">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
            <FaClock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white">Loan Tenure</h4>
            <p className="text-gray-400">Choose your repayment period</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tenure Display */}
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2 font-mono">
              {Math.floor(loanTenure / 12)} Years {loanTenure % 12} Months
            </div>
            <div className="text-lg text-gray-300">
              {loanTenure} Months Total
            </div>
          </div>

          {/* Custom Slider */}
          <div className="relative">
            <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
              {/* Progress bar */}
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${tenurePercentage}%` }}
              />
              
              {/* Slider thumb */}
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-4 border-blue-500 transition-all duration-300 ease-out hover:scale-110 cursor-pointer"
                style={{ left: `${tenurePercentage}%` }}
              />
            </div>
            
            {/* Hidden input for functionality */}
            <input
              type="range"
              min={tenureRange.min}
              max={tenureRange.max}
              step={tenureRange.step}
              value={loanTenure}
              onChange={(e) => handleTenureChange(parseInt(e.target.value))}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Tenure range labels */}
          <div className="flex justify-between text-sm text-gray-400">
            <span>{Math.floor(tenureRange.min / 12)}Y {tenureRange.min % 12}M</span>
            <span>{Math.floor(tenureRange.max / 12)}Y {tenureRange.max % 12}M</span>
          </div>

          {/* Manual Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">Or enter tenure manually (months)</label>
            <input
              type="number"
              value={loanTenure}
              onChange={(e) => handleTenureChange(parseInt(e.target.value) || tenureRange.min)}
              min={tenureRange.min}
              max={tenureRange.max}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tenure in months"
            />
          </div>

          {/* Quick tenure buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(() => {
              const getQuickTenures = () => {
                switch (formData.loanType) {
                  case 'home':
                    return [60, 120, 180, 240]; // 5Y, 10Y, 15Y, 20Y
                  case 'personal':
                    return [12, 24, 36, 60]; // 1Y, 2Y, 3Y, 5Y
                  case 'vehicle':
                    return [12, 24, 36, 60]; // 1Y, 2Y, 3Y, 5Y
                  case 'business':
                    return [12, 36, 60, 84]; // 1Y, 3Y, 5Y, 7Y
                  default:
                    return [12, 24, 36, 60]; // 1Y, 2Y, 3Y, 5Y
                }
              };
              return getQuickTenures();
            })().map((tenure) => (
              <button
                key={tenure}
                onClick={() => handleTenureChange(tenure)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  loanTenure === tenure
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {Math.floor(tenure / 12)}Y {tenure % 12}M
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EMI Calculator Results */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
            <FaCalculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white">EMI Calculation (Estimated)</h4>
            <p className="text-gray-300">Based on current interest rates - actual rates may vary</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-300 mb-2">
              {formatCurrency(emiAmount)}
            </div>
            <div className="text-gray-400 text-sm">Monthly EMI (Est.)</div>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-pink-300 mb-2">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-gray-400 text-sm">Total Amount</div>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-xl backdrop-blur-sm">
            <div className="text-2xl font-bold text-orange-300 mb-2">
              {formatCurrency(interestAmount)}
            </div>
            <div className="text-gray-400 text-sm">Total Interest</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <FaChartLine className="w-4 h-4" />
            <span>Interest Rate: {getInterestRate(formData.loanType)}% per annum</span>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ModernLoanDetails; 