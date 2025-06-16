import React from 'react'
import { useSelector } from 'react-redux';
import {
  groupExpensesByDay,
  groupExpensesByMonth,
  groupExpensesByWeek,
  groupIncomeByDay,
  groupIncomeByMonth,
  groupIncomeByWeek,
} from './ExpenseChart/chartUtils';
import { selectAllEmails } from '../features/Email/EmailSelector';
import LineChartBox from './ExpenseChart/LineChartBox';
import BarChartBox from './ExpenseChart/ExpenseBarChart';
import BalanceBarChart from './ExpenseChart/BalanceBarChart ';

const Reports = () => {
  const allEmails = useSelector(selectAllEmails);

  const weeklyIncomeData = groupIncomeByWeek(allEmails);
  const weeklyExpenseData = groupExpensesByWeek(allEmails);
  const monthlyIncomeData = groupIncomeByMonth(allEmails);
  const monthlyExpenseData = groupExpensesByMonth(allEmails);
  const dailyIncomeData = groupIncomeByDay(allEmails);
  const dailyExpenseData = groupExpensesByDay(allEmails);


  const mergeIncomeAndExpense = (incomeArr, expenseArr) => {
  return incomeArr.map((item, idx) => ({
    name: item.name,
    income: item.amount,
    expense: expenseArr[idx]?.amount || 0,
  }));
};

const calculateMonthlyBalance = (incomeArr, expenseArr) => {
  return incomeArr.map((item, idx) => {
    const income = item.amount || 0;
    const expense = expenseArr[idx]?.amount || 0;
    return {
      name: item.name, // e.g., "Jan", "Feb", etc.
      balance: income - expense,
    };
  });
};
const weeklyCombined = mergeIncomeAndExpense(weeklyIncomeData, weeklyExpenseData);
const monthlyCombined = mergeIncomeAndExpense(monthlyIncomeData, monthlyExpenseData);
const monthlyBalanceData = calculateMonthlyBalance(monthlyIncomeData, monthlyExpenseData);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Reports</h1>
      
      {/* Grid for charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BarChartBox title="Weekly Income vs Expense" data={weeklyCombined} />
        <BarChartBox title="Monthly Income vs Expense" data={monthlyCombined} />
</div>
        <BalanceBarChart title="Monthly Total Balance" data={monthlyBalanceData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

         <LineChartBox title="Income - Daily" data={dailyIncomeData} dataKey="amount" color="#000" />
        <LineChartBox title="Expense - Daily" data={dailyExpenseData} dataKey="amount" color="#000" />
        <LineChartBox title="Income - Weekly" data={weeklyIncomeData} dataKey="amount" color="#000" />
        <LineChartBox title="Expense - Weekly" data={weeklyExpenseData} dataKey="amount" color="#000" />
       

      </div>
    </div>
  );
};

export default Reports;
