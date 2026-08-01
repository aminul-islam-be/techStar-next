import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>TechStar - Electrical & Electronics Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        /* Reset and Base */
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

        /* Hero Section */
        .hero {
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 24px;
          border-radius: 20px;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
          word-break: break-word;
        }

        .subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-top: 10px;
          word-break: break-word;
        }

        .buttonGroup {
          margin-top: 25px;
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-block;
          padding: 12px 28px;
          background: white;
          color: #764ba2;
          text-decoration: none;
          border-radius: 30px;
          font-weight: bold;
          transition: transform 0.3s, box-shadow 0.3s;
          border: none;
          cursor: pointer;
          font-size: 15px;
          min-width: 140px;
          text-align: center;
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
          padding: 12px 20px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }

        .status small {
          opacity: 0.8;
          display: block;
          margin-top: 4px;
        }

        /* Features */
        .features {
          margin-top: 40px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          width: 100%;
          max-width: 800px;
          padding: 0 8px;
        }

        .featureCard {
          padding: 20px 16px;
          text-align: center;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .featureCard:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .featureCard h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 1.1rem;
        }

        .featureCard p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        /* Footer */
        .footer {
          width: 100%;
          max-width: 1200px;
          padding: 20px 0;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }

        .footer p {
          color: #666;
          font-size: 0.9rem;
          text-align: center;
        }

        /* ✅ Mobile Responsive (ফিক্স) */
        @media (max-width: 768px) {
          .container {
            padding: 0 12px;
          }

          .hero {
            padding: 30px 16px;
            border-radius: 16px;
          }

          .title {
            font-size: 2.2rem;
          }

          .subtitle {
            font-size: 1rem;
          }

          .buttonGroup {
            gap: 10px;
          }

          .btn {
            padding: 10px 20px;
            font-size: 14px;
            min-width: 120px;
          }

          .features {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            padding: 0 4px;
          }

          .featureCard {
            padding: 16px 12px;
          }

          .featureCard h3 {
            font-size: 1rem;
          }

          .featureCard p {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 1.8rem;
          }

          .subtitle {
            font-size: 0.9rem;
          }

          .features {
            grid-template-columns: 1fr;
          }

          .btn {
            padding: 10px 16px;
            font-size: 13px;
            min-width: 100px;
            width: 100%;
          }

          .buttonGroup {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }

          .hero {
            padding: 24px 12px;
          }

          .status {
            padding: 10px 16px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}
