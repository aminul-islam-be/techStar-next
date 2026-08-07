import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/");
  };

  return (
    <> <Head> <title>Login - TechStar</title> </Head> <div className="container"> <div className="authCard"> <h1>🔐 Welcome Back</h1> <p className="subtitle">Login with your phone number</p> {error && <div className="error">{error}</div>} <form onSubmit={handleSubmit}> <div className="formGroup"> <label>Phone Number</label> <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" required /> </div> <div className="formGroup"> <label>Password</label> <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required /> </div> <button className="btn" disabled={loading}> {loading ? "Logging in..." : "Login"} </button> </form> <p className="forgot"> <Link href="/auth/forgot-password">Forgot Password?</Link> </p> <p className="footerText"> Don't have an account? <Link href="/auth/register">Register</Link> </p> </div> </div> <style jsx>{` .container { min-height: 100vh; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; } .authCard { background: #fff; padding: 40px; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); width: 100%; max-width: 420px; } h1 { text-align: center; margin: 0 0 8px; color: #333; } .subtitle, .footerText, .forgot { text-align: center; color: #666; } .subtitle { margin-bottom: 24px; } .error { background: #fee; color: #c00; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; } .formGroup { margin-bottom: 16px; } .formGroup label { display: block; margin-bottom: 6px; font-weight: 600; color: #333; } .formGroup input { width: 100%; padding: 11px 14px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px; box-sizing: border-box; } .formGroup input:focus { outline: none; border-color: #667eea; } .btn { width: 100%; padding: 12px; border: 0; border-radius: 8px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; } .btn:disabled { opacity: 0.6; } .forgot { margin: 16px 0 0; } .forgot a, .footerText a { color: #667eea; font-weight: 600; text-decoration: none; } .footerText { font-size: 14px; margin-top: 20px; } @media (max-width: 480px) { .authCard { padding: 24px 20px; } } `}</style> </>
  );
    }
