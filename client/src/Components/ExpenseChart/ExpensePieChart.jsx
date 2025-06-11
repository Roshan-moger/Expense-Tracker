import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';
import { selectFilteredEmails } from '../../features/Email/EmailSelector';

const ExpensePieChart = () => {
  const emails = useSelector(selectFilteredEmails);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  let totalIncome = 0;
  let totalExpense = 0;

  emails.forEach((tx) => {
    let amount = 0;
    let type = '';

    if (typeof tx.subject === 'string') {
      const subject = tx.subject.toLowerCase();
      const match = subject.match(/\b\d+(?:\.\d{1,2})?\b/);
      amount = match ? parseFloat(match[0]) : 0;
      if (subject.includes('debited')) type = 'debited';
      else if (subject.includes('credited')) type = 'credited';
    } else if (tx.type && typeof tx.amount === 'number') {
      type = tx.type.toLowerCase();
      amount = tx.amount;
    }

    if (!isNaN(amount)) {
      if (type === 'debited') totalExpense += amount;
      else if (type === 'credited') totalIncome += amount;
    }
  });

  const totalSavings = totalIncome - totalExpense;

  useEffect(() => {
    const ctx = chartRef.current;

    if (ctx) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Expense', 'Income', 'Savings'],
          datasets: [
            {
              data: [totalExpense, totalIncome, totalSavings],
              backgroundColor: ['#000', '#8356D6', '#ECECEC'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '50%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#333',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#666',
              borderWidth: 1,
            },
          },
        },
        plugins: [
          {
            id: 'customRadii',
            beforeDraw(chart) {
              const { chartArea } = chart;
              const { width, height } = chartArea;
              const maxRadius = Math.min(width, height) / 2;
              const radii = [maxRadius * 0.85, maxRadius * 0.82, maxRadius * 0.8];
              const meta = chart.getDatasetMeta(0);
              meta.data.forEach((arc, index) => {
                arc.outerRadius = radii[index];
              });
            },
          },
          {
            id: 'centerText',
            afterDraw(chart) {
              const { ctx, width, height } = chart;
              ctx.save();
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.font = 'bold 16px sans-serif';
              ctx.fillStyle = '#16A34A';
              ctx.fillText(`₹${totalSavings.toFixed(0)}`, width / 2, height / 2);
              ctx.restore();
            },
          },
          {
            id: 'percentageLabels',
            afterDraw(chart) {
              const { ctx } = chart;
              const meta = chart.getDatasetMeta(0);
              const dataset = chart.data.datasets[0];

              const total = dataset.data[0] + dataset.data[1];
              if (total === 0) return;

              ctx.save();
              ctx.fillStyle = '#fff';
              ctx.font = '12px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              // Expense
              const expenseArc = meta.data[0];
              const expensePercent = ((dataset.data[0] / total) * 100).toFixed(1) + '%';
              const expenseCenter = expenseArc.getCenterPoint();
              ctx.fillText(expensePercent, expenseCenter.x, expenseCenter.y);

              // Income
              const incomeArc = meta.data[1];
              const incomePercent = ((dataset.data[1] / total) * 100).toFixed(1) + '%';
              const incomeCenter = incomeArc.getCenterPoint();
              ctx.fillText(incomePercent, incomeCenter.x, incomeCenter.y);

              ctx.restore();
            },
          },
        ],
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [totalIncome, totalExpense, totalSavings]);

return (
  <div className="bg-white rounded shadow-md p-6 mt-6 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Overview</h2>
    <div className="flex h-[16rem] items-center justify-between">
      <div className="relative w-3/4" style={{ height: '240px', width: '240px' }}>
        <canvas ref={chartRef} />
      </div>

      <div className="w-1/2 pl-6 space-y-3 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8356D6' }} />
          <span className="text-gray-700 font-medium">Income: ₹{totalIncome.toFixed(0)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#000' }} />
          <span className="text-gray-700 font-medium">Expense: ₹{totalExpense.toFixed(0)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#B0B0B0' }} />
          <span className="text-gray-700 font-medium">Savings: ₹{totalSavings.toFixed(0)}</span>
        </div>
      </div>
    </div>
  </div>
);

};

export default ExpensePieChart;
