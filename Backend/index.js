const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT
const adminRoute = require('./Routes/adminRoute')

//database connection config
const dbConnect = require('./Config/config')
dbConnect();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "server is live" })
})

app.use('/api',adminRoute); // admin related routes

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})