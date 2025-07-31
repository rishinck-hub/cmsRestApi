console.log('Starting server...');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Make sure this file exists
const authRoutes = require('./routes/authRoute');
const medicineRoutes = require('./routes/medicineRoutes'); // If available
const inventoryRoutes = require('./routes/inventoryRoutes'); //  Corrected
const labTestRoutes = require('./routes/labTestRoutes'); // If available
const cors = require('cors');

console.log('Loading environment variables...');
dotenv.config();

console.log('Creating Express app...');
const app = express();

console.log('Connecting to database...');
// Connect to DB with error handling
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  console.log('Server will start without database connection');
});

app.use(cors());
app.use(express.json());

//  Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/inventory', inventoryRoutes); //  Fixed path here
app.use('/api/labtests', labTestRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Clinic Management System API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
