import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Alert, CircularProgress } from '@mui/material';

const AddAdmin = ({ user }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || user.role?.toLowerCase() !== 'admin') return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/auth/add-admin',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Admin created successfully!');
      setForm({ username: '', email: '', password: '' });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to create admin. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleAddAdmin} sx={{ maxWidth: 400, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </Box>
      <Box mb={2}>
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
        startIcon={loading && <CircularProgress size={18} />}
      >
        {loading ? 'Adding...' : 'Add Admin'}
      </Button>
    </Box>
  );
};

export default AddAdmin;