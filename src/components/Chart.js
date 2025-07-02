import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { startOfMonth, endOfMonth, format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AnalyticsChart = ({ selectedDate }) => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [label, setLabel] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);

      const q = query(
        collection(db, 'transactions'),
        where('uid', '==', user.uid),
        where('created', '>=', start),
        where('created', '<=', end)
      );

      const querySnapshot = await getDocs(q);
      let incomeSum = 0;
      let expenseSum = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === 'Income') incomeSum += data.amount;
        else if (data.type === 'Expense') expenseSum += data.amount;
      });

      setIncome(incomeSum);
      setExpense(expenseSum);
      setLabel(`Income vs Expense – ${format(selectedDate, 'MMMM yyyy')}`);
    };

    fetchData();
  }, [selectedDate]);

  const barChartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: '₹ Amount',
        data: [income, expense],
        backgroundColor: ['#34d399', '#f87171'],
        borderRadius: 6,
        barThickness: 60,
      },
    ],
  };

  const pieChartData = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ['#10b981', '#ef4444'],
        hoverOffset: 12,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#374151',
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#4B5563', font: { size: 13 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#4B5563', font: { size: 13 } },
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-center text-xl font-semibold text-gray-800">{label}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <Bar data={barChartData} options={barOptions} />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-md">
          <Pie data={pieChartData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;







