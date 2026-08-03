import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import CartIcon from './CartIcon';  // ← নতুন যোগ করুন

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="header">
      <div className="headerContent">
        <Link href="/" className="logo">
          ⚡ TechStar
        </Link>

        <nav className="nav">
          {/* Cart Icon - সব সময় দেখাবে */}
          <CartIcon />  {/* ← এই লাইন যোগ করুন */}

          {session ? (
            <>
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

      {/* বাকি CSS আগের মতোই থাকবে */}
    </header>
  );
                }
