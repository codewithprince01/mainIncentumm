import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllForms } from "../../../store/formOneSlice";

const ClientApplication = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const dispatch = useDispatch();
  const { forms, loading, error, total } = useSelector((state) => state.form);

  useEffect(() => {
    dispatch(fetchAllForms());
  }, [dispatch]);

  // Normalize forms to an array
  const data = Array.isArray(forms) ? forms : [];
  console.log("Fetched forms:", data); // Debug log

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;

  return (
    <div className="p-6 bg-gray-100 font-sans text-sm">
      {/* Header */}
      <div className="flex justify-start items-center mb-2 gap-2">
        <img
          src="https://placehold.co/35x35"
          alt="profile"
          className="w-8 h-8 rounded-full"
          onError={(e) => {
            e.target.src = "https://placehold.co/35x35?text=User";
          }}
        />
        <Link to="/client-application" className="text-lg font-semibold">
          Clients Application
        </Link>
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-start gap-4 mb-4">
        <select className="border border-gray-300 p-2 rounded w-60">
          <option>Application Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="In Progress">In Progress</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input type="date" className="border border-gray-300 p-2 rounded w-60" />
        <select className="border border-gray-300 p-2 rounded w-60">
          <option>Pin Code</option>
          {data.map((loan) => {
            const primaryDetail = loan.personalDetails?.[0] || {};
            return primaryDetail.permanent_pincode ? (
              <option key={loan._id} value={primaryDetail.permanent_pincode}>
                {primaryDetail.permanent_pincode}
              </option>
            ) : null;
          })}
        </select>
        <select className="border border-gray-300 p-2 rounded w-60">
          <option>Select</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto border border-gray-300">
        <table className="w-full text-center">
          <thead className="bg-gray-200">
            <tr className="text-gray-700">
              <th className="p-3 border">Profile</th>
              <th className="p-3 border">Full Name</th>
              <th className="p-3 border">Email ID</th>
              <th className="p-3 border">Contact Number</th>
              <th className="p-3 border">Pincode</th>
              <th className="p-3 border">Application No</th>
              <th className="p-3 border">Loan Type</th>
              <th className="p-3 border">Loan Amount</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="10" className="p-3">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="10" className="p-3 text-red-500">
                  {typeof error === "string" ? error : error.message || "Failed to fetch data"}
                </td>
              </tr>
            )}
            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan="10" className="p-3">
                  No applications found
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              currentRows.length > 0 &&
              currentRows.map((loan, index) => {
                const primaryDetail = loan.personalDetails?.[0] || {}; // Take only the first applicant
                return (
                  <tr
                    key={loan._id}
                    className={`${index % 2 !== 0 ? "bg-blue-50" : "bg-white"} hover:bg-gray-100`}
                  >
                    <td className="p-3 border">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                        👤
                      </div>
                    </td>
                    <td className="p-3 border">{primaryDetail.full_name || "N/A"}</td>
                    <td className="p-3 border">{primaryDetail.email_id || "N/A"}</td>
                    <td className="p-3 border">{primaryDetail.mobile_number || "N/A"}</td>
                    <td className="p-3 border">{primaryDetail.permanent_pincode || "N/A"}</td>
                    <td className="p-3 border">{loan._id || "N/A"}</td>
                    <td className="p-3 border">{loan.loanApplication?.loanType || "N/A"}</td>
                    <td className="p-3 border">
                      {loan.loanApplication?.loan_amount_required
                        ? `₹${loan.loanApplication.loan_amount_required.toLocaleString()}`
                        : "N/A"}
                    </td>
                    <td className="p-3 border">{loan.status || "N/A"}</td>
                    <td className="p-3 flex justify-center items-center gap-4">
                      <Link
                        to={`/user-applications/${loan._id}`}
                        className="text-blue-600 hover:text-blue-400 flex items-center gap-1"
                      >
                        VIEW ✏️
                      </Link>
                      <button className="text-red-600 hover:text-red-800 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, data.length)} of{" "}
          {data.length} entries
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            key={1}
            onClick={() => setCurrentPage(1)}
            className={`border px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === 1
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            1
          </button>
          {currentPage > 3 && (
            <span className="px-3 py-1 text-gray-700">...</span>
          )}
          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            if (
              pageNumber > 1 &&
              pageNumber < totalPages &&
              Math.abs(pageNumber - currentPage) <= 2
            ) {
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`border px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === pageNumber
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
            return null;
          })}
          {currentPage < totalPages - 2 && (
            <span className="px-3 py-1 text-gray-700">...</span>
          )}
          {totalPages > 1 && (
            <button
              key={totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className={`border px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === totalPages
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {totalPages}
            </button>
          )}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientApplication;