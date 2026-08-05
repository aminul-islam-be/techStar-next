import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import OrderStatusBadge from '../../components/OrderStatusBadge';

export default function OrderDetail() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated' && id) {
      fetchOrder();
    }
  }, [status, router, id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        alert('Order not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!confirm(`Change status to ${newStatus}?`)) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        alert('✅ Status updated!');
      } else {
        alert(data.message || 'Failed to update');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Dhaka',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  // ✅ Payment Status Display
  const getPaymentStatusDisplay = () => {
    const status = order?.paymentStatus || 'pending';
    if (status === 'pending') {
      return { text: '⏳ Pending', className: 'statusPending' };
    } else if (status === 'paid') {
      return { text: '✅ Paid | Payable: $0', className: 'statusPaid' };
    } else if (status === 'unpaid') {
      return { text: `⚠️ Unpaid | Payable: $${order?.totalPrice?.toFixed(2) || '0.00'}`, className: 'statusUnpaid' };
    }
    return { text: status, className: '' };
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!order) return null;

  const isAdmin = session?.user?.role === 'admin';
  const paymentDisplay = getPaymentStatusDisplay();

  return (
    <>
      <Head>
        <title>Order #{order._id.slice(-6)} - TechStar</title>
      </Head>
      <Header />
      <div className="container" ref={printRef}>
        <div className="topBar">
          <Link href={isAdmin ? '/admin/orders' : '/'} className="backBtn">
            ← {isAdmin ? 'Back to Orders' : 'Back to Home'}
          </Link>
          <div className="actionButtons">
            <button onClick={handlePrint} className="btn btn-print">
              🖨️ Print
            </button>
            <button onClick={handleDownloadPDF} className="btn btn-pdf">
              📄 Download PDF
            </button>
          </div>
        </div>

        <div className="orderHeader">
          <h1>Order #{order._id.slice(-6)}</h1>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="orderMeta">
          <p><strong>📅 Placed on:</strong> {formatDate(order.createdAt)}</p>
        </div>

        <div className="orderGrid">
          <div className="orderInfo">
            <div className="infoSection">
              <h3>👤 Customer Details</h3>
              <div className="detailRow">
                <span className="label">Full Name:</span>
                <span className="value">{order.shippingAddress.fullName}</span>
              </div>
              <div className="detailRow">
                <span className="label">Email:</span>
                <span className="value">{order.user?.email || 'N/A'}</span>
              </div>
              <div className="detailRow">
                <span className="label">Phone:</span>
                <span className="value">{order.shippingAddress.phone}</span>
              </div>
            </div>

            <div className="infoSection">
              <h3>📍 Shipping Address</h3>
              <div className="detailRow">
                <span className="label">Address:</span>
                <span className="value">{order.shippingAddress.address}</span>
              </div>
              <div className="detailRow">
                <span className="label">City:</span>
                <span className="value">{order.shippingAddress.city}</span>
              </div>
              <div className="detailRow">
                <span className="label">Postal Code:</span>
                <span className="value">{order.shippingAddress.postalCode}</span>
              </div>
              <div className="detailRow">
                <span className="label">Country:</span>
                <span className="value">{order.shippingAddress.country}</span>
              </div>
            </div>

            <div className="infoSection">
              <h3>💳 Order Details</h3>
              <div className="detailRow">
                <span className="label">Payment Method:</span>
                <span className="value">{order.paymentMethod}</span>
              </div>
              <div className="detailRow">
                <span className="label">Payment Status:</span>
                <span className={`value ${paymentDisplay.className}`}>
                  {paymentDisplay.text}
                </span>
              </div>
              <div className="detailRow">
                <span className="label">Order Date:</span>
                <span className="value">{formatDate(order.createdAt)}</span>
              </div>
              {order.notes && (
                <div className="detailRow">
                  <span className="label">Notes:</span>
                  <span className="value">{order.notes}</span>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="infoSection">
                <h3>⚙️ Update Status</h3>
                <div className="statusButtons">
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(s)}
                      disabled={updating || order.status === s}
                      className="statusBtn"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="orderItems">
            <h3>🛒 Items</h3>
            <div className="itemsList">
              {order.items.map((item, index) => (
                <div key={index} className="orderItem">
                  <div className="itemInfo">
                    <Link href="/products" className="productLink">
                      <span className="itemName">{item.name}</span>
                      <span className="productArrow">🔗</span>
                    </Link>
                    <span className="itemQty">× {item.quantity}</span>
                  </div>
                  <span className="itemPrice">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="orderTotal">
              <span>Total:</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px 16px;
        }

        .topBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }

        .backBtn {
          color: #666;
          text-decoration: none;
          font-size: 14px;
        }

        .backBtn:hover {
          color: #333;
        }

        .actionButtons {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 8px 18px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s;
        }

        .btn-print {
          background: #6c757d;
          color: white;
        }

        .btn-print:hover {
          background: #5a6268;
        }

        .btn-pdf {
          background: #dc3545;
          color: white;
        }

        .btn-pdf:hover {
          background: #c82333;
        }

        .orderHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 8px;
        }

        .orderMeta {
          margin-bottom: 24px;
          color: #666;
          font-size: 0.95rem;
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

        .orderGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .orderInfo {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .infoSection {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .infoSection h3 {
          margin: 0 0 12px 0;
          font-size: 1.1rem;
          color: #333;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 8px;
        }

        .detailRow {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #f8f9fa;
          font-size: 14px;
        }

        .detailRow:last-child {
          border-bottom: none;
        }

        .detailRow .label {
          color: #888;
          font-weight: 500;
        }

        .detailRow .value {
          color: #333;
          font-weight: 600;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }

        /* ✅ Payment Status Colors */
        .statusPending {
          color: #ffc107;
        }

        .statusPaid {
          color: #28a745;
        }

        .statusUnpaid {
          color: #dc3545;
        }

        .statusButtons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .statusBtn {
          padding: 6px 14px;
          border: 1px solid #667eea;
          background: white;
          color: #667eea;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s;
          text-transform: capitalize;
        }

        .statusBtn:hover:not(:disabled) {
          background: #667eea;
          color: white;
        }

        .statusBtn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .orderItems {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          height: fit-content;
        }

        .orderItems h3 {
          margin: 0 0 16px 0;
          font-size: 1.1rem;
          color: #333;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 8px;
        }

        .itemsList {
          border-bottom: 1px solid #f0f0f0;
        }

        .orderItem {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
          flex-wrap: wrap;
          gap: 8px;
        }

        .orderItem:last-child {
          border-bottom: none;
        }

        .itemInfo {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .productLink {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: #333;
          transition: color 0.3s;
        }

        .productLink:hover {
          color: #667eea;
        }

        .productLink:hover .productArrow {
          transform: translateX(4px);
        }

        .productArrow {
          font-size: 12px;
          transition: transform 0.3s;
          color: #667eea;
        }

        .itemName {
          font-weight: 500;
          color: #333;
        }

        .itemQty {
          color: #999;
          font-size: 14px;
        }

        .itemPrice {
          font-weight: 600;
          color: #333;
        }

        .orderTotal {
          display: flex;
          justify-content: space-between;
          padding: 16px 0 0 0;
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
        }

        @media print {
          .topBar {
            display: none !important;
          }
          .backBtn {
            display: none !important;
          }
          .actionButtons {
            display: none !important;
          }
          .statusButtons {
            display: none !important;
          }
          .header {
            display: none !important;
          }
          .container {
            padding: 20px !important;
            max-width: 100% !important;
          }
          .infoSection {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          .orderItems {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          .btn {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .productLink {
            color: #333 !important;
          }
          .productArrow {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .orderGrid {
            grid-template-columns: 1fr;
          }

          .topBar {
            flex-direction: column;
            align-items: stretch;
          }

          .actionButtons {
            justify-content: center;
          }

          .detailRow {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }

          .detailRow .value {
            text-align: left;
            max-width: 100%;
          }

          .orderItem {
            flex-direction: column;
            align-items: flex-start;
          }

          .itemInfo {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
    }
