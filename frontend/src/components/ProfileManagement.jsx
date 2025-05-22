import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  Badge,
  Switch,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const Input = styled('input')({
  display: 'none',
});

const ProfileManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+880 1234567890',
    address: 'Dhaka, Bangladesh',
    avatar: null,
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  const [rentalHistory] = useState([
    {
      id: 1,
      equipment: 'Modern Tractor',
      date: '2024-05-01',
      status: 'Completed',
      amount: '৳3000'
    },
    // Add more rental history items
  ]);

  const [favorites] = useState([
    {
      id: 1,
      name: 'Harvester',
      category: 'harvester'
    },
    // Add more favorites
  ]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationChange = (type) => {
    setProfile({
      ...profile,
      notifications: {
        ...profile.notifications,
        [type]: !profile.notifications[type]
      }
    });
  };

  return (
    <Box className="p-4">
      <Grid container spacing={3}>
        {/* Profile Info Section */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4 text-center">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <label htmlFor="icon-button-file">
                  <Input 
                    accept="image/*" 
                    id="icon-button-file" 
                    type="file"
                    onChange={handleImageUpload} 
                  />
                  <Button
                    component="span"
                    className="bg-green-600 min-w-0 p-2 rounded-full"
                  >
                    <CameraAltIcon className="text-white" />
                  </Button>
                </label>
              }
            >
              <Avatar
                sx={{ width: 120, height: 120, margin: '0 auto' }}
                src={profile.avatar}
              />
            </Badge>
            <Typography variant="h6" className="mt-4">
              {profile.name}
            </Typography>
            <Typography color="textSecondary">
              {profile.email}
            </Typography>
          </Paper>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12} md={8}>
          <Paper className="p-4">
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
              <Tab label="Profile Details" />
              <Tab label="Rental History" />
              <Tab label="Favorites" />
              <Tab label="Settings" />
            </Tabs>

            <Box className="mt-4">
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={profile.email}
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              )}

              {activeTab === 1 && (
                <List>
                  {rentalHistory.map((rental) => (
                    <ListItem key={rental.id} divider>
                      <ListItemText
                        primary={rental.equipment}
                        secondary={`Date: ${rental.date} • Status: ${rental.status}`}
                      />
                      <Typography>{rental.amount}</Typography>
                    </ListItem>
                  ))}
                </List>
              )}

              {activeTab === 2 && (
                <List>
                  {favorites.map((item) => (
                    <ListItem key={item.id} divider>
                      <ListItemText
                        primary={item.name}
                        secondary={`Category: ${item.category}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {activeTab === 3 && (
                <Box className="space-y-4">
                  <Typography variant="h6">Notification Preferences</Typography>
                  <Divider />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.email}
                        onChange={() => handleNotificationChange('email')}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                      />
                    }
                    label="SMS Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={profile.notifications.push}
                        onChange={() => handleNotificationChange('push')}
                      />
                    }
                    label="Push Notifications"
                  />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileManagement;