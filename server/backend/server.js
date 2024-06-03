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

////////
// Define login and registration routes first (these should be excluded from the token check)
app.use('/api/users/register', userRoutes);
app.use('/api/users/login', userRoutes);
////////

// Apply the authenticateToken middleware globally to all routes below this line
app.use(authenticateToken);

app.use('/api/groups', groupRoutes);
app.use('/api/transactions', transactionRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(port, () => {
    console.log("Server now listening on http://localhost:3000/");
});
