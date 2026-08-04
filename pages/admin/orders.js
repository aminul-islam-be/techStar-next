import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import OrderStatusBadge from '../../components/OrderStatusBadge';

export default function AdminOrders() {
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
      fetchOrders();
    }
  }, [status, router, session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter(o => o._id !== id));
        alert('✅ Order deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Something went wrong');
    } finally {
      setDeleting(null);
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
      timeZone: 'Asia/Dhaka',
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
        <title>Admin Orders - TechStar</title>
      </Head>
      <Header />
      <div className="container">
        <div className="headerRow">
          <h1>📦 Manage Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="noOrders">
            <p>No orders found.</p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table className="orderTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>#{index + 1}</td>
                    <td>{order.user?.name || order.shippingAddress?.fullName || 'Unknown'}</td>
                    <td>{order.totalItems}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td><OrderStatusBadge status={order.status} /></td>
                    <td>
                      <span className={order.paymentStatus === 'paid' ? 'statusActive' : 'statusInactive'}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td className="actions">
                      <Link href={`/orders/${order._id}`} className="btnView">
                        👁️ View
                      </Link>
                      <button
                        onClick={() => handleDelete(order._id)}
                        disabled={deleting === order._id}
                        className="btnDelete"
                      >
                        {deleting === order._id ? '...' : '🗑️ Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 1.2rem;
          color: #666;
        }
        .noOrders {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .noOrders p {
          font-size: 1.1rem;
          color: #666;
        }
        .tableWrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow-x: auto;
        }
        .orderTable {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }
        .orderTable th {
          background: #f8f9fa;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #eaeaea;
        }
        .orderTable td {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          color: #555;
        }
        .orderTable tr:hover td {
          background: #fafafa;
        }
        .statusActive {
          color: #28a745;
          font-weight: 600;
        }
        .statusInactive {
          color: #dc3545;
          font-weight: 600;
        }
        .actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btnView {
          padding: 4px 12px;
          background: #17a2b8;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 13px;
          border: none;
          cursor: pointer;
        }
        .btnView:hover {
          background: #138496;
        }
        .btnDelete {
          padding: 4px 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
        }
        .btnDelete:hover:not(:disabled) {
          background: #c82333;
        }
        .btnDelete:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
          }
