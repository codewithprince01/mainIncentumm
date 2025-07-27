import React from "react";
import ClientTable from "./dashboardcomponents/ClientTable.jsx";
import AdminNavbar from "./dashboardcomponents/AdminNavbar.jsx";
import Footer from "../../components/layout/FooterSection.jsx";

export default function ClientApplication() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Client Applications</h1>
        <ClientTable />
      </div>
      <Footer />
    </div>
  );
}