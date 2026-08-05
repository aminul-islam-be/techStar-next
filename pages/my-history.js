import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function MyHistory() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      fetchHistory();
    }
  }, [status, router]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/orders/history');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka',
    });
  };

  const daysLeft = (deletedAt) => {
    const deleted = new Date(deletedAt);
    const expiry = new Date(deleted.getTime() + 30 * 24 * 60 * 60 * 1000);
    const diff = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading history...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My History - TechStar</title>
      </Head>
      <Header />
      <div className="container">
        <div className="headerRow">
          <h1>🕘 My Order History</h1>
          <Link href="/my-orders" className="backLink">
            ← Back to My Orders
          </Link>
        </div>
        <p className="note">Orders here will be automatically removed 30 days after being cancelled or deleted.</p>

        {orders.length === 0 ? (
          <div className="noOrders">
            <p>No orders in your history.</p>
          </div>
        ) : (
          <div className="ordersList">
            {orders.map((order) => (
              <div key={order._id} className="orderCard">
                <div className="orderHeader">
                  <span className="orderId">Order #{order._id.slice(-6)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="orderDetails">
                  <span>${order.totalPrice.toFixed(2)}</span>
                  <span className="orderDate">{formatDate(order.createdAt)}</span>
                </div>
                <div className="expiryNote">
                  ⏳ Will be permanently deleted in {daysLeft(order.deletedAt)} day(s)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .container { max-width: 900px; margin: 0 auto; padding: 20px 16px; }
        .headerRow { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 8px; }
        h1 { font-size: 2rem; color: #333; margin: 0; }
        .backLink { color: #667eea; text-decoration: none; font-weight: 600; }
        .note { color: #888; font-size: 0.9rem; margin-bottom: 24px; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; font-size: 1.2rem; color: #666; }
        .noOrders { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .ordersList { display: flex; flex-direction: column; gap: 16px; }
        .orderCard { background: white; border-radius: 12px; padding: 20px 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .orderHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .orderId { font-weight: 700; color: #333; }
        .orderDetails { display: flex; justify-content: space-between; color: #555; }
        .expiryNote { margin-top: 10px; padding-top: 10px; border-top: 1px solid #f0f0f0; font-size: 0.85rem; color: #dc3545; }
        @media (max-width: 600px) {
          h1 { font-size: 1.5rem; }
        }
      `}</style>
    </>
  );
    }
