import React from 'react';
import AuthForm from '../Components/AuthForm';

const LoginPage = ({ onAuth }) => {
  return (
    <div className="flex flex-col sm:flex-row h-screen relative overflow-hidden">
      {/* Background Circles */}
      <ul className="circles absolute inset-0 -z-10">
        {Array.from({ length: 10 }, (_, i) => (
          <li key={i}></li>
        ))}
      </ul>

      {/* Welcome Section */}
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
        <div className="animate-bounce text-center p-4">
          🚀 Welcome to Expense Tracker App
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="w-full sm:w-1/2 h-1/2 sm:h-full flex items-center justify-center bg-gray-100 p-4">
        <div className="min-h-[440px] w-full flex items-center justify-center">
          <AuthForm onAuth={onAuth} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
