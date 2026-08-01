import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>TechStar - Electrical & Electronics Marketplace</title>
        <meta
          name="description"
          content="TechStar - International Electrical & Electronics E-commerce Platform"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>

      <div className="page">
        <main className="main">
          {/* Hero Section */}
          <section className="hero">
            <div className="heroContent">
              <div className="logoIcon">⚡</div>

              <h1 className="title">TechStar</h1>

              <p className="subtitle">
                International Electrical & Electronics
                <br className="mobileBreak" />
                E-commerce Platform
              </p>

              <div className="buttonGroup">
                <Link href="/admin" className="btn btnPrimary">
                  <span>🔐</span>
                  Admin Panel
                </Link>

                <a
                  href="https://github.com/aminul-islam-be/techStar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btnSecondary"
                >
                  <span>📦</span>
                  GitHub
                </a>
              </div>

              {/* Status */}
              <div className="status">
                <div className="statusTop">
                  <span className="statusDot"></span>
                  <strong>Server is running successfully!</strong>
                </div>

                <small>Next.js + Vercel Deployment</small>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="features">
            <div className="featureCard">
              <div className="featureIcon">🌍</div>
              <div>
                <h3>Global</h3>
                <p>Shop from international sellers</p>
              </div>
            </div>

            <div className="featureCard">
              <div className="featureIcon">🛡️</div>
              <div>
                <h3>Secure</h3>
                <p>Safe and secure payments</p>
              </div>
            </div>

            <div className="featureCard">
              <div className="featureIcon">⚡</div>
              <div>
                <h3>Fast</h3>
                <p>Lightning fast delivery</p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>© 2026 TechStar. All rights reserved.</p>
        </footer>
      </div>

      <style jsx>{`
        /* ================================
           GLOBAL RESET
        ================================= */

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          width: 100%;
          min-height: 100%;
          overflow-x: hidden;
        }

        body {
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Helvetica,
            Arial,
            sans-serif;
          background: #f5f7fb;
        }

        a {
          -webkit-tap-highlight-color: transparent;
        }

        /* ================================
           PAGE
        ================================= */

        .page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at top left,
              rgba(102, 126, 234, 0.08),
              transparent 35%
            ),
            #f5f7fb;
        }

        .main {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: clamp(20px, 5vw, 60px) 16px;
          flex: 1;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* ================================
           HERO
        ================================= */

        .hero {
          width: 100%;
          max-width: 900px;

          border-radius: clamp(18px, 4vw, 28px);

          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(255, 255, 255, 0.16),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #667eea 0%,
              #764ba2 100%
            );

          color: white;

          box-shadow:
            0 20px 60px rgba(80, 70, 150, 0.2),
            0 5px 20px rgba(0, 0, 0, 0.08);

          overflow: hidden;
          position: relative;
        }

        .hero::before {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          top: -100px;
          right: -80px;
        }

        .hero::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          bottom: -100px;
          left: -70px;
        }

        .heroContent {
          width: 100%;
          position: relative;
          z-index: 2;

          padding: clamp(28px, 7vw, 65px)
            clamp(18px, 6vw, 50px);

          text-align: center;
        }

        /* ================================
           LOGO
        ================================= */

        .logoIcon {
          font-size: clamp(2rem, 8vw, 4rem);
          line-height: 1;
          margin-bottom: 10px;

          filter: drop-shadow(
            0 5px 12px rgba(0, 0, 0, 0.15)
          );
        }

        /* ================================
           TITLE
        ================================= */

        .title {
          margin: 0;

          font-size: clamp(
            2.2rem,
            8vw,
            4.2rem
          );

          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -1.5px;

          word-break: break-word;
        }

        .subtitle {
          width: 100%;
          max-width: 700px;

          margin: 16px auto 0;

          font-size: clamp(
            0.9rem,
            3vw,
            1.25rem
          );

          line-height: 1.6;
          font-weight: 400;

          opacity: 0.92;

          overflow-wrap: anywhere;
        }

        .mobileBreak {
          display: none;
        }

        /* ================================
           BUTTONS
        ================================= */

        .buttonGroup {
          width: 100%;

          display: flex;
          justify-content: center;
          align-items: center;

          gap: 14px;

          margin-top: 30px;

          flex-wrap: wrap;
        }

        .btn {
          min-height: 50px;

          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          padding: 13px 24px;

          border-radius: 999px;

          font-size: 15px;
          font-weight: 700;

          text-decoration: none;

          cursor: pointer;

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;

          white-space: nowrap;

          touch-action: manipulation;

          -webkit-user-select: none;
          user-select: none;
        }

        .btn span {
          font-size: 17px;
        }

        .btnPrimary {
          color: #62419b;
          background: #ffffff;

          border: 2px solid #ffffff;

          box-shadow:
            0 8px 20px rgba(0, 0, 0, 0.12);
        }

        .btnSecondary {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.05);

          border: 2px solid rgba(255, 255, 255, 0.9);
        }

        .btn:hover {
          transform: translateY(-3px);
        }

        .btnPrimary:hover {
          box-shadow:
            0 12px 28px rgba(0, 0, 0, 0.18);
        }

        .btnSecondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .btn:active {
          transform: scale(0.97);
        }

        /* ================================
           STATUS
        ================================= */

        .status {
          width: 100%;
          max-width: 520px;

          margin: 28px auto 0;

          padding: 14px 18px;

          border-radius: 14px;

          background: rgba(255, 255, 255, 0.12);

          border: 1px solid
            rgba(255, 255, 255, 0.15);

          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .statusTop {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          font-size: clamp(
            0.82rem,
            2.8vw,
            0.98rem
          );

          line-height: 1.4;
        }

        .statusDot {
          width: 9px;
          height: 9px;

          flex: 0 0 9px;

          border-radius: 50%;

          background: #4ade80;

          box-shadow:
            0 0 0 4px rgba(74, 222, 128, 0.15);

          animation: pulse 2s infinite;
        }

        .status small {
          display: block;

          margin-top: 5px;

          font-size: clamp(
            0.72rem,
            2.4vw,
            0.82rem
          );

          opacity: 0.75;
        }

        @keyframes pulse {
          0% {
            box-shadow:
              0 0 0 0
                rgba(74, 222, 128, 0.4);
          }

          70% {
            box-shadow:
              0 0 0 7px
                rgba(74, 222, 128, 0);
          }

          100% {
            box-shadow:
              0 0 0 0
                rgba(74, 222, 128, 0);
          }
        }

        /* ================================
           FEATURES
        ================================= */

        .features {
          width: 100%;
          max-width: 900px;

          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 18px;

          margin-top: 30px;
        }

        .featureCard {
          width: 100%;
          min-width: 0;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          text-align: center;

          padding: 25px 16px;

          background: #ffffff;

          border: 1px solid
            rgba(0, 0, 0, 0.05);

          border-radius: 18px;

          box-shadow:
            0 6px 25px
              rgba(0, 0, 0, 0.05);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .featureCard:hover {
          transform: translateY(-5px);

          box-shadow:
            0 15px 35px
              rgba(0, 0, 0, 0.1);
        }

        .featureIcon {
          width: 52px;
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-bottom: 12px;

          border-radius: 14px;

          background: #f5f6ff;

          font-size: 25px;
        }

        .featureCard h3 {
          margin: 0 0 7px;

          color: #222;

          font-size: clamp(
            1rem,
            2.5vw,
            1.15rem
          );

          line-height: 1.3;
        }

        .featureCard p {
          margin: 0;

          color: #666;

          font-size: clamp(
            0.78rem,
            2vw,
            0.9rem
          );

          line-height: 1.5;

          overflow-wrap: anywhere;
        }

        /* ================================
           FOOTER
        ================================= */

        .footer {
          width: 100%;
          max-width: 1200px;

          margin: 0 auto;

          padding: 20px 16px 25px;

          text-align: center;

          border-top: 1px solid
            rgba(0, 0, 0, 0.07);
        }

        .footer p {
          margin: 0;

          color: #777;

          font-size: 0.85rem;

          line-height: 1.5;

          overflow-wrap: anywhere;
        }

        /* ================================
           TABLET
        ================================= */

        @media (max-width: 768px) {
          .main {
            padding: 25px 14px 35px;
          }

          .hero {
            max-width: 650px;
          }

          .heroContent {
            padding: 40px 22px;
          }

          .mobileBreak {
            display: block;
          }

          .buttonGroup {
            flex-direction: column;

            width: 100%;

            gap: 10px;
          }

          .btn {
            width: 100%;
            max-width: 340px;
          }

          .features {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 14px;
          }

          .featureCard:last-child {
            grid-column: 1 / -1;

            max-width: 100%;
          }
        }

        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 480px) {
          .main {
            padding: 14px 10px 25px;
          }

          .hero {
            border-radius: 18px;
          }

          .heroContent {
            padding: 30px 15px;
          }

          .logoIcon {
            font-size: 2.5rem;
            margin-bottom: 8px;
          }

          .title {
            font-size: 2rem;
            letter-spacing: -0.8px;
          }

          .subtitle {
            margin-top: 12px;
            font-size: 0.9rem;
            line-height: 1.5;
          }

          .buttonGroup {
            margin-top: 24px;
          }

          .btn {
            max-width: 100%;
            min-height: 48px;
            padding: 12px 16px;
            font-size: 14px;
          }

          .status {
            margin-top: 22px;
            padding: 12px 10px;
          }

          .statusTop {
            font-size: 0.8rem;
          }

          .status small {
            font-size: 0.7rem;
          }

          .features {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-top: 20px;
          }

          .featureCard {
            padding: 19px 14px;

            flex-direction: row;

            text-align: left;

            justify-content: flex-start;

            gap: 14px;
          }

          .featureIcon {
            width: 46px;
            height: 46px;

            flex: 0 0 46px;

            margin: 0;

            font-size: 22px;
          }

          .featureCard h3 {
            font-size: 0.98rem;
            margin-bottom: 4px;
          }

          .featureCard p {
            font-size: 0.8rem;
          }

          .featureCard:last-child {
            grid-column: auto;
          }

          .footer {
            padding: 18px 10px 22px;
          }

          .footer p {
            font-size: 0.75rem;
          }
        }

        /* ================================
           VERY SMALL MOBILE
        ================================= */

        @media (max-width: 360px) {
          .main {
            padding-left: 8px;
            padding-right: 8px;
          }

          .heroContent {
            padding: 25px 12px;
          }

          .logoIcon {
            font-size: 2.2rem;
          }

          .title {
            font-size: 1.75rem;
          }

          .subtitle {
            font-size: 0.78rem;
          }

          .btn {
            min-height: 45px;
            padding: 10px 12px;
            font-size: 13px;
          }

          .statusTop {
            font-size: 0.72rem;
          }

          .status small {
            font-size: 0.65rem;
          }

          .featureCard {
            padding: 15px 12px;
            gap: 10px;
          }

          .featureIcon {
            width: 40px;
            height: 40px;
            flex-basis: 40px;
            font-size: 19px;
          }

          .featureCard h3 {
            font-size: 0.9rem;
          }

          .featureCard p {
            font-size: 0.73rem;
          }
        }

        /* ================================
           LANDSCAPE MOBILE
        ================================= */

        @media (max-height: 600px) and (orientation: landscape) {
          .main {
            padding-top: 15px;
            padding-bottom: 20px;
          }

          .heroContent {
            padding: 25px 20px;
          }

          .logoIcon {
            display: none;
          }

          .title {
            font-size: 2rem;
          }

          .subtitle {
            margin-top: 8px;
          }

          .buttonGroup {
            margin-top: 16px;
            flex-direction: row;
          }

          .btn {
            width: auto;
          }

          .status {
            margin-top: 16px;
          }

          .features {
            margin-top: 18px;
          }
        }

        /* ================================
           REDUCED MOTION
        ================================= */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  )
          }
