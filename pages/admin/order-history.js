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
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.user?.name || 'Unknown'}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td><OrderStatusBadge status={order.status} /></td>
                    <td>{new Date(order.adminDeletedAt).toLocaleDateString()}</td>
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
        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        th { background: #f8f9fa; padding: 12px 16px; text-align: left; border-bottom: 2px solid #eaeaea; }
        td { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; }
      `}</style>
    </>
  );
          }
