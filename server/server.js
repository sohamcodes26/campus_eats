import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/db.js";
import { notFound, errorHandler } from "./src/middleware/error.middleware.js";
import { initializeSlotSchedulers } from "./src/utils/slotReset.js";
import { fixAllCanteenSlots } from "./src/utils/fixSlots.js";

// Import Routes
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import canteenRoutes from "./src/routes/canteen.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import aiRoutes from "./src/routes/ai.routes.js"; // Import the new AI routes

// Load environment variables
dotenv.config({ path: "./.env" });

// Connect to Database
connectDB();

const app = express();

// Middleware
// CORS configuration - allow multiple origins
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

console.log('🔒 CORS allowed origins:', allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Serve static files for images
app.use('/images', express.static('public/images'));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/canteens", canteenRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/ai", aiRoutes); // Mount the new AI routes

// Base Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Debug endpoint to check CORS and cookie configuration
app.get("/api/debug", (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    corsOrigins: allowedOrigins,
    requestOrigin: req.headers.origin || 'no-origin',
    cookieHeader: req.headers.cookie ? 'present' : 'absent',
    cookies: Object.keys(req.cookies),
    allHeaders: {
      origin: req.headers.origin,
      host: req.headers.host,
      'user-agent': req.headers['user-agent'],
      referer: req.headers.referer,
    }
  });
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  
  // Fix all existing canteen slots once on startup (DISABLED - run only when needed)
  // await fixAllCanteenSlots();
  
  // Initialize slot reset schedulers
  initializeSlotSchedulers();
});
