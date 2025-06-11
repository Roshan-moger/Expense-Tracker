import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { updateEmailNoteAsync } from '../../features/Email/EmailSlice';
import toast from 'react-hot-toast';
import { updateManualNoteAsync } from '../../features/manual/manualSlice';


const extractAmountFromSubject = (subject) => {
  const match = subject.match(/(?:INR|₹)\s?([\d,]+\.\d{2}|\d+)/i);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ''));
  }
  return 0;
};

const getTypeFromSubject = (subject) => {
  if (/credit/i.test(subject)) return 'credited';
  if (/debit/i.test(subject)) return 'debited';
  return 'unknown';
};

const RecentTransactions = () => {
  const emails = useSelector((state) => state.emails.data || []);
  const manual = useSelector((state) => state.manualTransaction.data || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTxn, setCurrentTxn] = useState(null);
  const [noteInput, setNoteInput] = useState('');

    const dispatch = useDispatch();

  const handleEditClick = (txn) => {
    setCurrentTxn(txn);
    setNoteInput(txn.note || '');
    setModalOpen(true);
  };

 const handleNoteSubmit = async () => {
  if (!currentTxn) return;

  try {
    if (currentTxn.source === 'manual') {
      await dispatch(updateManualNoteAsync({
        manualId: currentTxn._id,
        note: noteInput,
      })).unwrap();
    } else {
      await dispatch(updateEmailNoteAsync({
        emailId: currentTxn._id,
        note: noteInput,
      })).unwrap();
    }

    currentTxn.note = noteInput; // Optimistic UI update
    toast.success('Note updated successfully!');
    setModalOpen(false);
  } catch (err) {
    console.error('Error updating note:', err);
    toast.error('Failed to update note. Please try again.');
  }
};

  const formattedEmails = emails.map((email, idx) => ({
    _id: email._id || `email-${idx}`,
    date: email.date,
    amount: extractAmountFromSubject(email.subject),
    note: email.note || '',
    type: getTypeFromSubject(email.subject),
    source: 'email',
  }));

   // Format manual transactions
  const formattedManual = manual.map((txn, idx) => ({
    _id: txn._id || `manual-${idx}`,
    ...txn,
    source: 'manual',
  }));
  // Combine and sort transactions  
const allTransactions = [...formattedEmails, ...formattedManual].sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB - dateA; // Most recent first
}).slice(0, 7); // Limit to 10 most recent transactions
// console.log('All Transactions (Before Sort):', [...formattedEmails, ...formattedManual]);
// console.log('All Transactions (After Sort):', allTransactions);

  return (
    <div className="relative p-6 rounded-xl  w-full mt-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>

      <div className="grid grid-cols-4 gap-4 px-4 py-4  rounded-md text-sm font-medium text-white mb-2 text-center bg-[#8356D6]">
        <span>Date</span>
        <span>Type</span>
        <span>Amount</span>
        <span>Note</span>
      </div>

      {allTransactions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No transactions available.</p>
      ) : (
        <ul className="space-y-1 text-center">
          {allTransactions.map((txn) => (
            <li
              key={txn._id}
              className="grid grid-cols-4 gap-4 items-center bg-white px-4 py-3 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <span className="text-gray-600 text-sm">
{new Date(txn.date).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}              </span>
              <span
                className={`text-sm font-semibold capitalize ${
                  txn.type === 'credited'
                    ? 'text-green-600'
                    : txn.type === 'debited'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {txn.type}
              </span>
              <span
                className={`text-sm font-bold ${
                  txn.type === 'credited'
                    ? 'text-green-700'
                    : txn.type === 'debited'
                    ? 'text-red-700'
                    : 'text-gray-600'
                }`}
              >
                ₹{txn.amount.toFixed(2)}
              </span>
            <span className="text-sm text-gray-700 relative w-full text-center">
  {txn.note || '—'}
  <button
    className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 text-xs cursor-pointer"
    onClick={() => handleEditClick(txn)}
    title="Edit note"
  >
    ✏️
  </button>
</span>

            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add/Edit Note</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="3"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleNoteSubmit}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
