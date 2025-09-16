import { User } from '../models/User.model.js';
import { Order } from '../models/Order.model.js';
import { Review } from '../models/Review.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @description Get user profile
 * @route GET /api/v1/users/profile
 * @access Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});


/**
 * @description Update user profile
 * @route PUT /api/v1/users/profile
 * @access Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  user.name = req.body.name || user.name;
  if (req.body.password) {
    user.password = req.body.password;
  }

  if (user.role === 'student') {
    user.studentDetails.phone = req.body.phone || user.studentDetails.phone;
  } else if (user.role === 'canteen') {
    
    // <-- 1. ADD 'cuisineTypes' to this line
    const { canteenName, canteenAddress, phone, isOpen, cuisineTypes } = req.body;

    user.canteenDetails.canteenName = canteenName || user.canteenDetails.canteenName;
    user.canteenDetails.canteenAddress = canteenAddress || user.canteenDetails.canteenAddress;
    user.canteenDetails.phone = phone || user.canteenDetails.phone;
    if (isOpen !== undefined) {
        user.canteenDetails.isOpen = isOpen;
    }

    // <-- 2. ADD this 'if' block to save the array
    if (cuisineTypes) {
        user.canteenDetails.cuisineTypes = cuisineTypes;
    }
  }

  const updatedUser = await user.save();
  const userResponse = await User.findById(updatedUser._id).select('-password');
  res.status(200).json(userResponse);
});


/**
 * @description Get statistics for the logged-in student
 * @route GET /api/v1/users/stats
 * @access Private (Student)
 */
const getStudentStats = asyncHandler(async (req, res) => {
    const studentId = req.user._id;

    // Calculate total orders and spending
    const orders = await Order.find({ user: studentId, status: 'Completed' });
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Calculate average rating given by the student
    const reviews = await Review.find({ user: studentId });
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : 0;
    
    res.status(200).json({
        totalOrders,
        totalSpent,
        avgRating,
    });
});


export { getUserProfile, updateUserProfile, getStudentStats };

