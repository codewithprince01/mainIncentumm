import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LoanApplicationRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const loanType = searchParams.get('loanType');
    
    // Map loan types to their specific routes
    const routeMap = {
      'Home Loan': '/home-loan-application',
      'Personal Loan': '/personal-loan-application', 
      'Vehicle Loan': '/vehicle-loan-application',
      'Business Loan': '/business-loan-application',
      'Mortgage Loan': '/mortgage-loan-application',
      'home': '/home-loan-application',
      'personal': '/personal-loan-application',
      'vehicle': '/vehicle-loan-application', 
      'business': '/business-loan-application',
      'mortgage': '/mortgage-loan-application'
    };
    
    const targetRoute = routeMap[loanType];
    
    if (targetRoute) {
      navigate(targetRoute, { replace: true });
    } else {
      // Redirect to home page if no valid loan type
      navigate('/', { replace: true });
    }
  }, [navigate, searchParams]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to loan application...</p>
      </div>
    </div>
  );
};

export default LoanApplicationRedirect; 