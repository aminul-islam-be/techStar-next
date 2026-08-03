import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';

export default function AdminProducts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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
      fetchProducts();
    }
  }, [status, router, session]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter(p => p._id !== id));
        alert('✅ Product deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Something went wrong');
    } finally {
      setDeleting(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div>
        <Header />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Products - TechStar</title>
      </Head>
      <Header />
      <div className="container">
        <div className="headerRow">
          <h1>📦 Manage Products</h1>
          <Link href="/admin/products/add" className="btn btn-primary">
            + Add New Product
          </Link>
        </div>
        {products.length === 0 ? (
          <div className="noProducts">
            <p>No products found.</p>
            <Link href="/admin/products/add" className="btn btn-primary">
              Add your first product
            </Link>
          </div>
        ) : (
          <div className="tableWrapper">
            <table className="productTable">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={product.isAvailable ? 'statusActive' : 'statusInactive'}>
                        {product.isAvailable ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="actions">
                      <Link href={`/admin/products/edit/${product._id}`} className="btnEdit">
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deleting === product._id}
                        className="btnDelete"
                      >
                        {deleting === product._id ? '...' : '🗑️ Delete'}
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
          margin-bottom: 24px;
        }
        h1 {
          margin: 0;
          font-size: 2rem;
          color: #333;
        }
        .btn {
          display: inline-block;
          padding: 10px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: opacity 0.3s;
        }
        .btn:hover {
          opacity: 0.9;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 50vh;
          font-size: 1.2rem;
          color: #666;
        }
        .noProducts {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .noProducts p {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 20px;
        }
        .tableWrapper {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          overflow-x: auto;
        }
        .productTable {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }
        .productTable th {
          background: #f8f9fa;
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #eaeaea;
        }
        .productTable td {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          color: #555;
        }
        .productTable tr:hover td {
          background: #fafafa;
        }
        .statusActive {
          color: #28a745;
          font-weight: 600;
        }
        .statusInactive {
          color: #dc3545;
          font-weight: 600;
        }
        .actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btnEdit {
          padding: 4px 12px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 13px;
          border: none;
          cursor: pointer;
        }
        .btnEdit:hover {
          background: #5a6fd6;
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
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 600px) {
          .headerRow {
            flex-direction: column;
            align-items: stretch;
          }
          .btn {
            text-align: center;
          }
          .actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
          }
