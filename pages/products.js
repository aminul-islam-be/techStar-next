import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedProducts = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/products/seed', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.products.length} products added!`);
        await fetchProducts();
      } else {
        alert('❌ Failed to seed products');
      }
    } catch (error) {
      console.error('Seed error:', error);
      alert('❌ Something went wrong');
    } finally {
      setSeeding(false);
    }
  };

  const addToCart = async (productId) => {
    setAdding(prev => ({ ...prev, [productId]: true }));

    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();

      if (data.success) {
        alert('✅ Product added to cart!');
      } else {
        alert(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('❌ Something went wrong');
    } finally {
      setAdding(prev => ({ ...prev, [productId]: false }));
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Products - TechStar</title>
      </Head>
      <Header />
      <div className="container">
        <div className="headerRow">
          <h1>📦 Our Products</h1>
          <button onClick={seedProducts} disabled={seeding} className="seedBtn">
            {seeding ? 'Loading...' : '📥 Load Demo Products'}
          </button>
        </div>

        {products.length === 0 ? (
          <div className="noProducts">
            <p>No products available.</p>
            <p className="hint">Click "Load Demo Products" to add sample products.</p>
          </div>
        ) : (
          <div className="productGrid">
            {products.map((product) => (
              <div key={product._id} className="productCard">
                <div className="productImage">
                  <div className="noImage">📷</div>
                </div>
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product._id)}
                  disabled={adding[product._id] || product.stock === 0}
                  className="addBtn"
                >
                  {adding[product._id] ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 16px;
        }

        .headerRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }

        h1 {
          margin: 0;
          font-size: 2rem;
          color: #333;
        }

        .seedBtn {
          padding: 10px 24px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .seedBtn:hover:not(:disabled) {
          background: #218838;
        }

        .seedBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 1.2rem;
          color: #666;
        }

        .noProducts {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .noProducts p {
          font-size: 1.1rem;
          color: #666;
          margin: 0;
        }

        .noProducts .hint {
          font-size: 0.95rem;
          color: #999;
          margin-top: 8px;
        }

        .productGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }

        .productCard {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          transition: transform 0.3s, box-shadow 0.3s;
          text-align: center;
        }

        .productCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .productImage {
          width: 100%;
          height: 140px;
          background: #f0f2f5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .noImage {
          font-size: 40px;
          color: #ccc;
        }

        .productCard h3 {
          margin: 0 0 4px 0;
          font-size: 0.95rem;
          color: #333;
          min-height: 44px;
        }

        .category {
          margin: 0 0 8px 0;
          font-size: 0.8rem;
          color: #999;
        }

        .price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #667eea;
          margin: 0 0 12px 0;
        }

        .addBtn {
          width: 100%;
          padding: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.3s;
        }

        .addBtn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .addBtn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .headerRow {
            flex-direction: column;
            align-items: stretch;
          }

          .seedBtn {
            width: 100%;
            text-align: center;
          }

          .productGrid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .productCard {
            padding: 12px;
          }

          .productImage {
            height: 100px;
          }

          .productCard h3 {
            font-size: 0.85rem;
            min-height: 38px;
          }
        }
      `}</style>
    </>
  );
          }
