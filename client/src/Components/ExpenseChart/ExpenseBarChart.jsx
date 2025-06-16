import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const BarChartBox = ({ title, data }) => {
  return (
    <div className="bg-white p-4 rounded shadow-md mb-6 border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
          />
          <Legend />
          <Bar dataKey="income" fill="#000" name="Income" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#8356D6" name="Expense" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartBox;



