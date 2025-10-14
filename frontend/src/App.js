import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import Header from './components/Header';
import Footer from './components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (token) {
      loadUser();
      loadCartCount();
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/profile?token=${token}`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user', error);
      logout();
    }
  };

  const loadCartCount = async () => {
    try {
      const response = await axios.get(`${API}/cart?token=${token}`);
      setCartCount(response.data.items?.length || 0);
    } catch (error) {
      console.error('Failed to load cart', error);
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, cartCount, setCartCount, loadCartCount }}>
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={token ? <Cart /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={token ? <Checkout /> : <Navigate to="/login" />} />
            <Route path="/orders" element={token ? <Orders /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
            
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
            <Route path="/admin/products" element={user?.role === 'admin' ? <AdminProducts /> : <Navigate to="/admin/login" />} />
            <Route path="/admin/orders" element={user?.role === 'admin' ? <AdminOrders /> : <Navigate to="/admin/login" />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;