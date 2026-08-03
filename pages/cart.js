import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart/get');
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(true);

    try {
      const res = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (productId) => {
    setUpdating(true);

    try {
      const res = await fetch('/api/cart/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <Header />
        <div className="loadingContent">Loading cart...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Cart - TechStar</title>
      </Head>
      <Header />
      <div className="container">
        <h1>🛒 Your Cart</h1>

        {cart.items && cart.items.length === 0 ? (
          <div className="emptyCart">
            <p>Your cart is empty</p>
            <Link href="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="cartItems">
              {cart.items.map((item) => (
                <div key={item.product._id} className="cartItem">
                  <div className="itemInfo">
                    <h3>{item.product.name}</h3>
                    <p className="price">${item.product.price.toFixed(2)}</p>
                  </div>

                  <div className="itemControls">
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      disabled={updating || item.quantity <= 1}
                      className="qtyBtn"
                    >
                      −
                    </button>
                    <span className="qty">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      disabled={updating}
                      className="qtyBtn"
                    >
                      +
                    </button>
                  </div>

                  <div className="itemTotal">
                    <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      disabled={updating}
                      className="removeBtn"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cartSummary">
              <div className="summaryRow">
                <span>Total Items:</span>
                <span>{cart.totalItems}</span>
              </div>
              <div className="summaryRow total">
                <span>Total Price:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <button className="btn btn-primary checkoutBtn">
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px 16px;
        }

        h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 20px;
        }

        .loading {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .loadingContent {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 1.2rem;
          color: #666;
        }

        .emptyCart {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .emptyCart p {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 20px;
        }

        .cartItems {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow: hidden;
        }

        .cartItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          flex-wrap: wrap;
          gap: 12px;
        }

        .cartItem:last-child {
          border-bottom: none;
        }

        .itemInfo {
          flex: 2;
          min-width: 120px;
        }

        .itemInfo h3 {
          margin: 0;
          font-size: 1rem;
          color: #333;
        }

        .itemInfo .price {
          margin: 4px 0 0 0;
          color: #667eea;
          font-weight: 600;
        }

        .itemControls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .qtyBtn {
          width: 32px;
          height: 32px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .qtyBtn:hover:not(:disabled) {
          background: #f0f0f0;
        }

        .qtyBtn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .qty {
          font-size: 1rem;
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }

        .itemTotal {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 100px;
          justify-content: flex-end;
        }

        .itemTotal p {
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .removeBtn {
          background: none;
          border: none;
          color: #e74c3c;
          font-size: 18px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .removeBtn:hover:not(:disabled) {
          background: #fee;
        }

        .removeBtn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .cartSummary {
          margin-top: 20px;
          background: white;
          border-radius: 12px;
          padding: 20px 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .summaryRow {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 1rem;
          color: #555;
        }

        .summaryRow.total {
          font-size: 1.2rem;
          font-weight: 700;
          color: #333;
          border-top: 2px solid #f0f0f0;
          padding-top: 12px;
          margin-top: 4px;
        }

        .checkoutBtn {
          width: 100%;
          margin-top: 16px;
          padding: 14px;
          font-size: 1.1rem;
        }

        .btn {
          display: inline-block;
          padding: 10px 24px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
          text-align: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 600px) {
          .cartItem {
            flex-direction: column;
            align-items: stretch;
          }

          .itemInfo {
            text-align: center;
          }

          .itemControls {
            justify-content: center;
          }

          .itemTotal {
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
      }
