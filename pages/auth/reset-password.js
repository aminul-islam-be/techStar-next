import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
export default function Reset() {
  const router = useRouter();
  const [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [msg, setMsg] = useState(""),
    [err, setErr] = useState(""),
    [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      const r = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: router.query.token, password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message);
      setMsg(d.message);
      setTimeout(() => router.push("/auth/login"), 1200);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <> <Head> <title>Reset Password - TechStar</title> </Head> <div className="page"> <div className="card"> <h1>Reset Password</h1> {err && <div className="error">{err}</div>} {msg && <div className="success">{msg}</div>} <form onSubmit={submit}> <label>New Password</label> <input type="password" minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} required /> <label>Confirm Password</label> <input type="password" minLength="6" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /> <button disabled={loading}> {loading ? "Saving..." : "Reset Password"} </button> </form> <Link href="/auth/login">← Login</Link> </div> </div> <style jsx>{` .page { min-height: 100vh; display: grid; place-items: center; background: #f0f2f5; padding: 20px; } .card { background: #fff; padding: 30px; border-radius: 14px; width: 100%; max-width: 420px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); } label { display: block; font-weight: 600; margin: 14px 0 6px; } input { width: 100%; box-sizing: border-box; padding: 11px; border: 2px solid #ddd; border-radius: 8px; } button { width: 100%; margin: 18px 0; padding: 12px; border: 0; border-radius: 8px; background: #667eea; color: #fff; font-weight: 700; } .error, .success { padding: 10px; border-radius: 8px; margin: 12px 0; } .error { background: #fee; color: #c00; } .success { background: #efe; color: #075; } a { color: #667eea; text-decoration: none; } `}</style> </>
  );
    }
