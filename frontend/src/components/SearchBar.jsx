import React from 'react';
import { Box, TextField } from '@mui/material';

const SearchBar = ({ onSearch }) => {
  return (
    <Box className="mb-6">
      <TextField 
        name="search" // <-- Add this!
        fullWidth
        placeholder="Search equipment..."
        onChange={(e) => onSearch(e.target.value)}
        className="bg-white rounded-lg"
      />
    </Box>
  );
};

export default SearchBar;