import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - TechStar</title>
      </Head>

      <div className="container">
        <div className="authCard">
          <h1>🚀 Create Account</h1>
          <p className="subtitle">Join TechStar today</p>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="formGroup">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="formGroup">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div className="formGroup">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="footerText">
            Already have an account? <Link href="/auth/login">Login</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .authCard {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          width: 100%;
          max-width: 420px;
        }

        h1 {
          margin: 0 0 8px 0;
          font-size: 2rem;
          text-align: center;
          color: #333;
        }

        .subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 24px;
        }

        .error {
          background: #fee;
          color: #c00;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .success {
          background: #efe;
          color: #0a0;
          padding: 10px 14px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .formGroup {
          margin-bottom: 16px;
        }

        .formGroup label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .formGroup input {
          width: 100%;
          padding: 10px 14px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }

        .formGroup input:focus {
          outline: none;
          border-color: #667eea;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .footerText {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 14px;
        }

        .footerText a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .footerText a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .authCard {
            padding: 24px 20px;
          }

          h1 {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </>
  );
                  }
