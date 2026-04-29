import React, { useState, useEffect } from 'react';
import './StoreProducts.css';
import ClaimProductModal from './ClaimProductModal';
import { API_URL } from '../config';

const StoreProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);

      const response = await fetch(`${API_URL}/api/store/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Apparel', 'Accessories', 'Supplies', 'Tech', 'Food', 'Other'];

  return (
    <div className="store-products">
      <h2>CampusCruz Store</h2>

      {error && <div className="error-banner">{error}</div>}

      <div className="category-filter">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="no-products">No products available in this category</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onClaim={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ClaimProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => {
            setSelectedProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

const ProductCard = ({ product, onClaim }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.stock <= 0 && <div className="out-of-stock">Out of Stock</div>}
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}

        <div className="product-footer">
          <div className="points-cost">
            <span className="points-icon">⭐</span>
            <span className="points-amount">{product.pointsCost}</span>
          </div>

          <button
            className="claim-btn"
            onClick={onClaim}
            disabled={product.stock <= 0}
          >
            {product.stock <= 0 ? 'Out of Stock' : 'Claim Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreProducts;
