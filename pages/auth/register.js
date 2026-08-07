import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.message || "Registration failed");
        return;
      }
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => router.push("/auth/login"), 1200);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <> <Head> <title>Register - TechStar</title> </Head> <div className="container"> <div className="card"> <h1>ðŸš€ Create Account</h1> <p className="sub">Phone number is your login ID</p> {error && <div className="error">{error}</div>} {success && <div className="success">{success}</div>} <form onSubmit={submit}> {["name", "phone", "email", "password", "confirmPassword"].map( (field) => ( <div className="group" key={field}> <label> {field === "name" ? "Full Name" : field === "phone" ? "Phone Number" : field === "email" ? "Email Address" : field === "password" ? "Password" : "Confirm Password"} </label> <input type={ field === "email" ? "email" : field.includes("password") ? "password" : field === "phone" ? "tel" : "text" } name={field} value={form[field]} onChange={change} required placeholder={field === "phone" ? "01XXXXXXXXX" : ""} /> </div> ) )} <button className="btn" disabled={loading}> {loading ? "Creating account..." : "Create Account"} </button> </form> <p className="foot"> Already have an account? <Link href="/auth/login">Login</Link> </p> </div> </div> <style jsx>{` .container { min-height: 100vh; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; } .card { background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); width: 100%; max-width: 440px; } h1 { text-align: center; color: #333; margin: 0 0 8px; } .sub, .foot { text-align: center; color: #666; } .sub { margin-bottom: 22px; } .error, .success { padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; } .error { background: #fee; color: #c00; } .success { background: #efe; color: #080; } .group { margin-bottom: 14px; } .group label { display: block; margin-bottom: 6px; font-weight: 600; color: #333; font-size: 14px; } .group input { width: 100%; padding: 11px 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px; box-sizing: border-box; } .group input:focus { outline: none; border-color: #667eea; } .btn { width: 100%; padding: 12px; border: 0; border-radius: 8px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; font-size: 16px; font-weight: 600; } .btn:disabled { opacity: 0.6; } .foot { font-size: 14px; margin-top: 20px; } .foot a { color: #667eea; font-weight: 600; text-decoration: none; } @media (max-width: 480px) { .card { padding: 24px 20px; } } `}</style> </>
  );
    }
