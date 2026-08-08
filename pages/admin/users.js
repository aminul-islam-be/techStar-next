import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      if (session.user.role !== 'admin') {
        router.push('/');
        return;
      }
      fetchUsers();
    }
  }, [status, router, session]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId, newRole) => {
    if (!confirm(`Change role to ${newRole}?`)) return;

    setUpdating(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        alert('✅ Role updated!');
      } else {
        alert(data.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('❌ Something went wrong');
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setDeleting(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u._id !== userId));
        alert('✅ User deleted!');
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Something went wrong');
    } finally {
      setDeleting(null);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.phone?.includes(search)
  );

  if (status === 'loading' || loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Users - TechStar</title>
      </Head>
      <Header />
      <div className="container">
        <div className="headerRow">
          <h1>👥 Manage Users</h1>
          <span className="userCount">Total: {users.length} users</span>
        </div>

        <div className="searchBar">
          <input
            type="text"
            placeholder="🔍 Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="searchInput"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="noUsers">
            <p>No users found.</p>
          </div>
        ) : (
          <div className="tableWrapper">
            <table className="userTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td><span className="userName">{user.name || 'N/A'}</span></td>
                    <td>{user.email || 'N/A'}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        disabled={updating === user._id}
                        className="roleSelect"
                      >
                        <option value="user">👤 User</option>
                        <option value="vendor">🏪 Vendor</option>
                        <option value="admin">👑 Admin</option>
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <Link href={`/admin/users/${user._id}`} className="btnView">
                        👁️ View
                      </Link>
                      <button
                        onClick={() => deleteUser(user._id)}
                        disabled={deleting === user._id}
                        className="btnDelete"
                      >
                        {deleting === user._id ? '...' : '🗑️ Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 16px;
        }
        .headerRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
        }
        h1 {
          margin: 0;
          font-size: 2rem;
          color: #333;
        }
        .userCount {
          font-size: 1rem;
          color: #666;
          background: #f0f2f5;
          padding: 4px 16px;
          border-radius: 20px;
        }
        .searchBar {
          margin-bottom: 20px;
        }
        .searchInput {
          width: 100%;
          padding: 10px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }
        .searchInput:focus {
          outline: none;
          border-color: #667eea;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 1.2rem;
          color: #666;
        }
        .noUsers {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .noUsers p {
          font-size: 1.1rem;
          color: #666;
        }
        .tableWrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow-x: auto;
        }
        .userTable {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }
        .userTable th {
          background: #f8f9fa;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #eaeaea;
        }
        .userTable td {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          color: #555;
        }
        .userTable tr:hover td {
          background: #fafafa;
        }
        .userName {
          font-weight: 500;
          color: #333;
        }
        .roleSelect {
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid #ddd;
          font-size: 13px;
          cursor: pointer;
          background: white;
          font-weight: 500;
        }
        .roleSelect:focus {
          outline: none;
          border-color: #667eea;
        }
        .roleSelect:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btnView {
          padding: 4px 12px;
          background: #17a2b8;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 13px;
          border: none;
          cursor: pointer;
        }
        .btnView:hover {
          background: #138496;
        }
        .btnDelete {
          padding: 4px 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
        }
        .btnDelete:hover:not(:disabled) {
          background: #c82333;
        }
        .btnDelete:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .headerRow {
            flex-direction: column;
            align-items: stretch;
          }
          .userCount {
            text-align: center;
          }
          .actions {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </>
  );
}l
