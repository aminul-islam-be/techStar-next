import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="loading">Loading...</div>;
  }

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile - TechStar</title>
      </Head>

      <div className="container">
        <div className="profileCard">
          <Link href="/" className="backBtn">← Back to Home</Link>
          
          <div className="avatar">
            <div className="avatarIcon">👤</div>
          </div>

          <h1>My Profile</h1>
          
          <div className="profileInfo">
            <div className="infoRow">
              <span className="label">Name</span>
              <span className="value">{session.user.name}</span>
            </div>
            <div className="infoRow">
              <span className="label">Email</span>
              <span className="value">{session.user.email}</span>
            </div>
            <div className="infoRow">
              <span className="label">Role</span>
              <span className="value role">{session.user.role || 'User'}</span>
            </div>
          </div>

          <button onClick={() => signOut()} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f0f2f5;
          padding: 20px;
        }

        .profileCard {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 460px;
          text-align: center;
        }

        .backBtn {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          display: inline-block;
          margin-bottom: 20px;
        }

        .backBtn:hover {
          color: #333;
        }

        .avatar {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }

        .avatarIcon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 40px;
          color: white;
        }

        h1 {
          margin: 0 0 24px 0;
          font-size: 1.8rem;
          color: #333;
        }

        .profileInfo {
          text-align: left;
          margin-bottom: 24px;
        }

        .infoRow {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }

        .infoRow:last-child {
          border-bottom: none;
        }

        .label {
          color: #666;
          font-weight: 500;
        }

        .value {
          color: #333;
          font-weight: 600;
        }

        .role {
          background: #667eea;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .btn-danger {
          background: #e74c3c;
          color: white;
        }

        .btn-danger:hover {
          background: #c0392b;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-size: 1.2rem;
          color: #666;
        }

        @media (max-width: 480px) {
          .profileCard {
            padding: 24px 20px;
          }

          h1 {
            font-size: 1.4rem;
          }

          .infoRow {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
    }
