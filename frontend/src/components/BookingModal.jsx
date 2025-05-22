import React, { useState } from 'react';
import axios from 'axios'; // Add this at the top
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers'; // Updated import
import { LocalizationProvider } from '@mui/x-date-pickers'; // Add this
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Add this
import dayjs from 'dayjs';

const BookingModal = ({ open, onClose, equipment }) => {
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(1, 'day'));
  const [duration, setDuration] = useState('daily');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !startDate || !endDate) {
      return;
    }

    const bookingDetails = {
      equipmentId: equipment._id,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      duration,
      name,
      phone
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/auth/bookings',
        bookingDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        setName('');
        setPhone('');
        setDuration('daily');
        setStartDate(dayjs());
        setEndDate(dayjs().add(1, 'day'));
      }, 2000);
    } catch (error) {
      alert('Booking failed!');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}> {/* Wrap with provider */}
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Book {equipment?.name}
        </DialogTitle>
        <DialogContent>
          <Box component="form" className="space-y-4 mt-2">
            <Typography variant="subtitle1" className="font-semibold">
              Price: ৳{equipment?.price}
            </Typography>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
                minDate={dayjs()}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
                minDate={startDate}
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Duration</InputLabel>
              <Select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                label="Duration"
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={!name}
              helperText={!name ? 'Name is required' : ''}
            />

            <TextField
              fullWidth
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              error={!phone}
              helperText={!phone ? 'Phone number is required' : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions className="p-4">
          <Button 
            onClick={onClose} 
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="bg-green-600 hover:bg-green-700"
            disabled={!name || !phone || !startDate || !endDate}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Booking confirmed successfully! We'll contact you shortly.
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default BookingModal;