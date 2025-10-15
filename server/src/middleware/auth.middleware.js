import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.model.js';

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  console.log('\n=== PROTECT MIDDLEWARE ===');
  console.log('Request URL:', req.originalUrl);
  console.log('Request Method:', req.method);
  console.log('Origin:', req.headers.origin || 'no-origin-header');
  console.log('Cookie header:', req.headers.cookie || 'no-cookie-header');
  console.log('Cookies received:', Object.keys(req.cookies));
  console.log('All cookies:', req.cookies);
  
  let token;

  // Read the JWT from the 'accessToken' cookie
  token = req.cookies.accessToken;
  console.log('Token found:', !!token);

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found:', req.user ? `${req.user.name} (${req.user.role})` : 'No user');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('=== AUTHORIZE MIDDLEWARE ===');
    console.log('User role:', req.user?.role);
    console.log('Required roles:', roles);
    console.log('Authorization check:', req.user && roles.includes(req.user.role));
    
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(
        `User role ${req.user ? req.user.role : 'guest'} is not authorized to access this route`
      );
    }
    next();
  };
};

export { protect, authorize };

