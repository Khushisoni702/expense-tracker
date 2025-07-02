import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AddTransaction = ({ selectedDate, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('Income');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      toast.error('User not authenticated!');
      return;
    }

    if (!amount || !category) {
      toast.warning('Please fill in all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'transactions'), {
        amount: parseFloat(amount),
        type,
        category,
        uid: user.uid,
        created: selectedDate,
      });

      toast.success('Transaction added successfully!');
      setAmount('');
      setCategory('');
      setType('Income');

      // ✅ Tell App.js to refresh data
      if (onAdd) onAdd();

    } catch (error) {
      toast.error('Failed to add transaction');
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-3 rounded border border-gray-300 w-full"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-3 rounded border border-gray-300 w-full"
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded border border-gray-300 w-full"
          required
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-6 rounded hover:bg-indigo-700 transition"
        >
          Add Transaction
        </button>
      </div>
    </form>
  );
};

export default AddTransaction;









