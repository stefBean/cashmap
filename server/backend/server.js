const config = require('./config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const authenticateToken = require('./authenticateToken');

const app = express();
const port = 3000;

const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/users/', userRoutes);

// Apply the authenticateToken middleware to routes below
app.use(authenticateToken);

app.use('/groups/', groupRoutes);
app.use('/transactions/', transactionRoutes);



app.listen(port);
console.log("Server now listening on http://localhost:3000/");
