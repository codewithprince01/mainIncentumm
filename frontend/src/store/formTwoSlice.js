import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



const API_URL = import.meta.env.VITE_API_URL;

export const createFormTwo = createAsyncThunk(
    "form/createFormTwo",
    async(data,{rejectWithValue})=>{
        try {
            console.log("Sending data:", data);
            const response = await axios.post(`${API_URL}/form/form-two`, data);
            console.log("Response:", response.data);
            return response.data;
        } catch (error) {
            console.log("Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Something went wrong"); 
        }
    }
)

export const fetchFormTwo = createAsyncThunk(
    'form/fetchFormTwo',
    async(_,{rejectWithValue})=>{
        try {
            const response = await axios.get(`${API_URL}/form/form-two`);
            return response.data;
        } catch (error) {
            console.log("error fetch form two data", error);
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)

export const fetchFormTwoById = createAsyncThunk(
    'form/fetchFormTwoById',
    async(id,{rejectWithValue})=>{
        try {
            const response = await axios.get(`${API_URL}/form/form-two/${id}`);
            console.log("API Response:", response.data);
            return response.data;
        } catch (error) {
            console.log("Error fetching data:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
)




const formTwoSlice = createSlice({
    name: "formTwo",
    initialState:{
        formData:null,
        forms:[],
        loading:false,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        // create form two
        .addCase(createFormTwo.pending,(state,action)=>{
            state.loading = true;
        })
        .addCase(createFormTwo.fulfilled,(state,action)=>{
            state.loading = false;
            state.formData = action.payload;
        })
        .addCase(createFormTwo.rejected,(state,action)=>{
          state.loading = false;
          state.error = action.payload;
        })

         // Fetch All Forms
         .addCase(fetchFormTwo.pending,(state,action)=>{
            state.loading=true;
            state.error = null;
         })
         .addCase(fetchFormTwo.fulfilled,(state,action)=>{
            state.loading = false;
            state.formData = action.payload;
         })
         .addCase(fetchFormTwo.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
         })

          // Fetch Form Two By ID
          .addCase(fetchFormTwoById.pending,(state,action)=>{
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchFormTwoById.fulfilled,(  state,action)=>{
              state.loading = false;
              state.formData = action.payload;
          })
          .addCase(fetchFormTwoById.rejected,(state,action)=>{
              state.loading = false;
              state.error = action.payload;
          })
    }
})

export default formTwoSlice.reducer;