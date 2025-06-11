import React, { useState } from 'react';
import API from '../Components/utils/api'
import toast from 'react-hot-toast';


const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });


const handleSubmit = async (e) => {
  e.preventDefault();

  // Basic validation
  if (!form.email || !form.password || (!isLogin && !form.name)) {
    toast.error('Please fill in all required fields',{
  style: {
    background: '#343434', // Tailwind's emerald-600
    color: '#EDEDED',
    fontWeight: 'bold',
  },
});
    return;
  }

  try {
    const endpoint = isLogin ? 'login' : 'register';
    const { data } = await API.post(`/auth/${endpoint}`, form);
    // console.log(data);
    localStorage.setItem('token', data.token);
    toast.success(`${isLogin ? `Welcome back ${data.name}` : `Welcome ${data.name}`}`,{
  style: {
    background: '#343434', // Tailwind's emerald-600
    color: '#EDEDED',
    fontWeight: 'bold',
  },
});
    onAuth(data);
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      (isLogin ? 'Invalid email or password' : 'Registration failed');
    toast.error(msg,{
  style: {
    background: '#343434', // Tailwind's emerald-600
    color: '#EDEDED',
    fontWeight: 'bold',
  },
});
  }
};


  return (
    <div className="w-full max-w-md p-6 bg-white rounded shadow z-1">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            className="w-full border p-2 rounded"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-[#8356D6] text-white py-2 rounded hover:bg-[#6f4c9a]">
          {isLogin ? 'Login' : 'Register'}
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
