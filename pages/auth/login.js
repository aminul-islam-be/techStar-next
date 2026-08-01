import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
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
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - TechStar</title>
      </Head>

      <div className="container">
        <div className="authCard">
          <h1>🔐 Welcome Back</h1>
          <p className="subtitle">Login to your account</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="socialButtons">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="btn btn-google"
            >
              🅶 Google
            </button>
            <button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className="btn btn-github"
            >
              🐙 GitHub
            </button>
          </div>

          <p className="footerText">
            Don't have an account? <Link href="/auth/register">Register</Link>
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

        .divider {
          text-align: center;
          margin: 20px 0;
          position: relative;
        }

        .divider span {
          background: white;
          padding: 0 12px;
          color: #999;
          font-size: 14px;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e0e0e0;
          z-index: -1;
        }

        .socialButtons {
          display: flex;
          gap: 12px;
        }

        .socialButtons .btn {
          flex: 1;
          padding: 10px;
          font-size: 14px;
        }

        .btn-google {
          background: #fff;
          border: 2px solid #ddd;
          color: #333;
        }

        .btn-google:hover {
          background: #f5f5f5;
        }

        .btn-github {
          background: #333;
          color: white;
        }

        .btn-github:hover {
          background: #444;
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

          .socialButtons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
                  }
