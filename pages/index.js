import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="container">
      <Header />
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
            <Link href="/products" className="btn btn-primary">
              📦 Products
            </Link>
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
            <h3>🌍 Global</h3>
            <p>Shop from international sellers</p>
          </div>
          <div className="featureCard">
            <h3>🛡️ Secure</h3>
            <p>Safe and secure payments</p>
          </div>
          <div className="featureCard">
            <h3>⚡ Fast</h3>
            <p>Lightning fast delivery</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2026 TechStar. All rights reserved.</p>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          min-height: 100vh;
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #f8f9fa;
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }

        .main {
          padding: 2rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 1200px;
        }

        .hero {
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 20px;
          border-radius: 20px;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .title {
          margin: 0;
          line-height: 1.2;
          font-size: 2.8rem;
          word-break: break-word;
          max-width: 100%;
        }

        .subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-top: 10px;
          word-break: break-word;
          max-width: 100%;
        }

        .buttonGroup {
          margin-top: 25px;
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          width: 100%;
        }

        .btn {
          display: inline-block;
          padding: 12px 24px;
          background: white;
          color: #764ba2;
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
          transition: transform 0.3s, box-shadow 0.3s;
          border: none;
          cursor: pointer;
          font-size: 15px;
          min-width: 130px;
          text-align: center;
          box-sizing: border-box;
          flex: 0 1 auto;
        }

        .btn:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 20px rgba(0,0,0,0.2);
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
          margin-top: 25px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .status p {
          word-break: break-word;
        }

        .status small {
          opacity: 0.8;
          display: block;
          margin-top: 4px;
        }

        .features {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          width: 100%;
          max-width: 800px;
          padding: 0 4px;
          box-sizing: border-box;
        }

        .featureCard {
          padding: 20px 12px;
          text-align: center;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          transition: transform 0.3s, box-shadow 0.3s;
          box-sizing: border-box;
          width: 100%;
        }

        .featureCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .featureCard h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 1.1rem;
          word-break: break-word;
        }

        .featureCard p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
          word-break: break-word;
        }

        .footer {
          width: 100%;
          max-width: 1200px;
          padding: 20px 0;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          box-sizing: border-box;
        }

        .footer p {
          color: #666;
          font-size: 0.9rem;
          text-align: center;
          word-break: break-word;
          padding: 0 16px;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 28px 14px;
            border-radius: 16px;
          }

          .title {
            font-size: 2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .btn {
            padding: 10px 18px;
            font-size: 14px;
            min-width: 110px;
          }

          .features {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 8px;
          }

          .hero {
            padding: 20px 12px;
            border-radius: 12px;
          }

          .title {
            font-size: 1.6rem;
          }

          .subtitle {
            font-size: 0.85rem;
          }

          .features {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .btn {
            padding: 10px 14px;
            font-size: 13px;
            min-width: 90px;
            flex: 1 1 100%;
          }

          .buttonGroup {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            gap: 8px;
          }

          .footer p {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
                }
