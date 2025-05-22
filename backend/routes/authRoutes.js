import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import multer from 'multer';
import { connectToDatabase } from '../lib/db.js';
import User from '../models/User.js'; 
import Product from '../models/Product.js';
import Booking from '../models/Booking.js';
import cloudinary from 'cloudinary';
import fs from 'fs';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // or your preferred config

const auth = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.id;
    req.user = decoded; // Add user details to request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

router.get('/dashproducts', auth, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        _id: user._id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_KEY,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Ignore any role sent from frontend, always set to 'user'
    const user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'user'
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // ...existing error handling...
  }
});

// Update product route
router.put('/products/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateData = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status,
    };

    if (req.file) {
      console.log('Received file:', req.file); // <-- Add this line
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'batteryLow_products'
        });
        updateData.image = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        return res.status(500).json({ message: 'Cloudinary upload failed', error: cloudErr.message });
      }
    } else {
      console.log('No file received for image update.');
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product route
router.delete('/products/:id', auth, async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add product (admin only)
router.post('/products', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product' });
  }
});

// Create a booking
router.post('/bookings', auth, async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, duration, name, phone } = req.body;
    const booking = new Booking({
      equipmentId,
      userId: req.user._id,
      name,
      phone,
      startDate,
      endDate,
      duration
    });
    await booking.save();
    res.status(201).json({ message: 'Booking successful' });
  } catch (error) {
    res.status(500).json({ message: 'Booking failed' });
  }
});

// Admin: Get all bookings
router.get('/bookings', auth, async (req, res) => {
  try {
    // Only admin can view all bookings
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const bookings = await Booking.find().populate('equipmentId').populate('userId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Get user profile by ID (protected route)
router.get('/profile/:id', auth, async (req, res) => {
  try {
    // Only allow users to fetch their own profile or admins to fetch any profile
    if (req.user._id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add admin route
router.post('/add-admin', auth, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const { username, email, password } = req.body;
    const user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'admin'
    });
    await user.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create admin' });
  }
});

export default router;
