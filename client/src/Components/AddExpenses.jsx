import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveManualTransactionAsync } from '../features/manual/manualSlice';
import toast from 'react-hot-toast';

const AddExpenses = () => {
  const dispatch = useDispatch();

  // Helper: format current local datetime as yyyy-MM-ddTHH:mm for datetime-local input
  const getLocalDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const [amount, setAmount] = useState('');
  const [type, setType] = useState('debited');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getLocalDateTime());

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert local datetime string to ISO string in UTC before saving
    const isoDate = new Date(date).toISOString();

    dispatch(
      saveManualTransactionAsync({
        amount: parseFloat(amount),
        type,
        note,
        date: isoDate,
      })
    ).then(() => {
      toast.success('Expense added successfully!',{
  style: {
    background: '#343434', // Tailwind's emerald-600
    color: '#EDEDED',
    fontWeight: 'bold',
  },
});
    
      setAmount('');
      setNote('');
      setDate(getLocalDateTime());
    });
  };

  return (
    <div className="relative h-[95vh] flex items-center justify-center  overflow-hidden">
      {/* Background Animation */}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white bg-opacity-80 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-500"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add Manual Expense
        </h2>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white bg-opacity-50"
            placeholder="Enter amount (e.g., 100.00)"
            required
          />
        </div>

        {/* Type Select */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white bg-opacity-50"
          >
            <option value="debited">Debited</option>
            <option value="credited">Credited</option>
          </select>
        </div>

        {/* Note Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Note
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white bg-opacity-50"
            placeholder="Optional note"
          />
        </div>

        {/* Date & Time Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date & Time
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 bg-white bg-opacity-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#8356D6] from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Expense
        </button>
      </form>

      {/* Custom CSS for Background Animation */}
      
    </div>
  );
};

export default AddExpenses;