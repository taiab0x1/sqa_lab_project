import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const Cart = ({ open, onClose, items = [], onRemoveItem, onClearCart }) => {
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkoutDetails, setCheckoutDetails] = useState({
    name: '',
    phone: '',
    address: '',
    rentDuration: 1
  });

  // Calculate total price whenever items or rental duration changes
  useEffect(() => {
    const calculateTotal = () => {
      const total = items.reduce((sum, item) => {
        const priceStr = item.price.replace('/day', '').trim();
        const price = parseInt(priceStr);
        return sum + (price || 0);
      }, 0);
      setTotalPrice(total);
    };

    calculateTotal();
  }, [items]);

  const getItemTotal = () => {
    return totalPrice * checkoutDetails.rentDuration;
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      
      // Remove item from cart
      onRemoveItem(itemId);
      
      // Update localStorage
      const updatedCart = items.filter(item => item.id !== itemId);
      localStorage.setItem(`cart_${decoded._id}`, JSON.stringify(updatedCart));
      
      // Dispatch cart update event
      window.dispatchEvent(new CustomEvent('cart-update', {
        detail: { userId: decoded._id }
      }));
    } catch (error) {
      console.error('Remove item error:', error);
    }
  };

  const handleCheckoutSubmit = async () => {
    if (!checkoutDetails.name || !checkoutDetails.phone || !checkoutDetails.address) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const decoded = jwtDecode(token);
      const orderData = {
        userId: decoded._id,
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: parseInt(item.price.replace('/day', '')),
          rentDuration: checkoutDetails.rentDuration
        })),
        totalAmount: getItemTotal(),
        ...checkoutDetails,
        orderDate: new Date().toISOString()
      };

      const response = await axios.post('http://localhost:3000/auth/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        // Clear cart and trigger refresh
        onClearCart();
        setCheckoutDetails({
          name: '',
          phone: '',
          address: '',
          rentDuration: 1
        });
        setCheckoutOpen(false);
        
        // Dispatch event to update cart in other components
        window.dispatchEvent(new Event('cart-update'));
        
        navigate('/bookings');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to process checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 350 }} className="p-4">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h6">Your Cart</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {items.length === 0 ? (
            <Typography className="text-center py-8 text-gray-500">
              Your cart is empty
            </Typography>
          ) : (
            <>
              <List>
                {items.map((item) => (
                  <ListItem key={item.id} className="border-b">
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Price: ৳{item.price}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            {item.description}
                          </Typography>
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <Box className="mt-4 pt-4 border-t">
                <Typography variant="h6" className="mb-4">
                  Total: ৳{totalPrice}/day
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    onClearCart();
                    // Dispatch event to update cart
                    window.dispatchEvent(new Event('cart-update'));
                  }}
                  className="mb-2"
                  fullWidth
                >
                  Clear Cart
                </Button>
                <Button
                  variant="contained"
                  className="bg-green-600 hover:bg-green-700"
                  fullWidth
                  onClick={() => setCheckoutOpen(true)}
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      <Dialog 
        open={checkoutOpen} 
        onClose={() => !loading && setCheckoutOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Complete Your Rental</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={checkoutDetails.name}
            onChange={(e) => setCheckoutDetails({ ...checkoutDetails, name: e.target.value })}
            required
            disabled={loading}
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={checkoutDetails.phone}
            onChange={(e) => setCheckoutDetails({ ...checkoutDetails, phone: e.target.value })}
            required
            disabled={loading}
          />
          <TextField
            label="Delivery Address"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={checkoutDetails.address}
            onChange={(e) => setCheckoutDetails({ ...checkoutDetails, address: e.target.value })}
            required
            disabled={loading}
          />
          <TextField
            label="Rental Duration (days)"
            type="number"
            fullWidth
            margin="normal"
            value={checkoutDetails.rentDuration}
            onChange={(e) => setCheckoutDetails({ 
              ...checkoutDetails, 
              rentDuration: Math.max(1, parseInt(e.target.value) || 1)
            })}
            required
            disabled={loading}
            InputProps={{ inputProps: { min: 1 } }}
          />

          <Typography variant="subtitle1" className="mt-4">
            Daily Rate: ৳{totalPrice}
          </Typography>
          <Typography variant="subtitle1" className="mt-2">
            Rental Duration: {checkoutDetails.rentDuration} days
          </Typography>
          <Typography variant="h6" className="mt-2">
            Total Amount: ৳{getItemTotal()}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCheckoutOpen(false)} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCheckoutSubmit}
            variant="contained"
            className="bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} className="text-white" />
            ) : (
              'Confirm Order'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Cart;