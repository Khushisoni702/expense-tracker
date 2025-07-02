import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Signup successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Signup failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex justify-center items-center">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-600">Create Account</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 border rounded-lg pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff /> : <Eye />}
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/" className="text-indigo-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;


