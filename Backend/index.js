const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')

//server port from envirement variable or 5000
const port = process.env.PORT || 5000

//admin route
const adminRoute = require('./Routes/adminRoute')

//teacher route
const teacherRoute = require('./Routes/teacherRoute')

//student route
const studentRoute = require('./Routes/studentRoute')

// Initialize database connection
const dbConnect = require('./Config/config')
dbConnect();

// Middlewares
app.use(cors({
    origin:process.env.CORS_ORIGIN
}));
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
 * @route /api/admin
 * @description Admin-related routes
 */
app.use('/api/admin',adminRoute);

/**
 * @route /api/teacher
 * @description Teacher-related routes
 */
app.use('/api/teacher',teacherRoute);

/**
 * @route /api/student
 * @description Student-related routes
 */
app.use('/api/student',studentRoute);


app.use('/api',require('./Routes/verifyToken'))

// Start the server
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})