import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL

// Save a new manual transaction
export const saveManualTransactionAsync = createAsyncThunk(
  'manualTransaction/save',
  async (transactionData) => {
    const response = await axios.post(`${API}/manualtransactions`, transactionData);
    return response.data;
  }
);

// Fetch all manual transactions
export const fetchManualTransactions = createAsyncThunk(
  'manualTransaction/fetchAll',
  async () => {
    const response = await axios.get(`${API}/manualtransactions`);
    return response.data;
  }
);

// Update a manual transaction note
export const updateManualNoteAsync = createAsyncThunk(
  'manualTransaction/updateNote',
  async ({ manualId, note }) => {
    const response = await axios.put(`${API}/manualtransactions/${manualId}`, { note });
    return response.data;
  }
);

// Delete a manual transaction
export const deleteManualTransactionAsync = createAsyncThunk(
  'manualTransaction/delete',
  async (manualId) => {
    await axios.delete(`${API}/manualtransactions/${manualId}`);
    return manualId;
  }
);

const manualTransactionSlice = createSlice({
  name: 'manualTransaction',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchManualTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchManualTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchManualTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(saveManualTransactionAsync.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
      })

      .addCase(updateManualNoteAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.data.findIndex(txn => txn._id === updated._id);
        if (index !== -1) {
          state.data[index] = updated;
        }
      })

      .addCase(deleteManualTransactionAsync.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.data = state.data.filter(txn => txn._id !== deletedId);
      });
  },
});

export default manualTransactionSlice.reducer;
