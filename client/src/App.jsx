import React, { useEffect, useState } from "react";
import 'flowbite'; // Ensure this is installed via npm or yarn
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { jwtDecode } from "jwt-decode";
import Dashboard from "./pages/Dashboard";
import API from "./Components/utils/api";
import Inbox from "./Components/Inbox";
import MainPage from "./Components/MainPage";
import { useDispatch } from "react-redux";
import { fetchEmails } from "./features/Email/EmailSlice"
import AddExpenses from "./Components/AddExpenses";
import { fetchManualTransactions } from "./features/manual/manualSlice";
import AllTransactions from "./Components/AllTransactions";
import Reports from "./Components/Reports";


const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 loading state
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmails());
    dispatch(fetchManualTransactions());
    const interval = setInterval(() => {
      dispatch(fetchEmails());
      dispatch(fetchManualTransactions());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false); // No token, stop loading
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp > now) {
        API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setUser(res.data);
            setLoading(false); // ✅ Done
          })
          .catch((err) => {
            console.error("Auth error:", err);
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false); // ✅ Done
          });
      } else {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false); // ✅ Done
      }
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false); // ✅ Done
    }
  }, []);

  if (loading) {
    return (

    <div className="h-screen w-full bg[#EDEDED] bg-opacity-80 flex flex-col items-center justify-center text-white">
      {/* Spinner */}
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-300 border-white shadow-lg animate-spin"></div>
        <div className="absolute inset-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-inner"></div>
      </div>

      {/* Animated Text */}
      <div className="text-3xl font-bold animate-pulse tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
        Loading...
      </div>
    </div>
  );
};





  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onAuth={setUser} />}
        />
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <Navigate to="/" replace />
          }
        >
          <Route index element={<MainPage user={user} />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="addExpense" element={<AddExpenses />} />
          <Route path="transactions" element={<AllTransactions />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        <Route
          path="*"
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};
export default App;