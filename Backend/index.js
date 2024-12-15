const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000
const adminRoute = require('./Routes/adminRoute')

// Initialize database connection
const dbConnect = require('./Config/config')
dbConnect();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
/**
 * @route GET /
 * @description A simple route to check if the server is running
 * @access Public
 */
app.get('/', (req, res) => {
    res.json({ message: "server is live" })
})

// API routes
/**
 * @route /api
 * @description Admin-related routes
 */
app.use('/api',adminRoute);


// Start the server
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})