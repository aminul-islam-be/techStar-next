import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import OrderStatusBadge from "../components/OrderStatusBadge";

const OPTIONS = [
  { days: 1, label: "1 Day" },
  { days: 7, label: "1 Week" },
  { days: 30, label: "1 Month" },
];

export default function MyHistory() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [retentionDays, setRetentionDays] = useState(30);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }
    if (status === "authenticated") fetchHistory();
  }, [status, router]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/orders/my-history");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        setRetentionDays(data.retentionDays || 30);
      } else {
        alert(data.message || "Failed to load history");
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectRetention = async (days) => {
    if (days === retentionDays) {
      setMenuOpen(false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/user/history-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Could not update setting");
        return;
      }
      setRetentionDays(data.historyRetentionDays);
      setMenuOpen(false);
      await fetchHistory();
    } catch (error) {
      console.error("Retention setting error:", error);
      alert("❌ Could not update history setting");
    } finally {
      setSaving(false);
    }
  };

  const label =
    OPTIONS.find((x) => x.days === retentionDays)?.label || "1 Month";

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Dhaka",
    });

  const daysLeft = (createdAt) => {
    const expiry =
      new Date(createdAt).getTime() + retentionDays * 24 * 60 * 60 * 1000;
    const diff = Math.ceil((expiry - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };

  if (status === "loading" || loading) {
    return (
      <> <Header /> <div className="loading">Loading history...</div> </>
    );
  }

  return (
    <> <Head> <title>My History - TechStar</title> </Head> <Header /> <div className="container"> <div className="headerRow"> <div> <h1>🕘 My Order History</h1> <p className="note"> Auto-delete: <strong>{label}</strong> from the original order date & time. </p> </div> <div className="actions"> <div className="settings"> <button className="menuBtn" onClick={() => setMenuOpen(!menuOpen)} disabled={saving} aria-label="History retention settings" > ⋮ </button> {menuOpen && ( <div className="dropdown"> <div className="menuTitle">Auto-delete after</div> {OPTIONS.map((option) => ( <button key={option.days} className={`menuItem ${ retentionDays === option.days ? "selected" : "" }`} onClick={() => selectRetention(option.days)} disabled={saving} > <span>{option.label}</span> <span>{retentionDays === option.days ? "✓" : ""}</span> </button> ))} </div> )} </div> <Link href="/my-orders" className="backLink"> ← Back to My Orders </Link> </div> </div> {orders.length === 0 ? ( <div className="noOrders"> <p>No orders in your history.</p> </div> ) : ( <div className="ordersList"> {orders.map((order) => ( <div key={order._id} className="orderCard"> <div className="orderHeader"> <div> <span className="orderId"> Order #{order._id.slice(-6)} </span> <div className="orderDate"> Placed: {formatDate(order.createdAt)} </div> </div> <OrderStatusBadge status={order.status} /> </div> <div className="orderDetails"> <span> <strong>Total:</strong> $ {Number(order.totalPrice || 0).toFixed(2)} </span> <Link href={`/orders/${order._id}`} className="detailsLink"> 📋 Details </Link> </div> <div className="expiryNote"> ⏳ Permanently deleted {label.toLowerCase()} after the original order date/time. Approx. {daysLeft(order.createdAt)}{" "} day(s) remaining. </div> </div> ))} </div> )} </div> <style jsx>{` .container { max-width: 900px; margin: 0 auto; padding: 20px 16px; } .headerRow { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; } h1 { font-size: 2rem; color: #333; margin: 0 0 6px; } .note { color: #888; font-size: 0.9rem; margin: 0; } .actions { display: flex; align-items: center; gap: 10px; } .settings { position: relative; } .menuBtn { width: 40px; height: 40px; border: 1px solid #ddd; border-radius: 8px; background: #fff; font-size: 24px; cursor: pointer; line-height: 1; } .dropdown { position: absolute; top: 46px; right: 0; width: 180px; background: #fff; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.14); overflow: hidden; z-index: 100; } .menuTitle { padding: 10px 14px; font-size: 12px; font-weight: 700; color: #888; border-bottom: 1px solid #eee; } .menuItem { width: 100%; display: flex; justify-content: space-between; border: 0; background: #fff; padding: 12px 14px; text-align: left; cursor: pointer; font-size: 14px; } .menuItem:hover, .menuItem.selected { background: #f2f3ff; } .menuItem.selected { color: #667eea; font-weight: 700; } .backLink { color: #667eea; text-decoration: none; font-weight: 600; padding: 9px 14px; border: 1px solid #667eea; border-radius: 8px; white-space: nowrap; } .loading { display: flex; justify-content: center; align-items: center; height: 50vh; color: #666; } .noOrders { text-align: center; padding: 60px 20px; background: #fff; border-radius: 12px; } .ordersList { display: flex; flex-direction: column; gap: 16px; } .orderCard { background: #fff; border-radius: 12px; padding: 20px 24px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); border: 1px solid #f0f0f0; } .orderHeader { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; } .orderId { font-weight: 700; color: #333; } .orderDate { color: #999; font-size: 0.82rem; margin-top: 4px; } .orderDetails { display: flex; justify-content: space-between; align-items: center; gap: 12px; color: #555; } .detailsLink { color: #17a2b8; text-decoration: none; font-weight: 600; } .expiryNote { margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0f0; font-size: 0.84rem; line-height: 1.5; color: #888; } @media (max-width: 600px) { h1 { font-size: 1.5rem; } .actions { width: 100%; justify-content: flex-end; } .orderCard { padding: 16px 18px; } } `}</style> </>
  );
    }
