const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const patientRoutes = require('./routes/patientRoutes');
const employeeRoutes = require('./routes/employeeRoutes'); 
const authRoutes = require('./routes/authRoutes')
const errorMiddleware = require('./middleware/errorMiddleware');
const db = require('./config/db'); 
const cors = require('cors');


dotenv.config();

const app = express();

// Middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
