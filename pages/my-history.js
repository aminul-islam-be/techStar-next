import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function MyHistory() {
  const { data: session, status } = useSession();
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
      const res = await fetch('/api/orders/my-history');
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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <h1>📜 My History</h1>
        <p className="subtitle">Orders you have deleted (auto-delete after 30 days)</p>

        {orders.length === 0 ? (
          <div className="noHistory">
            <p>No orders in history.</p>
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
                  <div className="orderItems">
                    {order.items.slice(0, 3).map((item, index) => (
                      <span key={index} className="itemName">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="moreItems">+{order.items.length - 3} more</span>
                    )}
                  </div>
                  <div className="orderMeta">
                    <span className="orderTotal">${order.totalPrice.toFixed(2)}</span>
                    <span className="orderDate">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                <div className="deleteInfo">
                  ⏳ Auto-deletes on: {formatDate(order.autoDeleteAt)}
                </div>
              </div>
            ))}
          </div>
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
          margin-bottom: 4px;
        }
        .subtitle {
          color: #999;
          margin-bottom: 24px;
          font-size: 0.95rem;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 1.2rem;
          color: #666;
        }
        .noHistory {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .noHistory p {
          font-size: 1.1rem;
          color: #666;
        }
        .ordersList {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .orderCard {
          background: white;
          border-radius: 12px;
          padding: 20px 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          border: 1px solid #f0f0f0;
        }
        .orderHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .orderId {
          font-weight: 700;
          color: #333;
          font-size: 1.1rem;
        }
        .orderDetails {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .orderItems {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
        }
        .itemName {
          font-size: 0.9rem;
          color: #555;
          background: #f8f9fa;
          padding: 2px 10px;
          border-radius: 4px;
        }
        .moreItems {
          font-size: 0.85rem;
          color: #999;
          font-weight: 500;
        }
        .orderMeta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .orderTotal {
          font-size: 1.2rem;
          font-weight: 700;
          color: #667eea;
        }
        .orderDate {
          font-size: 0.85rem;
          color: #999;
        }
        .deleteInfo {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #f0f0f0;
          font-size: 0.85rem;
          color: #dc3545;
        }
        @media (max-width: 600px) {
          h1 { font-size: 1.5rem; }
          .orderCard { padding: 16px 18px; }
          .orderDetails { flex-direction: column; align-items: flex-start; }
          .orderMeta { width: 100%; justify-content: space-between; }
          .orderId { font-size: 0.95rem; }
          .orderTotal { font-size: 1rem; }
        }
      `}</style>
    </>
  );
        }
