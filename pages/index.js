import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>TechStar - Electrical & Electronics Marketplace</title>
      </Head>

      <main className="main">
        <div className="hero">
          <h1 className="title">⚡ TechStar</h1>
          <p className="subtitle">
            International Electrical & Electronics E-commerce Platform
          </p>
          
          <div className="buttonGroup">
            <Link href="/admin" className="btn btn-primary">
              🔐 Admin Panel
            </Link>
            <a 
              href="https://github.com/aminul-islam-be/techStar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              📦 GitHub
            </a>
          </div>

          <div className="status">
            <p>✅ Server is running successfully!</p>
            <small>Next.js + Vercel Deployment</small>
          </div>
        </div>

        <div className="features">
          <div className="featureCard">
            <h3>🔌 Electronics</h3>
            <p>Browse thousands of electronic products</p>
          </div>
          <div className="featureCard">
            <h3>🌍 Global</h3>
            <p>Shop from international sellers</p>
          </div>
          <div className="featureCard">
            <h3>🛡️ Secure</h3>
            <p>Safe and secure payments</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 TechStar. All rights reserved.</p>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .hero {
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 60px 40px;
          border-radius: 20px;
          width: 100%;
          max-width: 800px;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }
        .subtitle {
          font-size: 1.5rem;
          opacity: 0.9;
          margin-top: 10px;
        }
        .buttonGroup {
          margin-top: 30px;
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-block;
          padding: 12px 30px;
          background: white;
          color: #764ba2;
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
          transition: transform 0.3s;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }
        .btn:hover {
          transform: scale(1.05);
        }
        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
        }
        .status {
          margin-top: 30px;
          padding: 15px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        .status small {
          opacity: 0.8;
        }
        .features {
          margin-top: 50px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          width: 100%;
          max-width: 800px;
        }
        .featureCard {
          padding: 20px;
          text-align: center;
          background: #f5f5f5;
          border-radius: 10px;
          transition: transform 0.3s;
        }
        .featureCard:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .featureCard h3 {
          margin: 0 0 10px 0;
          color: #333;
        }
        .featureCard p {
          margin: 0;
          color: #666;
        }
        .footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .footer p {
          color: #666;
        }
        @media (max-width: 600px) {
          .title {
            font-size: 2.5rem;
          }
          .subtitle {
            font-size: 1rem;
          }
          .hero {
            padding: 30px 20px;
          }
          .buttonGroup {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  )
                }
