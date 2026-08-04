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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
    images: [],
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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'techstar_products');

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      }

      setImageUrls((prev) => [...prev, ...uploadedUrls]);
      setImagePreview((prev) => [...prev, ...uploadedUrls]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
          images: formData.images,
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

          {/* ✅ Image Upload Section */}
          <div className="formGroup">
            <label>Upload Product Images</label>
            <div className="imageUploadWrapper">
              <div className="imageUploadBox">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="imageInput"
                  id="imageInput"
                  disabled={uploading}
                />
                <label htmlFor="imageInput" className="imageUploadLabel">
                  <span className="uploadIcon">📷</span>
                  <span>{uploading ? 'Uploading...' : 'Click to upload images'}</span>
                  <span className="uploadHint">PNG, JPG, WEBP (Max 5MB)</span>
                </label>
              </div>
              {imagePreview.length > 0 && (
                <div className="imagePreviewContainer">
                  {imagePreview.map((url, index) => (
                    <div key={index} className="imagePreviewItem">
                      <img src={url} alt={`Preview ${index}`} />
                      <button
                        type="button"
                        className="removeImageBtn"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading || uploading} className="btn btn-primary">
            {loading ? 'Creating...' : uploading ? 'Uploading...' : 'Create Product'}
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
          width: 100%;
          padding: 12px;
          font-size: 16px;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        /* ===== Image Upload Styles ===== */
        .imageUploadWrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .imageUploadBox {
          border: 2px dashed #ddd;
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          transition: border-color 0.3s;
          position: relative;
          background: #fafafa;
        }

        .imageUploadBox:hover {
          border-color: #667eea;
        }

        .imageInput {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }

        .imageInput:disabled {
          cursor: not-allowed;
        }

        .imageUploadLabel {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #666;
        }

        .uploadIcon {
          font-size: 40px;
        }

        .uploadHint {
          font-size: 12px;
          color: #999;
        }

        .imagePreviewContainer {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .imagePreviewItem {
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e0e0e0;
        }

        .imagePreviewItem img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .removeImageBtn {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(220, 53, 69, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }

        .removeImageBtn:hover {
          background: #c82333;
        }

        @media (max-width: 600px) {
          .formRow {
            grid-template-columns: 1fr;
          }

          .imagePreviewItem {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </>
  );
        }
