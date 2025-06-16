import { configureStore } from '@reduxjs/toolkit';
import emailReducer from './features/Email/EmailSlice';
import manualTransactionReducer from './features/manual/manualSlice'

export const store = configureStore({
  reducer: {
    emails: emailReducer,
     manualTransaction: manualTransactionReducer,
  },
});
