import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard'; // Import the Admin Dashboard
import Navbar from './components/Navbar';
import ComplaintForm from './components/ComplaintForm';
import MyComplaint from "./components/My-complaints";
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User/Citizen Routes */}
          <Route path="/complaintform" element={<ComplaintForm />} />
          <Route path="/my-complaints" element={<MyComplaint />} />

          {/* Admin Routes */}
          {/* This fixes the 'No routes matched' error you saw */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          {/* Optional: 404 Page or Redirect */}
          <Route path="*" element={<div style={{padding: '50px', textAlign: 'center'}}><h2>404 - Page Not Found</h2></div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;