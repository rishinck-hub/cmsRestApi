// ✅ Load environment variables
require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const pharmacistRoutes = require("./routes/pharmacistRoutes");
const labtechRoutes = require("./routes/labtechRoutes");

const app = express();
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/pharmacist", pharmacistRoutes);
app.use("/api/labtech", labtechRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
