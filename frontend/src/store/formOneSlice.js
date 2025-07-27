import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Save Personal Details
export const savePersonalDetails = createAsyncThunk(
  "form/savePersonalDetails",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Sending data to /form/personal-details:", data);
      const response = await axios.post(`${API_URL}/form/personal-details`, data);
      console.log("Response from savePersonalDetails:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error in savePersonalDetails:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Save Loan Application
export const saveLoanApplication = createAsyncThunk(
  "form/saveLoanApplication",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Sending data to /form/loan-application:", data);
      const response = await axios.post(`${API_URL}/form/loan-application`, data, {
        withCredentials: true,
      });
      console.log("Response from saveLoanApplication:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in saveLoanApplication:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Upload Loan Documents
export const uploadLoanDocuments = createAsyncThunk(
  "form/uploadLoanDocuments",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      console.log("Sending data to /form/loan-documents with userId:", formData.get("userId"));
      const response = await axios.post(`${API_URL}/form/loan-documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      console.log("Response from uploadLoanDocuments:", response.data);
      return response.data;
    } catch (error) {
      const errorDetails = error.response
        ? { status: error.response.status, data: error.response.data }
        : { message: error.message || "Network or client-side error" };
      console.error("Error in uploadLoanDocuments:", errorDetails);
      return rejectWithValue(errorDetails.data || { message: "Failed to upload documents" });
    }
  }
);

// Fetch All Forms
export const fetchAllForms = createAsyncThunk(
  "form/fetchAllForms",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching all forms from /forms");
      const response = await axios.get(`${API_URL}/form/`);
      console.log("Response from fetchAllForms:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in fetchAllForms:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to fetch forms");
    }
  }
);

// Fetch Form by ID
export const fetchFormById = createAsyncThunk(
  "form/fetchFormById",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`Fetching form from ${API_URL}/form/${id}`);
      const response = await axios.get(`${API_URL}/form/${id}`);
      console.log("Response from fetchFormById:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in fetchFormById:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to fetch form");
    }
  }
);

// Fetch Forms by User ID
export const fetchFormsByUserId = createAsyncThunk(
  "form/fetchFormsByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      console.log(`Fetching forms for user ID from ${API_URL}/form/user/${userId}`);
      const response = await axios.get(`${API_URL}/form/user/${userId}`, {
        withCredentials: true,
      });
      console.log("Response from fetchFormsByUserId:", response.data);
      return response.data.data; // Return the forms array
    } catch (error) {
      const errorDetails = error.response
        ? { status: error.response.status, data: error.response.data }
        : { message: error.message };
      console.error("Error in fetchFormsByUserId:", errorDetails);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch forms");
    }
  }
);

// Update Form
export const updateForm = createAsyncThunk(
  "form/updateForm",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log(`Sending update request to /forms/${id}:`, data);
      const response = await axios.put(`${API_URL}/form/${id}`, data);
      console.log("Response from updateForm:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in updateForm:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Failed to update form");
    }
  }
);

export const updateFormStatus = createAsyncThunk(
  "form/updateStatus",
  async ({ id, status, csrfToken }, { rejectWithValue }) => {
    try {
      const adminToken = document.cookie.split("adminToken=")[1]?.split(";")[0] || "";
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/form/${id}/status`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${adminToken}`,
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error in updateFormStatus:", error.response || error);
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Delete Form
export const deleteForm = createAsyncThunk(
  "form/deleteForm",
  async (id, { rejectWithValue }) => {
    try {
      console.log(`Sending DELETE request to ${API_URL}/form/${id}`);
      const response = await axios.delete(`${API_URL}/form/${id}`);
      console.log("Response from deleteForm:", response.data);
      return response.data;
    } catch (error) {
      const errorDetails = error.response
        ? { status: error.response.status, data: error.response.data }
        : { message: error.message, code: error.code };
      console.error("Error in deleteForm:", errorDetails);
      return rejectWithValue(errorDetails);
    }
  }
);

const formSlice = createSlice({
  name: "form",
  initialState: {
    userId: null,
    formData: null,
    forms: [],
    currentForm: null,
    loading: false,
    error: null,
    success: false,
    documents: null,
    total: 0,
  },
  reducers: {
    resetUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.formData = null;
      state.documents = null;
      state.currentForm = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePersonalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(savePersonalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.formData = action.payload.data;
        state.userId = action.payload.data?.user || state.userId;
      })
      .addCase(savePersonalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(saveLoanApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveLoanApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.formData = action.payload.data;
        state.userId = action.payload.data?.user || state.userId;
      })
      .addCase(saveLoanApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(uploadLoanDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(uploadLoanDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.documents = action.payload.data?.loanDocuments;
        state.formData = action.payload.data;
        state.userId = action.payload.data?.user || state.userId;
      })
      .addCase(uploadLoanDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(fetchAllForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.data;
        state.total = action.payload.total || action.payload.data.length;
      })
      .addCase(fetchAllForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.forms = [];
        state.total = 0;
      })
      .addCase(fetchFormById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentForm = action.payload.data;
      })
      .addCase(fetchFormById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentForm = null;
      })
      .addCase(fetchFormsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload;
        state.total = action.payload.length;
      })
      .addCase(fetchFormsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.forms = [];
        state.total = 0;
      })
      .addCase(updateForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.formData = action.payload.data;
        state.currentForm = action.payload.data;
        state.forms = state.forms.map((form) =>
          form._id === action.payload.data._id ? action.payload.data : form
        );
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateFormStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateFormStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.formData = action.payload.data;
        state.currentForm = action.payload.data;
        state.forms = state.forms.map((form) =>
          form._id === action.payload.data._id ? action.payload.data : form
        );
      })
      .addCase(updateFormStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(deleteForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = state.forms.filter((form) => form._id !== action.meta.arg);
        state.currentForm = null;
        state.total = state.forms.length;
      })
      .addCase(deleteForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUploadState } = formSlice.actions;
export default formSlice.reducer;