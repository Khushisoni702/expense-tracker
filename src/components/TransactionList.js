import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { format, startOfDay, endOfDay } from 'date-fns';

const TransactionList = ({ selectedDate, refreshFlag }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const start = startOfDay(selectedDate);
      const end = endOfDay(selectedDate);

      const q = query(
        collection(db, 'transactions'),
        where('uid', '==', user.uid),
        where('created', '>=', start),
        where('created', '<=', end),
        orderBy('created', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
    };

    fetchTransactions();
  }, [selectedDate, refreshFlag]);

  return (
    <div className="overflow-x-auto">
      {transactions.length === 0 ? (
        <p className="text-gray-600 text-center">No transactions yet.</p>
      ) : (
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-indigo-200 text-indigo-900 text-left">
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Category</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-gray-200 hover:bg-indigo-50">
                <td className="py-2 px-4 font-semibold text-gray-800">₹{tx.amount}</td>
                <td
                  className={`py-2 px-4 ${
                    tx.type === 'Income' ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {tx.type}
                </td>
                <td className="py-2 px-4 text-gray-700">{tx.category}</td>
                <td className="py-2 px-4 text-gray-700">
                  {tx.created?.toDate
                    ? format(tx.created.toDate(), 'dd/MM/yyyy')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionList;


