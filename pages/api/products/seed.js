import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const demoProducts = [
      {
        name: 'Smart LED Bulb',
        description: 'Energy efficient smart LED bulb with WiFi control',
        price: 12.99,
        category: 'Electronics',
        stock: 50,
        vendor: '507f1f77bcf86cd799439011',
        images: [],
        isAvailable: true,
      },
      {
        name: 'Wireless Charger',
        description: 'Fast wireless charging pad for all devices',
        price: 24.99,
        category: 'Electronics',
        stock: 30,
        vendor: '507f1f77bcf86cd799439011',
        images: [],
        isAvailable: true,
      },
      {
        name: 'HDMI Cable 2m',
        description: 'High speed HDMI cable with 4K support',
        price: 8.99,
        category: 'Components',
        stock: 100,
        vendor: '507f1f77bcf86cd799439011',
        images: [],
        isAvailable: true,
      },
      {
        name: 'USB-C Hub 6-in-1',
        description: 'Multiport USB-C hub with HDMI, USB, and SD card',
        price: 19.99,
        category: 'Electronics',
        stock: 20,
        vendor: '507f1f77bcf86cd799439011',
        images: [],
        isAvailable: true,
      },
      {
        name: 'Smart Plug WiFi',
        description: 'WiFi smart plug with energy monitoring',
        price: 15.99,
        category: 'Electrical',
        stock: 40,
        vendor: '507f1f77bcf86cd799439011',
        images: [],
        isAvailable: true,
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with 10W output',
        price: 29.99,
        category: 'Electronics',
        stock: 15,
        vendor: '507f1f77bcf86cd799439011',
        images: [],
        isAvailable: true,
      },
    ];

    await Product.deleteMany({});
    const products = await Product.insertMany(demoProducts);

    res.status(201).json({
      success: true,
      message: `${products.length} products seeded successfully`,
      products,
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: error.message || 'Something went wrong' });
  }
}
