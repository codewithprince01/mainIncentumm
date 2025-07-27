import { Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./contextapi/UserContext";
import SignupPage from "./Pages/authentication/SignupPage";
import LoginPage from "./Pages/authentication/LoginPage";
import AdminLoginPage from "./Pages/authentication/AdminLoginPage";
import HomePage from "./Pages/homePage/HomePage";
import HomeLoan from "./Pages/loans/homeLoan/HomeLoan";
import VehicleLoan from "./Pages/loans/vehicleLoan/VehicleLoan";
import PersonalLoan from "./Pages/loans/personalLoan/PersonalLoan";
import BusinessLoan from "./Pages/loans/businessLoan/BusinessLoan";
import MortgageLoan from "./Pages/loans/mortgageLoan/MortgageLoan";
import Profile from "./Pages/authentication/Profile";
import UserProfile from "./Pages/UserProfile";
import UserDashboard from "./Pages/dashboard/UserDashboard";
import HomeDashboard from "./Pages/dashboard/homedashboard";
import ClientApplication from "./Pages/dashboard/ClientApplication";
import UserApplications from "./Pages/dashboard/UserApplications";
import FormThree from "./Pages/Forms/FormThree";
import AboutUs from "./Pages/Others/AboutUs";
import ContactUs from "./Pages/Others/ContactUs";
import EmiCalculator from "./Pages/homePage/homecomponents/EmiCalculator";
import Disclaimer from "./Pages/Others/Disclaimer";
import PrivacyPolicy from "./Pages/Others/PrivacyPolicy";
import Terms from "./Pages/Others/Terms";
import Thankyou from "./Pages/Forms/Thankyou";

import HomeLoanForm from "./Pages/Forms/HomeLoanForm";
import PersonalLoanForm from "./Pages/Forms/PersonalLoanForm";
import VehicleLoanForm from "./Pages/Forms/VehicleLoanForm";
import BusinessLoanForm from "./Pages/Forms/BusinessLoanForm";
import MortgageLoanForm from "./Pages/Forms/MortgageLoanForm";
import CoApplicantForm from "./Pages/Forms/CoApplicantForm";
import ApplicationSummary from "./Pages/Forms/ApplicationSummary";
import LoanApplicationRedirect from "./Pages/Forms/LoanApplicationRedirect";
import Layout from "./components/layout/Layout";
import ProtectedAdminRoute from "./Pages/authentication/ProtectedAdminRoute";
import ProtectedUserRoute from "./Pages/authentication/ProtectedUserRoute";

import AdminLogin from "./Pages/admin/AdminLogin";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import ProtectedAdminRouteNew from "./Pages/admin/ProtectedAdminRoute";
import ApplicationViewPage from "./Pages/admin/ApplicationViewPage";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE_SECRET ;

  return (
    <UserContextProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/signup-page" element={<SignupPage />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/vehicle-loan" element={<VehicleLoan />} />
          <Route path="/home-loan" element={<HomeLoan />} />
          <Route path="/personal-loan" element={<PersonalLoan />} />
          <Route path="/business-loan" element={<BusinessLoan />} />
          <Route path="/mortgage-loan" element={<MortgageLoan />} />
          <Route path="/form-details-three" element={<FormThree />} />
          <Route path="/user-profile" element={
            <ProtectedUserRoute>
              <UserProfile />
            </ProtectedUserRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedUserRoute>
              <UserDashboard />
            </ProtectedUserRoute>
          } />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />

          <Route path="/loan-application" element={
            <ProtectedUserRoute>
              <LoanApplicationRedirect />
            </ProtectedUserRoute>
          } />
          <Route path="/home-loan-application" element={
            <ProtectedUserRoute>
              <HomeLoanForm />
            </ProtectedUserRoute>
          } />
          <Route path="/personal-loan-application" element={
            <ProtectedUserRoute>
              <PersonalLoanForm />
            </ProtectedUserRoute>
          } />
          <Route path="/vehicle-loan-application" element={
            <ProtectedUserRoute>
              <VehicleLoanForm />
            </ProtectedUserRoute>
          } />
          <Route path="/business-loan-application" element={
            <ProtectedUserRoute>
              <BusinessLoanForm />
            </ProtectedUserRoute>
          } />
          <Route path="/mortgage-loan-application" element={
            <ProtectedUserRoute>
              <MortgageLoanForm />
            </ProtectedUserRoute>
          } />
          <Route path="/add-co-applicant" element={
            <ProtectedUserRoute>
              <CoApplicantForm />
            </ProtectedUserRoute>
          } />
          <Route path="/application-summary" element={<ApplicationSummary />} />
          <Route path="/emi-calculator" element={<EmiCalculator />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/application-submitted-successfully" element={<Thankyou />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRouteNew>
            <AdminDashboard />
          </ProtectedAdminRouteNew>
        } />
        <Route path="/admin/application/:applicationId" element={<ApplicationViewPage />} />
        
        {/* Legacy Admin Routes */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route
          path={ADMIN_ROUTE}
          element={
            <ProtectedAdminRoute>
              <HomeDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/client-application"
          element={
            <ProtectedAdminRoute>
              <ClientApplication />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/user-applications/:id"
          element={
            <ProtectedAdminRoute>
              <UserApplications />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </UserContextProvider>
  );
}

export default App;