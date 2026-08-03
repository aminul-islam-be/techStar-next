import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div>
        <Header />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (session?.user?.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin Panel - TechStar</title>
      </Head>
      <Header />
      <div className="container">
        <Link href="/" className="backBtn">← Back to Home</Link>
        
        <div className="adminPanel">
          <h1>🔐 Admin Panel</h1>
          <p className="subtitle">Welcome to TechStar Admin Dashboard</p>
          
          <div className="adminGrid">
            <div className="adminCard">
              <h3>🛒 Products</h3>
              <p>Manage your products</p>
              <Link href="/admin/products" className="btn btn-primary">
                View Products
              </Link>
            </div>
            <div className="adminCard">
              <h3>👥 Users</h3>
              <p>Manage users and vendors</p>
              <Link href="/admin/users" className="btn btn-primary">
                View Users
              </Link>
            </div>
            <div className="adminCard">
              <h3>📦 Orders</h3>
              <p>View and manage orders</p>
              <Link href="/admin/orders" className="btn btn-primary">
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f0f2f5;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 1.2rem;
          color: #666;
        }

        .backBtn {
          color: #666;
          text-decoration: none;
          margin: 20px 0 10px 0;
          font-size: 14px;
          display: inline-block;
          align-self: flex-start;
        }

        .backBtn:hover {
          color: #333;
        }

        .adminPanel {
          background: white;
          padding: 30px 24px;
          border-radius: 16px;
          box-shadow: 0 5px 30px rgba(0,0,0,0.08);
          width: 100%;
          max-width: 900px;
          margin-bottom: 30px;
        }

        h1 {
          margin: 0 0 8px 0;
          font-size: 2rem;
          color: #333;
        }

        .subtitle {
          color: #666;
          margin-bottom: 24px;
          font-size: 1rem;
        }

        .adminGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 12px;
        }

        .adminCard {
          padding: 24px 16px;
          text-align: center;
          background: #f8f9fa;
          border-radius: 10px;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .adminCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
        }

        .adminCard h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 1.1rem;
        }

        .adminCard p {
          margin: 0 0 14px 0;
          color: #666;
          font-size: 0.9rem;
        }

        .btn {
          display: inline-block;
          padding: 8px 18px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          text-decoration: none;
          transition: background 0.3s;
        }

        .btn:hover {
          background: #5a6fd6;
        }

        @media (max-width: 600px) {
          .adminPanel {
            padding: 20px 16px;
          }

          h1 {
            font-size: 1.5rem;
          }

          .adminGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
    }
