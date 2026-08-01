import Head from 'next/head'
import Link from 'next/link'

export default function Admin() {
  return (
    <div className="container">
      <Head>
        <title>Admin Panel - TechStar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="main">
        <Link href="/" className="backBtn">← Back to Home</Link>
        
        <div className="adminPanel">
          <h1>🔐 Admin Panel</h1>
          <p className="subtitle">Welcome to TechStar Admin Dashboard</p>
          
          <div className="adminGrid">
            <div className="adminCard">
              <h3>🛒 Products</h3>
              <p>Manage your products</p>
              <button className="btn btn-primary">View Products</button>
            </div>
            <div className="adminCard">
              <h3>🏬 Users</h3>
              <p>Manage users and vendors</p>
              <button className="btn btn-primary">View Users</button>
            </div>
            <div className="adminCard">
              <h3>📦 Orders</h3>
              <p>View and manage orders</p>
              <button className="btn btn-primary">View Orders</button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f0f2f5;
        }

        .main {
          padding: 1.5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1000px;
        }

        .backBtn {
          color: #666;
          text-decoration: none;
          margin-bottom: 16px;
          font-size: 14px;
          display: inline-block;
          padding: 8px 0;
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
        }

        h1 {
          margin: 0 0 8px 0;
          font-size: 2rem;
          color: #333;
          word-break: break-word;
        }

        .subtitle {
          color: #666;
          margin-bottom: 24px;
          font-size: 1rem;
        }

        .adminGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
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
          padding: 8px 18px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.3s;
        }

        .btn:hover {
          background: #5a6fd6;
        }

        /* ✅ Mobile Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 0 12px;
          }

          .adminPanel {
            padding: 20px 16px;
          }

          h1 {
            font-size: 1.6rem;
          }

          .subtitle {
            font-size: 0.9rem;
          }

          .adminGrid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .adminCard {
            padding: 18px 12px;
          }

          .adminCard h3 {
            font-size: 1rem;
          }

          .adminCard p {
            font-size: 0.85rem;
          }

          .btn {
            font-size: 12px;
            padding: 8px 14px;
          }
        }

        @media (max-width: 480px) {
          .adminGrid {
            grid-template-columns: 1fr;
          }

          .adminPanel {
            padding: 16px 12px;
          }

          h1 {
            font-size: 1.4rem;
          }

          .backBtn {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}
