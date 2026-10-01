import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Package,
  Plus,
  Search,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Layers
} from 'lucide-react';

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: ''
  });
  const [creating, setCreating] = useState(false);
  const [modalError, setModalError] = useState('');

  // Cart action state
  const [quantities, setQuantities] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, val) => {
    const parsed = parseInt(val, 10);
    setQuantities((prev) => ({
      ...prev,
      [productId]: isNaN(parsed) || parsed < 1 ? 1 : parsed
    }));
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please log in to add items to your cart.' } });
      return;
    }

    const qty = quantities[product.id] || 1;
    if (qty > product.quantity) {
      setToastMessage({ type: 'error', text: `Only ${product.quantity} items available in stock.` });
      setTimeout(() => setToastMessage(''), 3500);
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [product.id]: true }));
      await addToCart(product.id, qty);
      setToastMessage({
        type: 'success',
        text: `Added ${qty} × "${product.name}" to cart!`
      });
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      setToastMessage({ type: 'error', text: err.message || 'Failed to add item to cart.' });
      setTimeout(() => setToastMessage(''), 3500);
    } finally {
      setActionLoading((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setModalError('');
    setCreating(true);

    try {
      const payload = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity, 10)
      };

      if (!payload.name || isNaN(payload.price) || isNaN(payload.quantity)) {
        throw new Error('Please fill in valid name, price, and stock quantity.');
      }

      await productApi.create(payload);
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', price: '', quantity: '' });
      fetchProducts();
      setToastMessage({ type: 'success', text: `Product "${payload.name}" added successfully!` });
      setTimeout(() => setToastMessage(''), 3500);
    } catch (err) {
      setModalError(err.message || 'Failed to create product.');
    } finally {
      setCreating(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`toast-notification ${toastMessage.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toastMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Hero / Header Section */}
      <div className="page-header">
        <div className="header-info">
          <h1>Product Catalog</h1>
          <p>Explore high quality retail goods, check real-time inventory, and add to cart</p>
        </div>

        <div className="header-actions">
          {isAuthenticated && (
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              <Plus size={18} />
              <span>Add New Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="search-filter-bar">
        <div className="search-input-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="search-clear-btn">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="catalog-meta">
          <Layers size={18} />
          <span>Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}</span>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading catalog items from server...</p>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchProducts} className="btn-outline-sm" style={{ marginLeft: 'auto' }}>
            Retry
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <Package size={48} className="empty-icon" />
          <h3>No products found</h3>
          <p>Try refining your search query or add a new product to the catalog.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => {
            const qty = quantities[product.id] || 1;
            const isOutOfStock = product.quantity <= 0;
            const isBusy = actionLoading[product.id];

            return (
              <div key={product.id} className="product-card">
                <div className="product-card-body">
                  <div className="product-category-tag">
                    <Sparkles size={13} />
                    <span>In Stock: {product.quantity}</span>
                  </div>

                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description || 'No description provided.'}</p>

                  <div className="product-pricing">
                    <span className="price-currency">$</span>
                    <span className="price-amount">{product.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="product-card-footer">
                  <div className="quantity-control">
                    <label htmlFor={`qty-${product.id}`}>Qty:</label>
                    <input
                      id={`qty-${product.id}`}
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={qty}
                      disabled={isOutOfStock || isBusy}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock || isBusy}
                    className={`btn-add-cart ${isOutOfStock ? 'disabled' : ''}`}
                  >
                    <ShoppingCart size={16} />
                    <span>{isOutOfStock ? 'Out of Stock' : isBusy ? 'Adding...' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-title">
                <Package size={20} />
                <h3>Add New Product</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="alert alert-error" style={{ margin: '16px 24px 0' }}>
                <AlertCircle size={16} />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="modal-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Ergonomic Mouse"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Product specs, features, warranty..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="49.99"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Initial Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="25"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Saving...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
