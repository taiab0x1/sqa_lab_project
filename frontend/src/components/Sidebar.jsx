import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Typography,
  Divider,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';

const Sidebar = ({ onPriceChange, onAvailabilityChange, onCategoryChange }) => {
  return (
    <Box className="bg-white p-4 rounded-lg shadow-md w-64">
      <Typography variant="h6" className="mb-4 text-gray-800">
        Filters
      </Typography>
      
      <Divider className="mb-4" />
      
      {/* Categories */}
      <Typography variant="subtitle1" className="mb-2 font-medium">
        Categories
      </Typography>
      <List>
        {['All', 'Tractor', 'Harvester', 'Cultivator', 'Sprayer', 'Plough', 'Seeder', 'Baler', 'Rotavator', 'Transplanter', 'Other'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => onCategoryChange(text.toLowerCase())}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider className="my-4" />

      {/* Price Range */}
      <Typography variant="subtitle1" className="mb-2 font-medium">
        Price Range (per day)
      </Typography>
      <Box className="px-2">
        <Slider
          defaultValue={[0, 10000]}
          min={0}
          max={10000}
          valueLabelDisplay="auto"
          onChange={(_, value) => onPriceChange(value)}
        />
      </Box>

      <Divider className="my-4" />

      {/* Availability */}
      <Typography variant="subtitle1" className="mb-2 font-medium">
        Availability
      </Typography>
      <FormGroup>
        <FormControlLabel 
          control={<Checkbox />} 
          label="Available Now"
          onChange={(e) => onAvailabilityChange(e.target.checked)}
        />
      </FormGroup>
    </Box>
  );
};

export default Sidebar;