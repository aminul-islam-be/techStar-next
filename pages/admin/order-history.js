import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';

export default function AdminOrderHistory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchHistory();
    }
  }, [status, router, session]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/orders/admin-history');
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

  const permanentDelete = async (id) => {
    if (!confirm('⚠️ Permanently delete this order from history?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/orders/permanent-delete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter(o => o._id !== id));
        alert('✅ Order permanently deleted!');
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Something went wrong');
    } finally {
      setDeleting(null);
    }
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
        <title>Order History - Admin</title>
      </Head>
      <Header />
      <div className="container">
        <h1>🗑️ Order History</h1>
        <p className="subtitle">Orders deleted by Admin</p>

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
                  <span className="deletedBy">🗑️ Deleted by Admin</span>
                </div>
                <div className="orderDetails">
                  <span>Customer: {order.user?.name || 'Unknown'}</span>
                  <span>Total: ${order.totalPrice.toFixed(2)}</span>
                  <span className="orderDate">
                    Deleted: {new Date(order.deletedAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => permanentDelete(order._id)}
                  disabled={deleting === order._id}
                  className="deleteBtn"
                >
                  {deleting === order._id ? 'Deleting...' : '🗑️ Permanent Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .container { max-width: 900px; margin: 0 auto; padding: 20px 16px; }
        h1 { font-size: 2rem; color: #333; margin-bottom: 4px; }
        .subtitle { color: #999; margin-bottom: 24px; font-size: 0.95rem; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; font-size: 1.2rem; color: #666; }
        .noHistory { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .noHistory p { font-size: 1.1rem; color: #666; }
        .ordersList { display: flex; flex-direction: column; gap: 16px; }
        .orderCard { background: white; border-radius: 12px; padding: 20px 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border: 1px solid #f0f0f0; }
        .orderHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .orderId { font-weight: 700; color: #333; font-size: 1.1rem; }
        .deletedBy { color: #dc3545; font-size: 0.9rem; font-weight: 600; }
        .orderDetails { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; color: #555; }
        .orderDate { font-size: 0.85rem; color: #999; }
        .deleteBtn { margin-top: 12px; padding: 8px 20px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.3s; }
        .deleteBtn:hover:not(:disabled) { background: #c82333; }
        .deleteBtn:disabled { opacity: 0.5; cursor: not-allowed; }
        @media (max-width: 600px) {
          h1 { font-size: 1.5rem; }
          .orderCard { padding: 16px 18px; }
          .orderDetails { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </>
  );
        }
