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

  // Email Count
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEmails());
    dispatch(fetchManualTransactions());
    const interval = setInterval(() => {
        dispatch(fetchManualTransactions());
      dispatch(fetchEmails());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);






useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp > now) {
      // Token is valid
      API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Auth error:", err);
          localStorage.removeItem("token");
          setUser(null);
        });
    } else {
      console.warn("Token expired");
      localStorage.removeItem("token");
      setUser(null);
    }
  } catch (err) {
    console.error("Invalid token", err);
    localStorage.removeItem("token"); // ❌ fix: remove extra argument
    setUser(null);
  }
}, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route: Redirect authenticated users to dashboard */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <LoginPage onAuth={setUser} />
          }
        />

        {/* Protected Dashboard Route with Nested Routes */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={() => setUser(null)} />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element={<MainPage  user={user}  />} /> {/* Default content */}
          <Route path="inbox" element={<Inbox />} />
          {/* <Route path="addExpense" element={<ManualTransactionForm />} /> */}
          <Route path="addExpense" element={<AddExpenses />} />
          <Route path="transactions" element={<AllTransactions />} />
          <Route path="reports" element={<Reports />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
