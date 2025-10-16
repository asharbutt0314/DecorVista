import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// Import routes
import authRoutes from "./Routes/authRoutes.mjs";
import adminRoutes from "./Routes/adminRoutes.mjs";
import userRoutes from './Routes/userRoutes.mjs';
import designerRoutes from './Routes/designerRoutes.mjs';
import productRoutes from './Routes/productRoutes.mjs';
import categoryRoutes from './Routes/categoryRoutes.mjs';
import consultationRoutes from './Routes/consultationRoutes.mjs';
import reviewRoutes from './Routes/reviewRoutes.mjs';
import blogRoutes from './Routes/blogRoutes.mjs';
import orderRoutes from './Routes/orderRoutes.mjs';
import notificationRoutes from './Routes/notificationRoutes.mjs';
import availabilityRoutes from './Routes/availabilityRoutes.mjs';
import dashboardRoutes from './Routes/dashboardRoutes.mjs';
import portfolioRoutes from './Routes/portfolioRoutes.mjs';

dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/designer', designerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/designers/portfolio', portfolioRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err));

// Global error handling middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});