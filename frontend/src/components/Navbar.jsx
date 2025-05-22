import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import logo from '../image/logo.png';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import Cart from './Cart';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
          setIsAdmin(decoded.role && decoded.role.toLowerCase() === 'admin');
          const savedCart = localStorage.getItem(`cart_${decoded._id}`);
          setCartItems(savedCart ? JSON.parse(savedCart) : []);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setCartItems([]);
        }
      } else {
        setUser(null);
        setCartItems([]);
      }
    };

    checkAuth();

    // Listen for storage events (cross-tab)
    const handleStorageChange = (e) => {
      if (e.key?.startsWith('cart_')) {
        checkAuth();
      }
    };

    // Listen for custom cart update events (same tab)
    const handleCartUpdate = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cart-update', handleCartUpdate);
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cart-update', handleCartUpdate);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const removeFromCart = (itemId) => {
    try {
      if (!user) return;
      
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      
      // Update localStorage
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(updatedCart));
      
      // Update local state
      setCartItems(updatedCart);
      
      // Dispatch cart update event
      const cartUpdateEvent = new CustomEvent('cart-update', {
        detail: {
          userId: user._id,
          cart: updatedCart
        }
      });
      window.dispatchEvent(cartUpdateEvent);
      
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  };

  const handleLogout = () => {
    if (user) {
      localStorage.removeItem(`cart_${user._id}`);
    }
    localStorage.removeItem('token');
    setUser(null);
    setCartItems([]);
    setDropdownOpen(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="font-sans">
      <header className="flex justify-between items-center px-6 py-3 bg-white shadow-md">
        {/* Logo Section */}
        <div 
          className="flex items-center space-x-3 cursor-pointer transform hover:scale-105 transition-transform duration-200" 
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="Logo" className="w-10 h-10" />
          <span className="text-xl font-semibold text-gray-800 hover:text-green-700 transition-colors">
            Green Farming
          </span>
        </div>
         
        {/* Nav Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="nav-link">Home</Link>
          {user && (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {user.role === 'admin' && (
                <Link to="/add-product" className="nav-link">Add Product</Link>
              )}
              <Link to="/bookings" className="nav-link">Bookings</Link>
            </>
          )}
          <Link to="/help" className="nav-link">Help</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {!isAdmin && (
                <button 
                  className="relative transform hover:scale-110 transition-transform duration-200" 
                  onClick={() => setIsCartOpen(true)}
                >
                  <FaShoppingCart className="text-2xl text-green-700 hover:text-green-800 transition-colors" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-pulse">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              )}
              <div className="relative">
                <FaUserCircle 
                  className="text-2xl text-green-700 hover:text-green-800 cursor-pointer transform hover:scale-110 transition-all duration-200" 
                  onClick={toggleDropdown} 
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-md p-3 z-50 border border-gray-100">
                    <p className="text-gray-800 text-sm font-medium">{user.email}</p>
                    <p className="text-gray-500 text-sm capitalize">{user.role}</p>
                    <hr className="my-2" />
                    <button
                      className="text-green-700 text-sm font-medium hover:bg-green-50 w-full text-left py-1 px-2 rounded transition-colors duration-200"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/user-dashboard');
                      }}
                    >
                      My Account
                    </button>
                    <button
                      className="text-red-600 text-sm font-medium hover:bg-red-50 w-full text-left py-1 px-2 rounded transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-x-4 flex items-center">
              <button
                className="auth-button login-button flex items-center gap-2"
                onClick={() => navigate('/login')}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Login
              </button>
              <button
                className="auth-button signup-button flex items-center gap-2"
                onClick={() => navigate('/register')}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
                  />
                </svg>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Cart component */}
      {user && !isAdmin && (
        <Cart 
          open={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onRemoveItem={removeFromCart}
          onClearCart={() => {
            localStorage.removeItem(`cart_${user._id}`);
            setCartItems([]);
          }}
          userId={user._id}
        />
      )}
    </div>
  );
}

export default Navbar;
