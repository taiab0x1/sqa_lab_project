import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Grid,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AddAdmin from '../components/AddAdmin';
import EquipmentCard from '../components/EquipmentCard';
import SearchBar from '../components/SearchBar';
import Sidebar from '../components/Sidebar';
import Cart from '../components/Cart';
import EditProductModal from '../components/EditProductModal';
import EquipmentDetails from '../components/EquipmentDetails';

import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const savedCart = localStorage.getItem(`cart_${decoded._id}`);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [equipmentData, setEquipmentData] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/auth/dashproducts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEquipmentData(response.data);
        setFilteredEquipment(response.data);
      } catch (err) {
        setError('Failed to fetch equipment');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsAdmin(decoded.role === 'admin');
    }
  }, []);

  useEffect(() => {
    let filtered = equipmentData;

    // Category filter
    if (category && category !== 'all') {
      filtered = filtered.filter(eq => eq.category?.toLowerCase() === category);
    }

    // Price filter
    filtered = filtered.filter(eq => {
      const priceNum = parseInt(eq.price);
      return priceNum >= priceRange[0] && priceNum <= priceRange[1];
    });

    // Availability filter
    if (showOnlyAvailable) {
      filtered = filtered.filter(eq => eq.status === 'Available');
    }

    // Search filter
    if (searchText) {
      filtered = filtered.filter(eq =>
        eq.name.toLowerCase().includes(searchText.toLowerCase()) ||
        eq.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredEquipment(filtered);
  }, [equipmentData, category, priceRange, showOnlyAvailable, searchText]);

  const refreshProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/auth/dashproducts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setEquipmentData(response.data);
      setFilteredEquipment(response.data);
    } catch (error) {
      setError('Failed to refresh products');
    }
  };

  const handleRentClick = (equipment) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // Check if item already in cart
      const existingItem = cartItems.find(item => item.id === equipment._id);
      if (existingItem) {
        // Instead of blocking, update quantity
        const updatedCart = cartItems.map(item =>
          item.id === equipment._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
        setCartItems(updatedCart);
        localStorage.setItem(`cart_${decoded._id}`, JSON.stringify(updatedCart));
        window.dispatchEvent(new CustomEvent('cart-update')); // <-- Add this line
        setSuccess('Increased quantity in cart');
        setIsCartOpen(true);
        return;
      }

      // If not in cart, add as new item with quantity 1
      const cartItem = {
        id: equipment._id,
        name: equipment.name,
        price: equipment.price,
        description: equipment.description,
        status: equipment.status,
        image: equipment.image,
        quantity: 1
      };

      const updatedCart = [...cartItems, cartItem];
      localStorage.setItem(`cart_${decoded._id}`, JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      window.dispatchEvent(new CustomEvent('cart-update')); // <-- Add this line
      setSuccess('Item added to cart successfully');
      setIsCartOpen(true);
    } catch (error) {
      console.error('Cart error:', error);
      setError('Failed to add item to cart');
    }
  };

  const handleRemoveFromCart = (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      localStorage.setItem(`cart_${decoded._id}`, JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Remove from cart error:', error);
      setError('Failed to remove item from cart');
    }
  };

  const handleViewDetails = (equipment) => {
    setSelectedEquipment(equipment);
    setShowDetails(true);
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      <Container maxWidth="xl" className="py-8">
        {/* Show AddAdmin form for admins at the top */}
       
        <Box className="flex gap-4">
          {/* Sidebar for filters */}
          <Sidebar
            onCategoryChange={setCategory}
            onPriceChange={setPriceRange}
            onAvailabilityChange={setShowOnlyAvailable}
          />
          <Box className="flex-1">
            {/* Search bar for keyword search */}
            <SearchBar onSearch={setSearchText} />
            <Grid container spacing={3}>
              {filteredEquipment.map((equipment) => (
                <Grid item xs={12} sm={6} lg={4} key={equipment._id}>
                  <EquipmentCard
                    equipment={equipment}
                    onRentClick={handleRentClick}
                    onEdit={setEditProduct}
                    refreshProducts={refreshProducts}
                    isAdmin={isAdmin}
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Container>

      {!isAdmin && (
        <Cart
          open={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onRemoveItem={handleRemoveFromCart} // <-- Correct prop name
        />
      )}

      {selectedEquipment && (
        <EquipmentDetails
          open={showDetails}
          onClose={() => setShowDetails(false)}
          equipment={selectedEquipment}
        />
      )}

      {editProduct && (
        <EditProductModal
          open={!!editProduct}
          onClose={() => setEditProduct(null)}
          product={editProduct}
          refreshProducts={refreshProducts}
        />
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
