import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Box,
  CheckCircleOutline
} from '@mui/material';

const BookingConfirmation = ({ open, onClose, bookingDetails }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-center">
        Booking Confirmed!
      </DialogTitle>
      <DialogContent>
        <Box className="text-center space-y-4 py-4">
          <CheckCircleOutline className="text-green-600 text-6xl" />
          <Typography variant="h6">
            Thank you for your booking
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Booking Reference: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </Typography>
          <Box className="bg-gray-50 p-4 rounded-lg mt-4">
            <Typography variant="subtitle2" gutterBottom>
              Equipment: {bookingDetails?.equipment?.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Duration: {bookingDetails?.duration}
            </Typography>
            <Typography variant="body2">
              Total Amount: ৳{bookingDetails?.equipment?.price}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={onClose}
            className="bg-green-600 hover:bg-green-700 mt-4"
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmation;