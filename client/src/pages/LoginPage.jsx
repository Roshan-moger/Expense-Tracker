import React from 'react';
import AuthForm from '../Components/AuthForm';

const LoginPage = ({ onAuth }) => {
  return (
    <div className="flex h-screen">
      
            <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                   

            </ul>

      <div className="w-1/2 bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
        <div className="animate-bounce">🚀 Welcome to Expense Tracker App</div>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-gray-100">
        <AuthForm onAuth={onAuth} />
      </div>
    </div>
  );
};

export default LoginPage;
