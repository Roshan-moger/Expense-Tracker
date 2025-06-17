import { createSelector } from '@reduxjs/toolkit';

// Basic selectors
export const selectEmailsData = state => state.emails.data || [];
export const selectManualTransactionsData = state => state.manualTransaction.data || [];
export const selectSelectedMonth = state => state.emails.selectedMonth;

// Combined selector for all emails and manual transactions
export const selectAllEmails = createSelector(
  [selectEmailsData, selectManualTransactionsData],
  (emailsData, manualTransactionsData) => {
    return [...emailsData, ...manualTransactionsData];
  }
);

// Filtered selector by selected month
export const selectFilteredEmails = createSelector(
  [selectAllEmails, selectSelectedMonth],
  (emails, selectedMonth) => {
    if (!selectedMonth) return emails;

    return emails.filter(email => {
      const date = new Date(email.date);
      const emailMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return emailMonth === selectedMonth;
    });
  }
);
