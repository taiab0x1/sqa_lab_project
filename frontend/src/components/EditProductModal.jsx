import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import axios from 'axios';

const EditProductModal = ({ open, onClose, product, refreshProducts }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    price: '',
    description: '',
    category: '',
    status: 'Available',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle file input change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      let dataToSend;

      if (imageFile) {
        // If a new image is selected, use FormData
        dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('price', formData.price);
        dataToSend.append('description', formData.description);
        dataToSend.append('category', formData.category);
        dataToSend.append('status', formData.status);
        dataToSend.append('image', imageFile);
        for (let pair of dataToSend.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }
      } else {
        // No new image, send JSON
        dataToSend = {
          name: formData.name,
          price: formData.price,
          description: formData.description,
          category: formData.category,
          status: formData.status,
          image: formData.image // keep old image path
        };
      }

      await axios.put(
        `http://localhost:3000/auth/products/${product._id}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(imageFile
              ? { 'Content-Type': 'multipart/form-data' }
              : { 'Content-Type': 'application/json' })
          }
        }
      );

      refreshProducts();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="tractor">Tractor</MenuItem>
              <MenuItem value="harvester">Harvester</MenuItem>
              <MenuItem value="cultivator">Cultivator</MenuItem>
              <MenuItem value="sprayer">Sprayer</MenuItem>
              <MenuItem value="plough">Plough</MenuItem>
              <MenuItem value="seeder">Seeder</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              {/* Add more categories as needed */}
            </Select>
          </FormControl>

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

          {/* Image upload */}
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            {imageFile ? imageFile.name : 'Upload New Image'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {/* Show current image */}
          {formData.image && !imageFile && (
            <img
              src={formData.image}
              alt="Current"
              style={{ width: 100, marginTop: 10, borderRadius: 4 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditProductModal;