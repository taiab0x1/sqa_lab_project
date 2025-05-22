// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: String,
  category: String,
  image: String,
  status: { type: String, enum: ['Available', 'Not Available'], default: 'Available' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);
