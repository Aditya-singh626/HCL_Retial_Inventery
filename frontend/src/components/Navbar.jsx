import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ShoppingCart, Package, LogIn, UserPlus, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        <Link to="/products" className="brand-logo">
          <div className="brand-icon">
            <ShoppingBag size={22} />
          </div>
          <span className="brand-title">Retail<span>Hub</span></span>
        </Link>

        <nav className="nav-links">
          <NavLink
            to="/products"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <Package size={18} />
            <span>Products</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <div className="cart-link-wrapper">
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>
            <span>Cart</span>
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/orders"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <Package size={18} />
              <span>Orders</span>
            </NavLink>
          )}
        </nav>

        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-badge">
                <User size={16} />
                <span className="user-name">{user?.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-secondary">
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="btn-primary">
                <UserPlus size={16} />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
