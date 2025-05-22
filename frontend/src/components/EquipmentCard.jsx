import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Dialog } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const DESCRIPTION_LIMIT = 120; // characters before "Show More" appears

const EquipmentCard = ({ equipment, onRentClick, onEdit, onDelete, refreshProducts, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === 'admin');
    }
  }, []);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/auth/products/${equipment._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        refreshProducts();
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete product');
      }
    }
  };

  const description = equipment.description || '';
  const isLong = description.length > DESCRIPTION_LIMIT;
  const displayedDesc = showFullDesc ? description : description.slice(0, DESCRIPTION_LIMIT);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {/* Image with click handler */}
      <CardMedia
        component="img"
        height="200"
        image={imageError ? '/placeholder.jpg' : equipment.image}
        alt={equipment.name}
        onError={() => setImageError(true)}
        className="h-48 object-cover cursor-pointer"
        onClick={() => setShowImageModal(true)}
      />
      {/* Image Modal */}
      <Dialog open={showImageModal} onClose={() => setShowImageModal(false)} maxWidth="md">
        <img
          src={imageError ? '/placeholder.jpg' : equipment.image}
          alt={equipment.name}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </Dialog>
      <CardContent className="flex flex-col flex-grow">
        <Typography variant="h6" component="h2">
          {equipment.name}
        </Typography>
        {/* Price and Status moved up here */}
        <Box className="my-2">
          <Typography className="text-green-600 font-bold">
            Price: ৳{equipment.price}/day
          </Typography>
          <Typography className={equipment.status === 'Available' ? 'text-green-600' : 'text-red-600'}>
            Status: {equipment.status}
          </Typography>
        </Box>
        <Typography color="textSecondary" gutterBottom>
          {displayedDesc}
          {isLong && !showFullDesc && '... '}
          {isLong && (
            <Button
              size="small"
              color="primary"
              onClick={() => setShowFullDesc(v => !v)}
              style={{ textTransform: 'none', padding: 0, minWidth: 0 }}
            >
              {showFullDesc ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </Typography>
        <div style={{ flex: 1 }} />
        <Box className="mt-4 flex gap-2">
          {!isAdmin && (
            <Button
              variant="outlined"
              onClick={() => onViewDetails(equipment)}
              fullWidth
            >
              View Details
            </Button>
          )}
          {isAdmin ? (
            <>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Edit />}
                onClick={() => onEdit(equipment)}
                fullWidth
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDelete}
                fullWidth
              >
                Delete
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => onRentClick(equipment)}
              className="bg-green-600 hover:bg-green-700"
              fullWidth
              disabled={equipment.status !== 'Available'}
            >
              RENT NOW
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;