import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";

export default function Checkout() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true),
    [submitting, setSubmitting] = useState(false),
    [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
    phone: "",
    email: "",
    paymentMethod: "cash",
    notes: "",
  });
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (status === "authenticated") {
      fetchCart();
      loadProfile();
    }
  }, [status]);
  async function fetchCart() {
    try {
      const r = await fetch("/api/cart/get");
      const d = await r.json();
      if (d.success) {
        const items = (d.cart.items || []).filter((i) => i.product);
        setCart({ ...d.cart, items });
        if (!items.length) router.push("/cart");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  async function loadProfile() {
    try {
      const r = await fetch("/api/profile");
      const d = await r.json();
      if (r.ok) {
        const p = d.profile || {};
        setForm((f) => ({
          ...f,
          fullName: p.name || f.fullName,
          phone: p.phone || f.phone,
          email: p.email || f.email,
          address: p.permanentAddress || f.address,
          city: p.city || f.city,
          postalCode: p.postalCode || f.postalCode,
          country: p.country || f.country,
        }));
      }
    } catch (e) {
      console.error("Profile prefill error", e);
    }
  }
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const r = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: {
            fullName: form.fullName,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
            country: form.country,
            phone: form.phone,
            email: form.email,
          },
          paymentMethod: form.paymentMethod,
          notes: form.notes,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || "Failed to place order");
      alert("âœ… Order placed successfully!");
      router.push("/products");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }
  if (status === "loading" || loading)
    return (
      <> <Header /> <div className="loading">Loading...</div> </>
    );
  if (!cart.items.length)
    return (
      <> <Header /> <div className="empty"> <h2>Your cart is empty</h2> <Link href="/products" className="btn"> Browse Products </Link> </div> </>
    );
  return (
    <> <Head> <title>Checkout - TechStar</title> </Head> <Header /> <div className="container"> <h1>ðŸ“‹ Checkout</h1> <p className="sub"> Profile information is auto-filled. Changes here apply only to this order. </p> <div className="grid"> <div className="summary"> <h2>Order Summary</h2> {cart.items.map((i) => ( <div className="item" key={i.product._id}> <span> {i.product.name} Ã— {i.quantity} </span> <span>${(i.product.price * i.quantity).toFixed(2)}</span> </div> ))} <div className="total"> <b>Total</b> <b>${cart.totalPrice.toFixed(2)}</b> </div> </div> <form onSubmit={submit} className="form"> {error && <div className="error">{error}</div>} <Field label="Full Name *" name="fullName" value={form.fullName} onChange={change} required /> <Field label="Email Address" name="email" value={form.email} onChange={change} type="email" /> <Field label="Permanent/Delivery Address *" name="address" value={form.address} onChange={change} required /> <div className="row"> <Field label="City *" name="city" value={form.city} onChange={change} required /> <Field label="Postal Code *" name="postalCode" value={form.postalCode} onChange={change} required /> </div> <div className="row"> <Field label="Country" name="country" value={form.country} onChange={change} /> <Field label="Phone *" name="phone" value={form.phone} onChange={change} type="tel" required /> </div> <div className="field"> <label>Payment Method</label> <select name="paymentMethod" value={form.paymentMethod} onChange={change} > <option value="cash">Cash on Delivery</option> <option value="bkash">bKash</option> <option value="nagad">Nagad</option> <option value="rocket">Rocket</option> <option value="sslcommerz">SSLCommerz</option> </select> </div> <div className="field"> <label>Order Notes</label> <textarea name="notes" value={form.notes} onChange={change} rows="3" placeholder="Any special instructions" /> </div> <button className="submit" disabled={submitting}> {submitting ? "Placing Order..." : "âœ… Confirm Order"} </button> </form> </div> </div> <style jsx>{` .container { max-width: 1000px; margin: auto; padding: 24px 16px; } h1 { color: #333; margin-bottom: 4px; } .sub { color: #666; margin-bottom: 24px; } .grid { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; } .summary, .form { background: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); } .summary { height: max-content; } .summary h2 { margin-top: 0; } .item, .total { display: flex; justify-content: space-between; gap: 10px; padding: 9px 0; border-bottom: 1px solid #eee; } .total { border-top: 2px solid #ddd; border-bottom: 0; margin-top: 8px; padding-top: 14px; } .field { margin-bottom: 15px; } .field label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 6px; } .field input, .field select, .field textarea { width: 100%; box-sizing: border-box; padding: 11px 13px; border: 2px solid #e0e0e0; border-radius: 8px; font: inherit; } .field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: #667eea; } .row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; } .error { background: #fee; color: #c00; padding: 12px; border-radius: 8px; margin-bottom: 15px; } .submit, .btn { display: block; width: 100%; padding: 13px; border: 0; border-radius: 9px; background: linear-gradient(135deg, #28a745, #20c997); color: #fff; font-weight: 700; cursor: pointer; text-decoration: none; text-align: center; } .submit:disabled { opacity: 0.6; } .loading { height: 50vh; display: grid; place-items: center; } .empty { text-align: center; padding: 60px 20px; } @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } .row { grid-template-columns: 1fr; } } `}</style> </>
  );
}
function Field({ label, name, value, onChange, type = "text", required = false, }) {
  return (
    <div className="field"> <label>{label}</label> <input type={type} name={name} value={value || ""} onChange={onChange} required={required} /> </div>
  );
    }
