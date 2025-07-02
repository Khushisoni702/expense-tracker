import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { DollarSign, ArrowDown, List, PiggyBank } from 'lucide-react';

const MonthlyInsights = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'transactions'));
      let incomeSum = 0;
      let expenseSum = 0;
      let txCount = 0;
      const thisMonth = new Date().getMonth();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const txDate = data.date?.toDate?.() || new Date();
        if (txDate.getMonth() === thisMonth) {
          txCount++;
          if (data.type === 'Income') incomeSum += data.amount;
          else if (data.type === 'Expense') expenseSum += data.amount;
        }
      });

      setIncome(incomeSum);
      setExpense(expenseSum);
      setCount(txCount);
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Monthly Income',
      value: `₹${income}`,
      color: 'bg-emerald-100 text-emerald-800',
      icon: <DollarSign className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: 'Monthly Expenses',
      value: `₹${expense}`,
      color: 'bg-rose-100 text-rose-800',
      icon: <ArrowDown className="h-6 w-6 text-rose-500" />,
    },
    {
      title: 'Transactions',
      value: count,
      color: 'bg-indigo-100 text-indigo-800',
      icon: <List className="h-6 w-6 text-indigo-500" />,
    },
    {
      title: 'Savings',
      value: `₹${income - expense}`,
      color: 'bg-yellow-100 text-yellow-800',
      icon: <PiggyBank className="h-6 w-6 text-yellow-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-6">
      {statCards.map((card, idx) => (
        <div
          key={idx}
          className={`rounded-2xl p-4 shadow-md flex items-center space-x-4 ${card.color}`}
        >
          <div>{card.icon}</div>
          <div>
            <p className="text-sm font-medium">{card.title}</p>
            <p className="text-lg font-bold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MonthlyInsights;

