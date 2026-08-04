import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import { useSession } from 'next-auth/react';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setProduct(data.product);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!session) {
      alert('Please login first');
      router.push('/auth/login');
      return;
    }

    setAdding(true);
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
      const data = await res.json();

      if (data.success) {
        alert('✅ Product added to cart!');
        router.push('/cart');
      } else {
        alert(data.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('❌ Something went wrong');
    } finally {
      setAdding(false);
    }
  };

  const buyNow = async () => {
    if (!session) {
      alert('Please login first');
      router.push('/auth/login');
      return;
    }

    setBuying(true);
    try {
      // প্রথমে কার্টে যোগ করুন
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/checkout');
      } else {
        alert(data.message || 'Failed to proceed');
      }
    } catch (error) {
      console.error('Error buying:', error);
      alert('❌ Something went wrong');
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Header />
        <div className="errorContainer">
          <h2>❌ {error || 'Product not found'}</h2>
          <Link href="/products" className="btn">← Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} - TechStar</title>
      </Head>
      <Header />
      <div className="container">
        <Link href="/products" className="backBtn">← Back to Products</Link>

        <div className="productDetail">
          <div className="productImageWrapper">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="detailImage" />
            ) : (
              <div className="noImage">📷</div>
            )}
          </div>

          <div className="productInfoWrapper">
            <h1>{product.name}</h1>
            <p className="category">{product.category}</p>
            <p className="price">${product.price.toFixed(2)}</p>

            <div className="description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="stockInfo">
              <span className={product.stock > 0 ? 'inStock' : 'outOfStock'}>
                {product.stock > 0 ? `✅ In Stock (${product.stock} available)` : '❌ Out of Stock'}
              </span>
            </div>

            <div className="buttonGroup">
              <button
                onClick={addToCart}
                disabled={adding || product.stock === 0}
                className="btn btn-cart"
              >
                {adding ? 'Adding...' : '🛒 Add to Cart'}
              </button>
              <button
                onClick={buyNow}
                disabled={buying || product.stock === 0}
                className="btn btn-buy"
              >
                {buying ? 'Processing...' : '⚡ Buy Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 16px;
        }

        .backBtn {
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          display: inline-block;
          margin-bottom: 20px;
          transition: color 0.3s;
        }

        .backBtn:hover {
          color: #5a6fd6;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 1.2rem;
          color: #666;
        }

        .errorContainer {
          text-align: center;
          padding: 60px 20px;
        }

        .errorContainer h2 {
          color: #dc3545;
          margin-bottom: 20px;
        }

        .errorContainer .btn {
          display: inline-block;
          padding: 12px 24px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
        }

        .productDetail {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.06);
        }

        .productImageWrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          min-height: 400px;
          border: 1px solid #eee;
        }

        .detailImage {
          max-width: 100%;
          max-height: 400px;
          object-fit: contain;
        }

        .noImage {
          font-size: 80px;
          color: #ccc;
        }

        .productInfoWrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .productInfoWrapper h1 {
          margin: 0;
          font-size: 2rem;
          color: #333;
        }

        .category {
          margin: 0;
          font-size: 0.9rem;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .price {
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
          margin: 0;
        }

        .description {
          margin-top: 8px;
        }

        .description h3 {
          font-size: 1rem;
          color: #333;
          margin-bottom: 8px;
        }

        .description p {
          color: #555;
          line-height: 1.6;
          margin: 0;
        }

        .stockInfo {
          margin: 8px 0;
        }

        .inStock {
          color: #28a745;
          font-weight: 600;
        }

        .outOfStock {
          color: #dc3545;
          font-weight: 600;
        }

        .buttonGroup {
          display: flex;
          gap: 16px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        .btn {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
          min-width: 160px;
        }

        .btn-cart {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-cart:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
        }

        .btn-buy {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
        }

        .btn-buy:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40, 167, 69, 0.35);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        @media (max-width: 768px) {
          .productDetail {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 20px;
          }

          .productImageWrapper {
            min-height: 250px;
          }

          .detailImage {
            max-height: 250px;
          }

          .productInfoWrapper h1 {
            font-size: 1.5rem;
          }

          .price {
            font-size: 1.5rem;
          }

          .buttonGroup {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
        }
