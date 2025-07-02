import React, { useEffect, useState } from 'react';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import AnalyticsChart from './components/Chart';
import ExportData from './components/ExportData';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  ListOrdered,
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { startOfMonth, endOfMonth } from 'date-fns';

function App() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshFlag, setRefreshFlag] = useState(false);
  const handleTransactionAdded = () => setRefreshFlag(prev => !prev);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
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
        if (data.type === 'Expense') expenseSum += data.amount;
      });

      setIncome(incomeSum);
      setExpense(expenseSum);
      setTransactionCount(querySnapshot.size);
    };

    fetchData();
  }, [user, selectedDate, refreshFlag]);

  if (loading) return null;
  if (!user) return null;

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-800 p-6 font-sans text-white">
      <Navbar user={user} />
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 space-y-10 border border-gray-200 text-black">

        <header className="flex items-center justify-center gap-3 text-indigo-700 mb-4">
          <LayoutDashboard className="w-10 h-10" />
          <h1 className="text-4xl font-extrabold tracking-tight">Expense Tracker Dashboard</h1>
        </header>

        {/* Calendar Filter */}
        <div className="flex justify-center">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd MMMM yyyy"
            className="border px-4 py-2 rounded-md text-gray-700"
          />
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <SummaryBox icon={<ArrowDownCircle className="text-green-500 w-6 h-6" />} title="Income" value={`₹${income}`} />
          <SummaryBox icon={<ArrowUpCircle className="text-red-500 w-6 h-6" />} title="Expense" value={`₹${expense}`} />
          <SummaryBox icon={<PiggyBank className="text-blue-500 w-6 h-6" />} title="Savings" value={`₹${income - expense}`} />
          <SummaryBox icon={<ListOrdered className="text-purple-500 w-6 h-6" />} title="Transactions" value={transactionCount} />
        </section>

        <Section title="➕ Add a Transaction">
         <AddTransaction selectedDate={selectedDate} onAdd={() => setRefreshFlag(prev => !prev)} />
        </Section>

        <Section title="📋 Transaction History">
         <TransactionList selectedDate={selectedDate} refreshFlag={refreshFlag} />
        </Section>

        <Section title="📊 Income vs Expense Chart">
          <div className="w-full">
            <AnalyticsChart selectedDate={selectedDate} />

          </div>
        </Section>

        <Section title="📤 Export Your Data">
          <ExportData selectedDate={selectedDate} refreshFlag={refreshFlag} />
        </Section>
      </div>
    </div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
  </>
  );
}

const SummaryBox = ({ icon, title, value }) => (
  <div className="bg-white/80 border-l-4 border-gray-300 p-4 rounded-lg shadow-md">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <section className="bg-indigo-50/50 p-6 rounded-2xl shadow-sm">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </section>
);

export default App;













