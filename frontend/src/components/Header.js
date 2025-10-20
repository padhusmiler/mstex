import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { ShoppingCart, User, LogOut, Home, Package } from 'lucide-react';

const Header = () => {
  const { user, logout, cartCount } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md" data-testid="header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3" data-testid="logo-link">
            <img 
              src="/mstex-logo.png" 
              alt="MS TEX" 
              className="h-14 w-auto"
              onError={(e) => {
                // Fallback if logo fails to load
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'block';
              }}
            />
            <div style={{display: 'none'}} className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">MS</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 leading-tight">
                MS TEX
              </h1>
              <p className="text-xs text-gray-600">Premium Knitted Clothing</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 font-medium"
              data-testid="nav-home"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            {user && (
              <Link
                to="/orders"
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 font-medium"
                data-testid="nav-orders"
              >
                <Package size={20} />
                <span>Orders</span>
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                  data-testid="cart-button"
                >
                  <ShoppingCart size={24} className="text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" data-testid="cart-count">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="p-2 hover:bg-gray-100 rounded-full"
                  data-testid="profile-button"
                >
                  <User size={24} className="text-gray-700" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-medium"
                  data-testid="logout-button"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-full"
                  data-testid="login-link"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-full hover:shadow-lg"
                  data-testid="register-link"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;