import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  Button, 
  Box,
  Divider,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BookingModal from './BookingModal';

const EquipmentDetails = ({ open, onClose, equipment }) => {
  const [showBooking, setShowBooking] = useState(false);

  if (!equipment) return null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle className="flex justify-between items-center">
          <Typography variant="h6">{equipment.name}</Typography>
          <CloseIcon 
            className="cursor-pointer" 
            onClick={onClose}
          />
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4">
            <Chip 
              label={equipment.status} 
              color={equipment.status === 'Available' ? 'success' : 'error'}
              className="mb-4"
            />
            
            <Typography variant="body1" className="text-gray-600">
              {equipment.description}
            </Typography>
            
            <Divider />
            
            <Box className="py-2">
              <Typography variant="h6" className="text-green-600 font-bold">
                Price: ৳{equipment.price}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Category: {equipment.category}
              </Typography>
            </Box>
            
            <Divider />
            
            <Box className="space-y-2">
              <Typography variant="subtitle1" className="font-semibold">
                Features:
              </Typography>
              <ul className="list-disc pl-4">
                <li>24/7 Technical Support</li>
                <li>Free Delivery & Pickup</li>
                <li>Insurance Included</li>
                <li>Operator Training Available</li>
              </ul>
            </Box>
            
            <Button 
              variant="contained" 
              fullWidth 
              className="bg-green-600 hover:bg-green-700 mt-4"
              onClick={() => setShowBooking(true)}
            >
              Book Now
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <BookingModal
        open={showBooking}
        onClose={() => setShowBooking(false)}
        equipment={equipment}
      />
    </>
  );
};

export default EquipmentDetails;