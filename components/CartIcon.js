import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function CartIcon() {
  const { data: session } = useSession();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (session) {
      fetchCartCount();
    }
  }, [session]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart/get');
      const data = await res.json();
      if (data.success) {
        setItemCount(data.cart.totalItems || 0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  return (
    <Link href="/cart" className="cartIcon">
      🛒 <span className="cartText">My Cart</span>
      {itemCount > 0 && <span className="badge">{itemCount}</span>}
      <style jsx>{`
        .cartIcon {
          position: relative;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 1rem;
          text-decoration: none;
          color: #333;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background 0.3s;
        }

        .cartIcon:hover {
          background: #f0f0f0;
        }

        .cartText {
          font-size: 14px;
          font-weight: 500;
        }

        .badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #e74c3c;
          color: white;
          font-size: 11px;
          font-weight: 700;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </Link>
  );
}
