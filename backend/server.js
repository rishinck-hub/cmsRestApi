const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
// const staffRoutes = require("./routes/staffRoutes");
// const roleRoutes = require("./routes/roleRoutes");
// const doctorRoutes = require("./routes/doctorRoutes");
// const specializationRoutes = require("./routes/specializationRoutes");
// const patientRoutes = require("./routes/patientRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");
// const consultationRoutes = require("./routes/consultationRoutes");
// const medicineRoutes = require("./routes/medicineRoutes");
// const prescriptionRoutes = require("./routes/prescriptionRoutes");
// const labTestRoutes = require("./routes/labTestRoutes");
// const inventoryRoutes = require("./routes/inventoryRoutes");
// const billingRoutes = require("./routes/billingRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/staff", staffRoutes);
// app.use("/api/roles", roleRoutes);
// app.use("/api/doctors", doctorRoutes);
// app.use("/api/specializations", specializationRoutes);
// app.use("/api/patients", patientRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/consultations", consultationRoutes);
// app.use("/api/medicines", medicineRoutes);
// app.use("/api/prescriptions", prescriptionRoutes);
// app.use("/api/labtests", labTestRoutes);
// app.use("/api/inventory", inventoryRoutes);
// app.use("/api/billing", billingRoutes);

// Basic routes
app.get("/", (req, res) => {
  res.json({ message: "Clinic Management System API is running" });
});

app.get("/health", (req, res) => {
  res.json({ message: "Server is healthy" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
