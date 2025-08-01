const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
<<<<<<< HEAD

// Import routes
const authRoutes = require("./routes/authRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");

=======
const adminRoutes = require("./routes/adminRoutes");
const authRoutes=require("./routes/authRoute");
const medicineRoutes = require('./routes/medicineRoutes'); // If available
const inventoryRoutes = require('./routes/inventoryRoutes'); //  Corrected
const labTestRoutes = require('./routes/labTestRoutes'); // If available
>>>>>>> bb4d3fb54b15edce62a634c9fda1c016c8f436ba
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Routes
<<<<<<< HEAD
app.use("/api/auth", authRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// Basic routes
app.get("/", (req, res) => {
  res.json({ message: "Clinic Management System API is running" });
=======
app.get('/', (req, res) => {
  res.send('Clinic Management System API');
>>>>>>> bb4d3fb54b15edce62a634c9fda1c016c8f436ba
});

app.use('/api/admin', adminRoutes);
app.use("/api/auth",authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/inventory', inventoryRoutes); //  Fixed path here
app.use('/api/labtests', labTestRoutes);

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception:", err);
});