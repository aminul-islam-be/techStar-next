import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../../components/Header';

export default function AddProduct() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    images: '',
  });

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (status === 'authenticated' && session.user.role !== 'admin') {
    router.push('/');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: formData.images ? formData.images.split(',').map(s => s.trim()) : [],
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Product created successfully!');
        router.push('/admin/products');
      } else {
        setError(data.message || 'Failed to create product');
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Product - Admin</title>
      </Head>
      <Header />
      <div className="container">
        <div className="headerRow">
          <h1>➕ Add New Product</h1>
          <Link href="/admin/products" className="btn btn-secondary">
            ← Back to Products
          </Link>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="formGroup">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="formGroup">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter product description"
              rows="4"
            />
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label>Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>

            <div className="formGroup">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="formGroup">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Electronics">Electronics</option>
              <option value="Electrical">Electrical</option>
              <option value="Components">Components</option>
              <option value="Tools">Tools</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="formGroup">
            <label>Image URLs (comma separated)</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
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
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: opacity 0.3s;
        }
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        .btn:hover {
          opacity: 0.9;
        }
        .error {
          background: #fee;
          color: #c00;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .form {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .formGroup {
          margin-bottom: 16px;
        }
        .formGroup label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #333;
        }
        .formGroup input,
        .formGroup textarea,
        .formGroup select {
          width: 100%;
          padding: 10px 14px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .formGroup input:focus,
        .formGroup textarea:focus,
        .formGroup select:focus {
          outline: none;
          border-color: #667eea;
        }
        .formRow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .btn {
          width: 100%;
          padding: 12px;
          font-size: 16px;
        }
        @media (max-width: 600px) {
          .formRow {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
          }
