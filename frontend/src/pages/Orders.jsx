import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import {
  Package,
  Calendar,
  CheckCircle,
  Clock,
  ShoppingBag,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';

export const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});

  const fetchOrders = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError('');
      const data = await orderApi.getOrders(user.id);
      setOrders(data);
      // Expand the first order by default if present
      if (data.length > 0) {
        setExpandedOrders({ [data[0].id]: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-info">
          <h1>My Orders</h1>
          <p>Track your purchase history, order receipts, and line item breakdowns</p>
        </div>

        <button onClick={fetchOrders} className="btn-secondary">
          <span>Refresh</span>
        </button>
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
          <p>Retrieving your order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <Package size={54} className="empty-icon" />
          <h3>No orders placed yet</h3>
          <p>When you checkout items from your cart, they will appear here with full receipt details.</p>
          <Link to="/products" className="btn-primary" style={{ marginTop: '16px' }}>
            <ShoppingBag size={18} />
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isExpanded = !!expandedOrders[order.id];
            const itemCount = (order.items || []).reduce((acc, it) => acc + (it.quantity || 0), 0);

            return (
              <div key={order.id} className="order-card">
                <div className="order-card-header" onClick={() => toggleExpand(order.id)}>
                  <div className="order-header-primary">
                    <div className="order-id-badge">
                      <Package size={18} />
                      <span>Order #{order.id}</span>
                    </div>

                    <div className="order-date">
                      <Calendar size={14} />
                      <span>{formatDate(order.orderDate)}</span>
                    </div>
                  </div>

                  <div className="order-header-secondary">
                    <span className="order-status-badge">
                      <CheckCircle size={14} />
                      <span>{order.status || 'CONFIRMED'}</span>
                    </span>

                    <div className="order-total-display">
                      <span className="total-label">Total:</span>
                      <strong className="total-val">${order.totalAmount?.toFixed(2)}</strong>
                    </div>

                    <button
                      type="button"
                      className="btn-expand-toggle"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="order-card-body">
                    <div className="order-items-table">
                      <div className="order-items-head">
                        <span>Item</span>
                        <span>Product ID</span>
                        <span>Unit Price</span>
                        <span>Quantity</span>
                        <span style={{ textAlign: 'right' }}>Total</span>
                      </div>

                      <div className="order-items-content">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div key={item.id || idx} className="order-item-row">
                              <div className="order-item-name">
                                <Tag size={15} />
                                <span>{item.productName || `Product #${item.productId}`}</span>
                              </div>
                              <div className="order-item-sku">#{item.productId}</div>
                              <div>${item.price?.toFixed(2)}</div>
                              <div>× {item.quantity}</div>
                              <div className="order-item-subtotal">
                                ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-items-text">No items recorded for this order.</div>
                        )}
                      </div>
                    </div>

                    <div className="order-card-footer">
                      <div className="footer-stat">
                        <span>Items Count: <strong>{itemCount} items</strong></span>
                      </div>
                      <div className="footer-total">
                        <span>Paid Total: <strong>${order.totalAmount?.toFixed(2)}</strong></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
