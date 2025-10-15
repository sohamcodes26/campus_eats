import { User } from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { role, name, email, password, canteenName, canteenAddress } = req.body;

  if (!role || !name || !email || !password) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  if (role === 'canteen' && (!canteenName || !canteenAddress)) {
    res.status(400);
    throw new Error('Canteen name and address are required for canteen registration');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    role,
    name,
    email,
    password,
    canteenDetails: role === 'canteen' ? { canteenName, canteenAddress } : undefined,
  });

  if (user) {
    const token = user.getSignedJwtToken();

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      canteenDetails: user.canteenDetails,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


// @desc    Auth user & get token (Login)
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    const token = user.getSignedJwtToken();

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


// @desc    Logout user / clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export { registerUser, loginUser, logoutUser };

