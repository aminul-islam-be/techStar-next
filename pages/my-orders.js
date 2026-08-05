import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function MyOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/my-orders');
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

  // ✅ Payment Status অনুযায়ী Text ও Style
  const getPaymentStatusDisplay = (order) => {
    const status = order.paymentStatus || 'pending';
    
    if (status === 'pending') {
      return {
        text: '⏳ Order in Processing',
        className: 'statusPending'
      };
    } else if (status === 'paid') {
      return {
        text: '✅ Order Complete | Payable: $0',
        className: 'statusPaid'
      };
    } else if (status === 'unpaid') {
      return {
        text: `✅ Order Complete | ⚠️ Payable: $${order.totalPrice.toFixed(2)}`,
        className: 'statusUnpaid'
      };
    }
    return { text: '', className: '' };
  };

  // ✅ Delete Order (শুধু My Orders থেকে সরাবে)
  const handleDelete = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order from your list?')) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.filter(o => o._id !== orderId));
        alert('✅ Order deleted from your list!');
      } else {
        alert(data.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Something went wrong');
    } finally {
      setProcessing(false);
      setMenuOpen(null);
    }
  };

  // ✅ Cancel Order (Admin-এ Cancelled দেখাবে)
  const handleCancel = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      const data = await res.json();
      if (data.success) {
        // অর্ডার লিস্ট আপডেট করুন
        setOrders(orders.map(o => 
          o._id === orderId ? { ...o, status: 'cancelled' } : o
        ));
        alert('✅ Order cancelled successfully!');
        // Admin Panel-এ Cancelled দেখাবে
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('❌ Something went wrong');
    } finally {
      setProcessing(false);
      setMenuOpen(null);
    }
  };

  const toggleMenu = (orderId) => {
    setMenuOpen(menuOpen === orderId ? null : orderId);
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Orders - TechStar</title>
      </Head>
      <Header />
      <div className="container">
        <h1>📦 My Orders</h1>

        {orders.length === 0 ? (
          <div className="noOrders">
            <p>You haven't placed any orders yet.</p>
            <Link href="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="ordersList">
            {orders.map((order) => {
              const paymentDisplay = getPaymentStatusDisplay(order);
              return (
                <div key={order._id} className="orderCard">
                  <div className="orderHeader">
                    <span className="orderId">Order #{order._id.slice(-6)}</span>
                    <div className="headerRight">
                      <OrderStatusBadge status={order.status} />
                      {/* ✅ ৩টি ডট মেনু */}
                      <div className="menuWrapper">
                        <button 
                          className="menuBtn" 
                          onClick={() => toggleMenu(order._id)}
                          disabled={processing}
                        >
                          ⋮
                        </button>
                        {menuOpen === order._id && (
                          <div className="menuDropdown">
                            <button 
                              onClick={() => handleDelete(order._id)}
                              className="menuItem delete"
                              disabled={processing}
                            >
                              🗑️ Delete
                            </button>
                            <button 
                              onClick={() => handleCancel(order._id)}
                              className="menuItem cancel"
                              disabled={processing || order.status === 'cancelled'}
                            >
                              ✖️ Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
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

                  <div className={`orderPaymentStatus ${paymentDisplay.className}`}>
                    {paymentDisplay.text}
                  </div>
                </div>
              );
            })}
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
          margin-bottom: 24px;
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
          margin-bottom: 20px;
        }

        .btn {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
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
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid #f0f0f0;
          position: relative;
        }

        .orderCard:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border-color: #667eea;
        }

        .orderHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .orderId {
          font-weight: 700;
          color: #333;
          font-size: 1.1rem;
        }

        /* ✅ ৩টি ডট মেনু */
        .menuWrapper {
          position: relative;
        }

        .menuBtn {
          background: none;
          border: none;
          font-size: 1.3rem;
          cursor: pointer;
          padding: 0 6px;
          color: #666;
          transition: color 0.3s;
          line-height: 1;
        }

        .menuBtn:hover {
          color: #333;
        }

        .menuBtn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .menuDropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          min-width: 160px;
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
        }

        .menuItem:hover {
          background: #f8f9fa;
        }

        .menuItem.delete {
          color: #dc3545;
        }

        .menuItem.delete:hover {
          background: #fee;
        }

        .menuItem.cancel {
          color: #e74c3c;
        }

        .menuItem.cancel:hover {
          background: #fde8e8;
        }

        .menuItem:disabled {
          opacity: 0.4;
          cursor: not-allowed;
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

        .orderPaymentStatus {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #f0f0f0;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .statusPending {
          color: #ffc107;
        }

        .statusPaid {
          color: #28a745;
        }

        .statusUnpaid {
          color: #dc3545;
        }

        @media (max-width: 600px) {
          h1 {
            font-size: 1.5rem;
          }

          .orderCard {
            padding: 16px 18px;
          }

          .orderDetails {
            flex-direction: column;
            align-items: flex-start;
          }

          .orderMeta {
            width: 100%;
            justify-content: space-between;
          }

          .orderId {
            font-size: 0.95rem;
          }

          .orderTotal {
            font-size: 1rem;
          }

          .orderPaymentStatus {
            font-size: 0.85rem;
          }

          .menuDropdown {
            right: -10px;
            min-width: 140px;
          }
        }
      `}</style>
    </>
  );
    }
