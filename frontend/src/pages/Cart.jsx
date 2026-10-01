import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderApi } from '../services/api';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const Cart = () => {
  const { user } = useAuth();
  const { cart, loading, updateQuantity, removeItem, clearCart, refreshCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user?.id) return;
    setError('');
    setCheckoutLoading(true);

    try {
      const order = await orderApi.placeOrder(user.id);
      setOrderSuccess(order);
      await refreshCart();
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="page-container">
        <div className="order-success-card">
          <div className="success-icon-badge">
            <CheckCircle2 size={48} />
          </div>
          <h2>Order Placed Successfully!</h2>
          <p className="order-success-subtitle">
            Thank you for your purchase. Your order #{orderSuccess.id} has been confirmed.
          </p>

          <div className="order-summary-preview">
            <div className="preview-row">
              <span>Order ID:</span>
              <strong>#{orderSuccess.id}</strong>
            </div>
            <div className="preview-row">
              <span>Total Amount:</span>
              <strong>${orderSuccess.totalAmount?.toFixed(2)}</strong>
            </div>
            <div className="preview-row">
              <span>Status:</span>
              <span className="badge badge-success">{orderSuccess.status}</span>
            </div>
            <div className="preview-row">
              <span>Items Ordered:</span>
              <span>{orderSuccess.items?.length || 0} unique items</span>
            </div>
          </div>

          <div className="success-actions">
            <button onClick={() => navigate('/orders')} className="btn-primary">
              <ShoppingBag size={18} />
              <span>View My Orders</span>
            </button>
            <button onClick={() => navigate('/products')} className="btn-secondary">
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const totalAmount = items.reduce((acc, item) => acc + (item.subtotal || item.price * item.quantity), 0);
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-info">
          <h1>Shopping Cart</h1>
          <p>Review your selected retail goods before completing checkout</p>
        </div>

        {items.length > 0 && (
          <button onClick={clearCart} className="btn-outline-danger">
            <Trash2 size={16} />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart size={54} className="empty-icon" />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn-primary" style={{ marginTop: '16px' }}>
            <ShoppingBag size={18} />
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-items-container">
            <div className="cart-table-card">
              <div className="cart-table-header">
                <span className="col-product">Product</span>
                <span className="col-price">Price</span>
                <span className="col-quantity">Quantity</span>
                <span className="col-total">Subtotal</span>
                <span className="col-action">Action</span>
              </div>

              <div className="cart-table-body">
                {items.map((item) => (
                  <div key={item.id || item.productId} className="cart-table-row">
                    <div className="col-product">
                      <div className="product-cart-badge">
                        <ShoppingBag size={20} />
                      </div>
                      <div className="product-cart-info">
                        <span className="product-cart-name">{item.productName}</span>
                        <span className="product-cart-id">SKU #{item.productId}</span>
                      </div>
                    </div>

                    <div className="col-price">
                      ${item.price?.toFixed(2)}
                    </div>

                    <div className="col-quantity">
                      <div className="quantity-stepper">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="stepper-btn"
                          title="Decrease"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="stepper-value">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="stepper-btn"
                          title="Increase"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="col-total">
                      <strong>${((item.price || 0) * item.quantity).toFixed(2)}</strong>
                    </div>

                    <div className="col-action">
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="btn-icon-danger"
                        title="Remove from Cart"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-features-banner">
              <div className="feature-item">
                <Truck size={18} />
                <span>Free Expedited Delivery</span>
              </div>
              <div className="feature-item">
                <ShieldCheck size={18} />
                <span>Instant Checkout & Inventory Sync</span>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary-sidebar">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Items ({totalItemsCount})</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="text-free">FREE</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-total-row">
                  <span>Estimated Total</span>
                  <span className="total-price">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || items.length === 0}
                className="btn-primary btn-block checkout-btn"
              >
                {checkoutLoading ? 'Processing Order...' : 'Checkout Now'}
                {!checkoutLoading && <ArrowRight size={18} />}
              </button>

              <div className="summary-security-note">
                <ShieldCheck size={16} />
                <span>Protected by JWT Secure Authentication</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
