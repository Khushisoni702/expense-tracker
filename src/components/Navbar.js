import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LayoutDashboard, LogOut } from 'lucide-react';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-white/70 backdrop-blur-sm p-4 mb-6 rounded-xl shadow-md flex items-center justify-between">
      <div className="flex items-center gap-2 text-indigo-700 font-bold text-xl">
        <LayoutDashboard className="w-6 h-6" />
        <Link to="/">Expense Tracker</Link>
      </div>
      <div className="space-x-4 text-sm">
        {user ? (
          <>
            <Link
              to="/"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition flex items-center gap-1"
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

