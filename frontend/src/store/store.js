import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formOneSlice';


export const store = configureStore({
  reducer: {
    form: formReducer,  
  }
});
