import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" className="bg-gray-800 text-white py-4 mt-auto">
      <Container maxWidth="lg">
        <Grid container spacing={2} className="justify-between">
          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" className="font-bold mb-2">
              Quick Links
            </Typography>
            <Box className="flex flex-col space-y-1">
              <Link to="/" className="text-gray-300 hover:text-white text-sm">
                Home
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white text-sm">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white text-sm">
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" className="font-bold mb-2">
              Services
            </Typography>
            <Box className="flex flex-col space-y-1">
              <Link to="/equipment" className="text-gray-300 hover:text-white text-sm">
                Equipment Rental
              </Link>
              <Link to="/support" className="text-gray-300 hover:text-white text-sm">
                Support
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" className="font-bold mb-2">
              Contact Us
            </Typography>
            <Box className="flex flex-col space-y-1">
              <Typography variant="body2" className="text-gray-300">
                Email: support@greenfarming.com
              </Typography>
              <Typography variant="body2" className="text-gray-300">
                Phone: +880 1234-567890
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Typography 
          variant="body2" 
          className="text-center text-gray-400 mt-4 text-sm"
        >
          © {new Date().getFullYear()} Green Farming. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;