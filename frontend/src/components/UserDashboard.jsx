import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Button,
  Chip
} from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import AddAdmin from './AddAdmin';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUser(decoded);

        // Fetch user profile
        const profileRes = await axios.get(`http://localhost:3000/auth/profile/${decoded._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(profileRes.data);

        // Fetch user's rental history
        const rentalsRes = await axios.get(`http://localhost:3000/auth/rentals/${decoded._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRentals(rentalsRes.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <Paper className="p-6">
        <Box className="mb-6">
          <Typography variant="h4" className="mb-2">
            Welcome, {profile?.name || profile?.email || user?.email}
          </Typography>
          <Typography color="textSecondary">
            Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
          </Typography>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} className="mb-4">
          <Tab label="Rental History" />
          <Tab label="Active Rentals" />
          <Tab label="Profile" />
        </Tabs>

        {activeTab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Equipment</TableCell>
                  <TableCell>Rental Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rentals.length > 0 ? (
                  rentals.map((rental) => (
                    <TableRow key={rental._id}>
                      <TableCell>{rental.equipment?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {rental.createdAt ? new Date(rental.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={rental.status}
                          color={
                            rental.status === 'Active' ? 'success' :
                            rental.status === 'Completed' ? 'default' :
                            'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {rental.equipment?.price ? `৳${rental.equipment.price}/day` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => window.print()}
                        >
                          Print Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No rental history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 1 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Equipment</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rentals
                  .filter(rental => rental.status === 'Active')
                  .map((rental) => (
                    <TableRow key={rental._id}>
                      <TableCell>{rental.equipment?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {rental.startDate ? new Date(rental.startDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {rental.endDate ? new Date(rental.endDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip label="Active" color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          // onClick={() => handleCancelRental(rental._id)}
                        >
                          Cancel Rental
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 2 && (
          <Box className="space-y-4">
            <Typography variant="h6">Profile Information</Typography>
            <Box className="space-y-2">
              <Typography>
                <strong>Email:</strong> {profile?.email || user?.email}
              </Typography>
              <Typography>
                <strong>Role:</strong> {profile?.role || user?.role}
              </Typography>
              <Typography>
                <strong>Account Status:</strong>{' '}
                <Chip label="Active" color="success" size="small" />
              </Typography>
            </Box>
            {/* Only show AddAdmin for admins */}
            {((profile?.role || user?.role)?.toLowerCase() === 'admin') && (
              <Box mt={4}>
                <Typography variant="h6" className="mb-2">Add New Admin</Typography>
                <AddAdmin user={user} />
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserDashboard;