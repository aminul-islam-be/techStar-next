import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import CartIcon from './CartIcon';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="header">
      <div className="headerContent">
        <Link href="/" className="logo">
          ⚡ TechStar
        </Link>

        <nav className="nav">
          <CartIcon />

          {session ? (
            <>
              {/* ✅ Customer এর জন্য My Orders & My History */}
              <Link href="/my-orders" className="navLink">
                📦 My Orders
              </Link>
              <Link href="/my-history" className="navLink">
                📜 My History
              </Link>

              {/* ✅ Admin এর জন্য অতিরিক্ত লিংক */}
              {session.user.role === 'admin' && (
                <>
                  <Link href="/admin/order-history" className="navLink">
                    🗑️ Order History
                  </Link>
                  <Link href="/admin/cancelled-orders" className="navLink">
                    ✖️ Cancelled
                  </Link>
                </>
              )}

              <Link href="/auth/profile" className="navLink">
                👤 {session.user.name}
              </Link>
              <button onClick={() => signOut()} className="navLink logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="navLink">Login</Link>
              <Link href="/auth/register" className="navLink register">Register</Link>
            </>
          )}
        </nav>
      </div>

      <style jsx>{`
        .header {
          background: white;
          border-bottom: 1px solid #eaeaea;
          padding: 0 20px;
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
        }

        .headerContent {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          flex-wrap: wrap;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #764ba2;
          text-decoration: none;
        }

        .nav {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .navLink {
          color: #333;
          text-decoration: none;
          font-size: 14px;
          padding: 6px 12px;
          border-radius: 6px;
          transition: background 0.3s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .navLink:hover {
          background: #f0f0f0;
        }

        .register {
          background: #667eea;
          color: white;
        }

        .register:hover {
          background: #5a6fd6;
        }

        .logout {
          color: #e74c3c;
        }

        .logout:hover {
          background: #fee;
        }

        @media (max-width: 600px) {
          .header {
            padding: 0 12px;
          }

          .logo {
            font-size: 1.2rem;
          }

          .nav {
            gap: 6px;
          }

          .navLink {
            font-size: 12px;
            padding: 4px 8px;
          }

          .cartText {
            font-size: 12px !important;
          }
        }
      `}</style>
    </header>
  );
}
