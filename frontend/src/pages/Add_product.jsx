import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Container,
  Typography,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'tractor',
    image: '',
    status: 'Available'
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    { value: 'tractor', label: 'Tractor' },
    { value: 'harvester', label: 'Harvester' },
    { value: 'cultivator', label: 'Cultivator' },
    { value: 'seeder', label: 'Seeder' },
    { value: 'sprayer', label: 'Sprayer' },
    { value: 'irrigation', label: 'Irrigation Equipment' },
    { value: 'plough', label: 'Plough' },
    { value: 'thresher', label: 'Thresher' },
    { value: 'tools', label: 'Hand Tools' },
    { value: 'storage', label: 'Storage Equipment' },
    { value: 'processing', label: 'Processing Equipment' },
    { value: 'other', label: 'Other Equipment' }
  ];

  // Check admin access
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
    } catch (err) {
      navigate('/login');
    }
  }, [navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'form_img');

    try {
      setUploading(true);
      setError('');
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dqlkmngsz/image/upload',
        formData
      );

      setFormData(prev => ({
        ...prev,
        image: response.data.secure_url
      }));
    } catch (err) {
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Authorization required');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/auth/products',
        {
          ...formData,
          price: `${formData.price}/day`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('Product added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        description: '',
        category: 'tractor',
        image: '',
        status: 'Available'
      });

      // Redirect after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} mb={5}>
        <Typography variant="h4" gutterBottom>
          Add New Equipment
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Daily Price"
            type="number"
            fullWidth
            margin="normal"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {categories.map((category) => (
                <MenuItem 
                  key={category.value} 
                  value={category.value}
                >
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            component="label"
            fullWidth
            style={{ marginTop: 16 }}
          >
            {uploading ? 'Uploading Image...' : 'Upload Image'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>

          {formData.image && (
            <Box mt={2}>
              <Typography variant="subtitle1">Preview:</Typography>
              <img src={formData.image} alt="Uploaded" width="100%" style={{ borderRadius: 8 }} />
            </Box>
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Not Available">Not Available</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={uploading}
            sx={{ mt: 3 }}
          >
            {uploading ? 'Please wait...' : 'Add Equipment'}
          </Button>
        </form>
      </Box>

      <Snackbar
        open={!!success}
        autoHideDuration={2000}
        onClose={() => setSuccess('')}
        message={success}
      />
    </Container>
  );
};

export default AddProduct;
