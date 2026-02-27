import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CartPage from './pages/CartPage';
import AddProductPage from './pages/Addproductpage';
import EditProductPage from './pages/Editproductpage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import PaymentReturn from './pages/PaymentReturn';
import PaymentCancel from './pages/PaymentCancel';

import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } 
            />
            <Route path="/admin/products/add"       element={<AddProductPage />} />
            <Route path="/admin/products/:id/edit"  element={<EditProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" />} />

            <Route path="/payment/return" element={<PaymentReturn />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />

          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;