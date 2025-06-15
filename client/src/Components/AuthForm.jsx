import React, { useState } from 'react';
import API from '../Components/utils/api';
import toast from 'react-hot-toast';

const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || (!isLogin && !form.name)) {
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
      const endpoint = isLogin ? 'login' : 'register';
      const { data } = await API.post(`/auth/${endpoint}`, form);

      localStorage.setItem('token', data.token);
      toast.success(`${isLogin ? `Welcome back ${data.name}` : `Welcome ${data.name}`}`, {
        style: {
          background: '#343434',
          color: '#EDEDED',
          fontWeight: 'bold',
        },
      });
      onAuth(data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (isLogin ? 'Invalid email or password' : 'Registration failed');
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
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 transition-all duration-300">
        {/* Always rendered, just hidden in login mode */}
        <div
          className={`transition-all duration-300 ${
            isLogin ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'
          }`}
        >
          <input
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
            placeholder="Name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

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
          autoComplete={isLogin ? 'current-password' : 'new-password'}
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
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="mt-4 text-sm text-center">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button
          className="ml-1 text-blue-600 underline cursor-pointer"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
