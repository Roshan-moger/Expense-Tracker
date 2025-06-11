import { useSelector } from 'react-redux';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { groupExpensesByWeek, groupExpensesByMonth } from './chartUtils';
import { useState } from 'react';
import { selectAllEmails } from '../../features/Email/EmailSelector';

const ExpenseChart = () => {
  const allEmails = useSelector(selectAllEmails);
  const [view, setView] = useState('weekly');

  const chartData =
    view === 'weekly'
      ? groupExpensesByWeek(allEmails)
      : groupExpensesByMonth(allEmails);

  return (
    <div className="bg-white p-6 rounded shadow-md mt-6 border border-gray-100 h-3.5/4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">Spending Overview</h2>
        <select
          className="border border-gray-300 bg-gray-50 text-gray-700 rounded-md px-3 py-1 shadow-sm hover:border-gray-400 focus:outline-none"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          {/* Add SVG filter directly in JSX */}
          <defs>
            <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="2"
                floodColor="rgba(0, 0, 0, 0.5)"
                floodOpacity="0.5"
              />
            </filter>
          </defs>

          <CartesianGrid
            stroke="#000"
            strokeDasharray="4 4"
            horizontal={false}
            vertical={true}
          />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis
            domain={[0, view === 'weekly' ? 7000 : 15000]}
            stroke="#888"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: 6,
            }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
            cursor={{ stroke: '#000', strokeWidth: 0.2 }}
          />
          {/* Background low-opacity line */}
          <Line
            type="linear"
            dataKey="amount"
            stroke="#000"
            strokeWidth={4}
            dot={false}
            strokeOpacity={0.2}
          />
          {/* Foreground line with shadow */}
          <Line
            type="linear"
            dataKey="amount"
            stroke="#000"
            strokeWidth={3}
            dot={{
              r: 3,
              stroke: '#000',
              strokeWidth: 1,
              fill: '#fff',
            }}
            activeDot={{
              r: 6,
              stroke: '#000',
              strokeWidth: 1,
              fill: '#fff',
            }}
            style={{
              filter: 'url(#lineShadow)',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
