import './App.css';
import { Routes, Route } from "react-router-dom";

import SignupPage from './Pages/authentication/SignupPage';
import LoginPage from './Pages/authentication/LoginPage';
import HeroSection from './Pages/homePage/homecomponents/HeroSection';
import FeaturesSection from './Pages/homePage/homecomponents/FeaturesSection';
import Layout from './components/layout/Layout';
import HomePage from './Pages/homePage/HomePage';
import HomeLoan from './Pages/loans/homeLoan/HomeLoan';
import VehicelLoan from './Pages/loans/vehicleLoan/VehicleLoan';
import PersonalLoan from './Pages/loans/personalLoan/PersonalLoan';
import BusinessLoan from './Pages/loans/businessLoan/BusinessLoan';
import PageFive from './Pages/Forms/vehicleforms/VehicleFive';
import HomeThree from './Pages/Forms/homeforms/HomeThree';
import HomeFour from './Pages/Forms/homeforms/HomeFour';
import VehicleThree from './Pages/Forms/vehicleforms/VehicleThree';
import VehicleFour from './Pages/Forms/vehicleforms/VehicleFour';
import { UserContextProvider } from './contextapi/UserContext';
import Profile from './Pages/authentication/Profile';
import HomeDashboard from './Pages/dashboard/homedashboard';
import { HomeOneContextProvider } from './contextapi/HomeOneContext';
import ClientApplication from './Pages/dashboard/ClientApplication';
import UserApplications from './Pages/dashboard/UserApplications';
import FormTwo from './Pages/Forms/FormTwo';
import FormOne from './Pages/Forms/FormOne';

function App() {
  return (
        <UserContextProvider>
          <HomeOneContextProvider>
      
      <Routes>
        <Route path='/' element={<Layout/>}>
        <Route index element={<HomePage/>}/>
        <Route path="/signup-Page" element={<SignupPage />} />
        <Route path="/Login-Page" element={<LoginPage/>} />
        <Route path="/" element={<HeroSection />} />
        <Route path="/" element={<FeaturesSection />} />
        <Route path='vehicle-loan' element={<VehicelLoan/>}/>
        <Route path='home-loan' element={<HomeLoan/>}/>
        <Route path='personal-loan' element={<PersonalLoan/>}/>
        <Route path='business-loan' element={<BusinessLoan/>}/>
        <Route path='/HomePage' element={<HomePage/>} />
        <Route path='/presonal-details-formFive' element={<PageFive/>}/>
        <Route path='/form-detail-one' element={<FormOne/>} />
        <Route path='/form-details-two' element={<FormTwo/>} />
        <Route path='/home-details-HomeThree' element={<HomeThree/>}/>
        <Route path='/home-details-HomeFour' element={<HomeFour/>}/>
        <Route path='/vehicle-details-VehicleThree' element={<VehicleThree/>} />
        <Route path='/vehicle-details-VehiclFour' element={<VehicleFour/>} />
        <Route path='/user-profile' element={<Profile/>}/>
        <Route path='/dashboard' element={<HomeDashboard/>}/>
        <Route path='/client-application' element={<ClientApplication/>}/>
        <Route path='/user-applications' element={<UserApplications/>}/>

        
        </Route>
      </Routes>
      </HomeOneContextProvider>
      </UserContextProvider>
   
  );
}

export default App;