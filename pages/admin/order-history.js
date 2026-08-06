import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import OrderStatusBadge from '../../components/OrderStatusBadge';

export default function AdminOrderHistory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
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
  }, [status, session, router]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/orders/admin-history');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching admin history:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = (orderId) => {
    setMenuOpen(menuOpen === orderId ? null : orderId);
  };

  const handlePermanentDelete = async (orderId) => {
    if (!confirm('⚠️ This will PERMANENTLY delete this order. This action cannot be undone. Continue?')) return;

    setDeleting(orderId);
    try {
      const res = await fetch(`/api/orders/admin-history?id=${orderId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter((o) => o._id !== orderId));
        alert('✅ Order permanently deleted!');
      } else {
        alert(data.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Permanent delete error:', error);
      alert('❌ Something went wrong');
    } finally {
      setDeleting(null);
      setMenuOpen(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading...</div>
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
        <div className="headerRow">
          <h1>🗄️ Order History</h1>
          <Link href="/admin/orders" className="backLink">
            ← Back to Manage Orders
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="noOrders">
            <p>No orders in history.</p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Deleted At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.user?.name || 'Unknown'}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td><OrderStatusBadge status={order.status} /></td>
                    <td>{formatDate(order.adminDeletedAt)}</td>
                    <td className="actionsCell">
                      <div className="menuWrapper">
                        <button
                          className="menuBtn"
                          onClick={() => toggleMenu(order._id)}
                          disabled={deleting === order._id}
                        >
                          ⋮
                        </button>
                        {menuOpen === order._id && (
                          <div className="menuDropdown">
                            <Link
                              href={`/orders/${order._id}`}
                              className="menuItem details"
                            >
                              📋 View Details
                            </Link>
                            <button
                              onClick={() => handlePermanentDelete(order._id)}
                              className="menuItem permanentDelete"
                              disabled={deleting === order._id}
                            >
                              {deleting === order._id ? '...' : '🗑️ Permanent Delete'}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .container { max-width: 1000px; margin: 0 auto; padding: 20px 16px; }
        .headerRow { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
        h1 { color: #333; margin: 0; }
        .backLink { color: #667eea; text-decoration: none; font-weight: 600; }
        .loading { display: flex; justify-content: center; align-items: center; height: 50vh; font-size: 1.2rem; color: #666; }
        .noOrders { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; }
        .tableWrapper { background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 700px; }
        th { background: #f8f9fa; padding: 12px 16px; text-align: left; border-bottom: 2px solid #eaeaea; }
        td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; }
        .actionsCell { position: relative; }
        .menuWrapper { position: relative; display: inline-block; }
        .menuBtn {
          background: none;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0 10px;
          color: #666;
          transition: color 0.3s;
          line-height: 1;
        }
        .menuBtn:hover { color: #333; }
        .menuBtn:disabled { opacity: 0.4; cursor: not-allowed; }
        .menuDropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          min-width: 180px;
          z-index: 50;
          overflow: hidden;
          border: 1px solid #f0f0f0;
        }
        .menuItem {
          display: block;
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: none;
          text-align: left;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.2s;
          color: #333;
          text-decoration: none;
        }
        .menuItem:hover { background: #f8f9fa; }
        .menuItem.details { color: #17a2b8; }
        .menuItem.details:hover { background: #e7f7f9; }
        .menuItem.permanentDelete { color: #dc3545; font-weight: 600; }
        .menuItem.permanentDelete:hover { background: #fee; }
        .menuItem:disabled { opacity: 0.4; cursor: not-allowed; }
        @media (max-width: 600px) {
          .menuDropdown { right: -10px; min-width: 160px; }
        }
      `}</style>
    </>
  );
      }
