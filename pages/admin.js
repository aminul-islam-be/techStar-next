import Head from 'next/head'
import Link from 'next/link'

export default function Admin() {
  return (
    <div className="container">
      <Head>
        <title>Admin Panel - TechStar</title>
      </Head>

      <main className="main">
        <Link href="/" className="backBtn">← Back to Home</Link>
        
        <div className="adminPanel">
          <h1>🔐 Admin Panel</h1>
          <p className="subtitle">Welcome to TechStar Admin Dashboard</p>
          
          <div className="adminGrid">
            <div className="adminCard">
              <h3>📦 Products</h3>
              <p>Manage your products</p>
              <button className="btn btn-primary">View Products</button>
            </div>
            <div className="adminCard">
              <h3>👥 Users</h3>
              <p>Manage users and vendors</p>
              <button className="btn btn-primary">View Users</button>
            </div>
            <div className="adminCard">
              <h3>📊 Orders</h3>
              <p>View and manage orders</p>
              <button className="btn btn-primary">View Orders</button>
            </div>
            <div className="adminCard">
              <h3>⚙️ Settings</h3>
              <p>Configure your marketplace</p>
              <button className="btn btn-primary">Settings</button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #f0f2f5;
        }
        .main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 1200px;
        }
        .backBtn {
          color: #666;
          text-decoration: none;
          margin-bottom: 20px;
        }
        .backBtn:hover {
          color: #333;
        }
        .adminPanel {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 5px 30px rgba(0,0,0,0.1);
        }
        h1 {
          margin: 0 0 10px 0;
          font-size: 2.5rem;
          color: #333;
        }
        .subtitle {
          color: #666;
          margin-bottom: 30px;
        }
        .adminGrid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .adminCard {
          padding: 30px 20px;
          text-align: center;
          background: #f8f9fa;
          border-radius: 10px;
          transition: transform 0.3s;
        }
        .adminCard:hover {
          transform: translateY(-5px);
        }
        .adminCard h3 {
          margin: 0 0 10px 0;
          color: #333;
        }
        .adminCard p {
          margin: 0 0 15px 0;
          color: #666;
        }
        .btn {
          padding: 10px 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn:hover {
          background: #5a6fd6;
        }
        @media (max-width: 600px) {
          .adminPanel {
            padding: 20px;
          }
          h1 {
            font-size: 1.8rem;
          }
          .adminGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
    }
