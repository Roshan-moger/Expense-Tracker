import { useSelector, useDispatch } from 'react-redux';
import { selectAllEmails, selectFilteredEmails } from '../features/Email/EmailSelector';
import { addMonthlySaving, setSelectedMonth } from '../features/Email/EmailSlice';
import { useEffect } from 'react';
import ExpenseChart from './ExpenseChart/ExpenseChart';
import ExpensePieChart from './ExpenseChart/ExpensePieChart';
import RecentTransactions from './RecentTrancation/RecentTransactions';

const MainPage = ({ user }) => {
  const dispatch = useDispatch();
  const filteredEmails = useSelector(selectFilteredEmails);
  const months = useSelector(state => state.emails.availableMonths);
  const selectedMonth = useSelector(state => state.emails.selectedMonth);
  const saving = useSelector(state => state.emails.saving);
  const addedMonths = useSelector(state => state.emails.addedMonths);
  const allEmails = useSelector(selectAllEmails); // includes manual + email data

  let income = 0;
  let expense = 0;

  filteredEmails.forEach(tx => {
    let amount = 0;
    let type = '';

    if (typeof tx.subject === 'string') {
      const subject = tx.subject.toLowerCase();
      amount = parseFloat(subject.match(/\b\d+(?:\.\d{1,2})?\b/)?.[0]);
      type = subject.includes("credited") ? "credited" : subject.includes("debited") ? "debited" : '';
    } else if (tx.type && typeof tx.amount === 'number') {
      amount = tx.amount;
      type = tx.type.toLowerCase();
    }

    if (!isNaN(amount)) {
      if (type === "credited") income += amount;
      else if (type === "debited") expense += amount;
    }
  });

  const net = income - expense;

  useEffect(() => {
    if (months.length === 0 || allEmails.length === 0) return;

    months.forEach((monthStr) => {
      if (!addedMonths.includes(monthStr)) {
        let income = 0;
        let expense = 0;

        const monthEmails = allEmails.filter(tx =>
          tx.date?.startsWith(monthStr)
        );

        monthEmails.forEach(tx => {
          let amount = 0;
          let type = '';

          if (typeof tx.subject === 'string') {
            const subject = tx.subject.toLowerCase();
            amount = parseFloat(subject.match(/\b\d+(?:\.\d{1,2})?\b/)?.[0]);
            type = subject.includes("credited") ? "credited" : subject.includes("debited") ? "debited" : '';
          } else if (tx.type && typeof tx.amount === 'number') {
            amount = tx.amount;
            type = tx.type.toLowerCase();
          }

          if (!isNaN(amount)) {
            if (type === "credited") income += amount;
            else if (type === "debited") expense += amount;
          }
        });

        const net = income - expense;
        dispatch(addMonthlySaving({ month: monthStr, net }));
      }
    });
  }, [months, allEmails, addedMonths, dispatch]);

  return (
    <div className="p-3 space-y-6">
      {/* Row 1: Select + Username */}
      <div className="flex justify-between items-center">
        <div className="text-right font-medium text-gray-700">
          Welcome, <span className="font-bold">{user.name}</span>
        </div>
        <div>
          <select
            id="monthSelect"
            value={selectedMonth}
            onChange={e => dispatch(setSelectedMonth(e.target.value))}
            className="px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none "
          >
            {months.map((monthStr) => {
              const [year, month] = monthStr.split("-");
              const date = new Date(year, month - 1);
              const label = `${date.toLocaleString("default", { month: "long" })} ${year}`;
              return (
                <option key={monthStr} value={monthStr}>{label}</option>
              );
            })}
          </select>
        </div>
      </div>

      {/* /* Row 2: Cards */ }
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#8356D6] shadow-lg rounded-lg p-4 flex">
            <div className="w-[2px] bg-white rounded-l"></div>
            <div className="pl-4 w-full">
          <h3 className="text-sm text-white">Total Balance</h3>
          <p className="text-white text-xl font-semibold mt-1">₹{net.toFixed(2)}</p>
          <p className="text-xs text-right text-gray-300 mt-2">Available funds</p>
            </div>
        </div>

        <div className="bg-[#8356D6] shadow-lg rounded-lg p-4 flex">
          <div className="w-[2px] bg-white rounded-l"></div>
          <div className="pl-4 w-full">
            <h3 className="text-sm text-white">Income</h3>
            <p className="text-white text-xl font-semibold mt-1">₹{income.toFixed(2)}</p>
            <p className="text-xs text-right text-gray-300 mt-2">This month</p>
          </div>
        </div>

        <div className="bg-[#8356D6] shadow-lg rounded-lg p-4 flex">
          <div className="w-[2px] bg-white rounded-l"></div>
          <div className="pl-4 w-full">
            <h3 className="text-sm text-white">Expense</h3>
            <p className="text-white text-xl font-semibold mt-1">₹{expense.toFixed(2)}</p>
            <p className="text-xs text-right text-gray-300 mt-2">Spent</p>
          </div>
        </div>

        {/* Saving Card */}
        <div className="bg-[#8356D6] shadow-lg rounded-lg p-4 flex">
          <div className="w-[2px] bg-white rounded-l"></div>
          <div className="pl-4 w-full">
            <h3 className="text-sm text-white">Saving</h3>
            <p className="text-white text-xl font-semibold mt-1">₹{saving.toFixed(2)}</p>
            <p className="text-xs text-right text-gray-300 mt-2">Cumulative total</p>
          </div>
        </div>
      </div>

      {/* Chart + Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 flex flex-col h-full">
          <div className="flex-1">
            <ExpenseChart />
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col h-full">
          <div className="flex-1">
            <ExpensePieChart />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
};

export default MainPage;
