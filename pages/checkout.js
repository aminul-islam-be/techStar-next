import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
    phone: '',
    paymentMethod: 'cash',
    notes: '',
  });

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
        // ✅ Safety Check: product null/undefined হলে ফিল্টার করুন
        const validItems = data.cart.items.filter((item) => item.product);
        setCart({
          ...data.cart,
          items: validItems,
        });
        if (validItems.length === 0) {
          router.push('/cart');
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            phone: formData.phone,
          },
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Order placed successfully!');
        router.push('/products');
      } else {
        setError(data.message || 'Failed to place order');
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // ✅ Safety Check: কার্ট খালি হলে
  if (!cart.items || cart.items.length === 0) {
    return (
      <div>
        <Header />
        <div className="empty">
          <h2>Your cart is empty</h2>
          <Link href="/products" className="btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout - TechStar</title>
      </Head>
      <Header />
      <div className="container">
        <h1 className="pageTitle">📋 Checkout</h1>
        <p className="pageSubtitle">Complete your order</p>

        <div className="checkoutGrid">
          <div className="orderSummary">
            <h2>Order Summary</h2>
            {cart.items
              .filter((item) => item.product)
              .map((item) => (
                <div key={item.product._id} className="summaryItem">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            <div className="summaryTotal">
              <span>Total:</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="checkoutForm">
            {error && <div className="error">{error}</div>}

            <div className="formGroup">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="formGroup">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
              />
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                />
              </div>
              <div className="formGroup">
                <label>Postal Code *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="Postal code"
                />
              </div>
            </div>

            <div className="formRow">
              <div className="formGroup">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>
              <div className="formGroup">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="formGroup">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="cash">Cash on Delivery</option>
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="sslcommerz">SSLCommerz</option>
              </select>
            </div>

            <div className="formGroup">
              <label>Order Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special instructions"
                rows="3"
              />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary checkoutSubmit">
              {submitting ? '⏳ Placing Order...' : '✅ Confirm Order'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px 16px;
        }

        .pageTitle {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 4px;
        }

        .pageSubtitle {
          color: #666;
          margin-bottom: 24px;
          font-size: 1.1rem;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 1.2rem;
          color: #666;
        }

        .empty {
          text-align: center;
          padding: 60px 20px;
        }

        .empty h2 {
          color: #666;
          margin-bottom: 20px;
        }

        .btn {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-weight: 600;
        }

        .checkoutGrid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 30px;
        }

        .orderSummary {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          height: fit-content;
        }

        .orderSummary h2 {
          margin: 0 0 16px 0;
          font-size: 1.2rem;
          color: #333;
        }

        .summaryItem {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
          color: #555;
        }

        .summaryTotal {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: #333;
          border-top: 2px solid #eaeaea;
          margin-top: 8px;
        }

        .checkoutForm {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .error {
          background: #fee;
          color: #c00;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .formGroup {
          margin-bottom: 16px;
        }

        .formGroup label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .formGroup input,
        .formGroup textarea,
        .formGroup select {
          width: 100%;
          padding: 10px 14px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
          box-sizing: border-box;
          font-family: inherit;
        }

        .formGroup input:focus,
        .formGroup textarea:focus,
        .formGroup select:focus {
          outline: none;
          border-color: #667eea;
        }

        .formRow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .checkoutSubmit {
          width: 100%;
          padding: 14px;
          font-size: 1.1rem;
          font-weight: 700;
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border-radius: 12px;
          transition: all 0.3s;
          border: none;
          color: white;
          cursor: pointer;
        }

        .checkoutSubmit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }

        .checkoutSubmit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .checkoutGrid {
            grid-template-columns: 1fr;
          }
          .formRow {
            grid-template-columns: 1fr;
          }
          .pageTitle {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
}
