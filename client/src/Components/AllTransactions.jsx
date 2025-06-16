import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { updateEmailNoteAsync } from '../features/Email/EmailSlice';
import { updateManualNoteAsync, deleteManualTransactionAsync } from '../features/manual/manualSlice';
import toast from 'react-hot-toast';

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

const AllTransactions = () => {
  const emails = useSelector((state) => state.emails.data || []);
  const manual = useSelector((state) => state.manualTransaction.data || []);
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentTxn, setCurrentTxn] = useState(null);
  const [noteInput, setNoteInput] = useState('');

  const handleEditClick = (txn) => {
    setCurrentTxn(txn);
    setNoteInput(txn.note || '');
    setModalOpen(true);
  };

  const handleDeleteClick = (txn) => {
    setCurrentTxn(txn);
    setDeleteModalOpen(true);
  };

  const handleNoteSubmit = async () => {
    if (!currentTxn) return;

    try {
      if (currentTxn.source === 'manual') {
        await dispatch(
          updateManualNoteAsync({
            manualId: currentTxn._id,
            note: noteInput,
          })
        ).unwrap();
      } else {
        await dispatch(
          updateEmailNoteAsync({
            emailId: currentTxn._id,
            note: noteInput,
          })
        ).unwrap();
      }

      currentTxn.note = noteInput; // Optimistic UI update
      toast.success('Note updated successfully!',{
  style: {
    background: '#343434', // Tailwind's emerald-600
    color: '#EDEDED',
    fontWeight: 'bold',
  },
});
      setModalOpen(false);
    } catch (err) {
      console.error('Error updating note:', err);
      toast.error('Failed to update note. Please try again.',{
  style: {
    background: '#343434',
    color: '#EDEDED',
    fontWeight: 'bold',
  },
});
    }
  };

  const handleDeleteSubmit = async () => {
    if (!currentTxn || currentTxn.source !== 'manual') return;

    try {
      await dispatch(
        deleteManualTransactionAsync(currentTxn._id)
      ).unwrap();
      toast.success('Transaction deleted successfully!',{
  style: {
    background: '#343434', // Tailwind's emerald-600
    color: '#EDEDED',
    fontWeight: 'bold',
  },
});
      setDeleteModalOpen(false);
      setCurrentTxn(null);
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast.error('Failed to delete transaction. Please try again.',{
  style: {
    background: '#343434',
    color: '#EDEDED',
    fontWeight: 'bold',
  },
});
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

  const formattedManual = manual.map((txn, idx) => ({
    _id: txn._id || `manual-${idx}`,
    ...txn,
    source: 'manual',
  }));

  const allTransactions = [...formattedEmails, ...formattedManual].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="relative min-h-screen  p-6 overflow-hidden">
      {/* Background Animation */}

      {/* Transactions Container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          All Transactions
        </h3>

        {/* Header */}
       <div className="grid grid-cols-4 gap-4 px-6 py-4 rounded-t-2xl bg-[#8356D6] text-white text-sm font-semibold text-center shadow-md backdrop-blur-sm">
  <span className="uppercase tracking-wide">Date</span>
  <span className="uppercase tracking-wide">Type</span>
  <span className="uppercase tracking-wide">Amount</span>
  <span className="uppercase tracking-wide">Actions</span>
</div>


        {/* Transactions List */}
        {allTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-6 bg-white rounded-xl shadow-md">
            No transactions available.
          </p>
        ) : (
          <ul className="space-y-3 mt-4">
            {allTransactions.map((txn) => (
            <li
  key={txn._id}
  className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 
    ${txn.type === 'credited' ? 'border-green-400' : txn.type === 'debited' ? 'border-red-400' : 'border-gray-400'}"
>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div className="space-y-1">
      <p className="text-gray-500 text-sm">
        {new Date(txn.date).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      <p
        className={`text-lg font-semibold capitalize ${
          txn.type === 'credited'
            ? 'text-green-600'
            : txn.type === 'debited'
            ? 'text-red-600'
            : 'text-gray-500'
        }`}
      >
        {txn.type}
      </p>
      <p className="text-xl font-bold text-gray-800">
        ₹{txn.amount.toFixed(2)}
      </p>
    </div>
    <div className="flex flex-col md:items-end gap-2">
      <p className="text-sm text-gray-600 italic max-w-xs truncate">
        {txn.note || 'No note added'}
      </p>
      <div className="flex gap-2">
        <button
          className="text-blue-500 hover:text-blue-700 text-lg"
          onClick={() => handleEditClick(txn)}
          title="Edit note"
        >
          ✏️
        </button>
        {txn.source === 'manual' && (
          <button
            className="text-red-500 hover:text-red-700 text-lg"
            onClick={() => handleDeleteClick(txn)}
            title="Delete transaction"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  </div>
</li>

            ))}
          </ul>
        )}

        {/* Edit Note Modal */}
        {modalOpen && (
<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-modal-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Add/Edit Note
              </h2>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-50 transition-colors duration-300"
                rows="4"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Enter note"
             
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#8356D6]  text-white rounded-lg"
                  onClick={handleNoteSubmit}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-modal-in">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Delete Transaction
              </h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this transaction for ₹
                {currentTxn?.amount.toFixed(2)} ({currentTxn?.type})?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200"
                  onClick={handleDeleteSubmit}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

     
      </div>
    </div>
  );
};

export default AllTransactions;