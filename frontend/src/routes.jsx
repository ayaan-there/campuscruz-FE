import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import FindRide from './pages/FindRide.jsx';
import NotFound from './pages/NotFound.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import OfferRide from './pages/OfferRide.jsx';
import RideDetails from './pages/RideDetails.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AuthLayout from './layouts/AuthLayout.jsx';
import MainLayout from './layouts/MainLayout.jsx';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="find-ride" element={<FindRide />} />
        </Route>
        
        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="offer-ride" element={<OfferRide />} />
          <Route path="ride/:id" element={<RideDetails />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;