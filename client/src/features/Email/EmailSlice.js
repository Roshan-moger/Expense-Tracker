import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch emails
export const fetchEmails = createAsyncThunk(
  'emails/fetchEmails',
  async () => {
    const response = await axios.get('http://localhost:5000/api/emails/subjects');
    return response.data; // Expecting array of email objects from backend
  }
);

// Thunk to mark an email as read
export const markEmailAsReadAsync = createAsyncThunk(
  'emails/markAsReadAsync',
  async (emailId) => {
    const response = await axios.put(`http://localhost:5000/api/emails/${emailId}/read`);
    return response.data; // Updated email object from backend
  }
);

export const updateEmailNoteAsync = createAsyncThunk(
  'emails/updateNote',
  async ({ emailId, note }) => {
    const response = await axios.put(`http://localhost:5000/api/emails/${emailId}/note`, { note });
    return response.data; // Updated email from backend
  }
);


const emailSlice = createSlice({
  name: 'emails',
  initialState: {
    data: [],
    loading: false,
    error: null,
    selectedMonth: null,  // Format: "YYYY-MM"
    availableMonths: [],  // <-- add this
    saving: 0,
  addedMonths: [],
  
  },
  reducers: {
    markAsRead: (state, action) => {
      const emailId = action.payload;
      const email = state.data.find(e => e._id === emailId);
      if (email) {
        email.read = true;
      }
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
   addMonthlySaving: (state, action) => {
  const { month, net } = action.payload;

  if (!state.addedMonths.includes(month)) {
    state.saving += net;
    state.addedMonths.push(month);
  }
},
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchEmails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.loading = false;

        const newEmails = action.payload.filter((newEmail) =>
          !state.data.some((existingEmail) => existingEmail._id === newEmail._id)
        );

        const enrichedEmails = newEmails.map((email) => ({
          ...email,
          read: email.read ?? false,
        }));

        state.data = [...state.data, ...enrichedEmails];

        // 🔥 Extract all unique months from emails
        const monthsSet = new Set();
        state.data.forEach(email => {
          const date = new Date(email.date); // make sure `date` exists in email
          if (!isNaN(date)) {
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthsSet.add(monthKey);
          }
        });

        // Sort months descending (latest first)
        state.availableMonths = Array.from(monthsSet).sort().reverse();

        // Set default selectedMonth if not set
        if (!state.selectedMonth && state.availableMonths.length > 0) {
          state.selectedMonth = state.availableMonths[0];
        }
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(markEmailAsReadAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.data.findIndex(e => e._id === updated._id);
        if (idx !== -1) {
          state.data[idx] = updated;
        }
      })
         .addCase(updateEmailNoteAsync.fulfilled, (state, action) => {
      const updatedEmail = action.payload;
      const index = state.data.findIndex(e => e._id === updatedEmail._id);
      if (index !== -1) {
        state.data[index] = updatedEmail;
      }
    });;
  },
});

export const { markAsRead, setSelectedMonth, addMonthlySaving } = emailSlice.actions;
export default emailSlice.reducer;
