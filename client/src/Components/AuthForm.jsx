import React, { useState } from 'react';
import API from '../Components/utils/api';
import toast from 'react-hot-toast';

const AuthForm = ({ onAuth }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Please fill in all required fields', {
        style: {
          background: '#343434',
          color: '#EDEDED',
          fontWeight: 'bold',
        },
      });
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post('/auth/login', form);

      localStorage.setItem('token', data.token);
      toast.success(`Welcome back ${data.name}`, {
        style: {
          background: '#343434',
          color: '#EDEDED',
          fontWeight: 'bold',
        },
      });
      onAuth(data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg, {
        style: {
          background: '#343434',
          color: '#EDEDED',
          fontWeight: 'bold',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded shadow z-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4 transition-all duration-300">
        <input
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white transition duration-200 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8356D6] hover:bg-[#6f4c9a]'
          } active:scale-95`}
        >
          {loading ? 'Please wait...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
