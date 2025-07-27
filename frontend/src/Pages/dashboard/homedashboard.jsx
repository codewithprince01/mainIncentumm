import React from 'react'
import StatsCards from './dashboardcomponents/StatsCards.jsx';
import ChartSection from './dashboardcomponents/ChartSection.jsx';
import ClientTable from './dashboardcomponents/ClientTable.jsx';
import Footer from '../../components/layout/FooterSection.jsx';
import AdminNavbar from './dashboardcomponents/AdminNavbar.jsx';

export default function HomeDashboard() {
  return (
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
      <StatsCards />
      <ChartSection />
      <ClientTable />
      <Footer />
    </div>
  );
};
