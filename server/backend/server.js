const config = require('./config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const authenticateToken = require('./authenticateToken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

app.use(bodyParser.json());

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'API Documentation using Swagger',
    },
    servers: [
        {
            url: `http://localhost:${port}`,
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['server/backend/routes/userRoutes.js',
           'server/backend/routes/groupRoutes.js',
           'server/backend/routes/transactionRoutes.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/users', userRoutes);

// Apply the authenticateToken middleware to routes below
app.use(authenticateToken);

app.use('/groups', groupRoutes);
app.use('/transactions', transactionRoutes);

app.listen(port, () => {
    console.log(`Server now listening on http://localhost:${port}/`);
});

// Optional second server for serving static files on a different port
const app2 = express();
app2.use(bodyParser.json());
app2.use(express.static(path.join(__dirname, '../frontend')));
app2.listen(4000, () => {
    console.log(`Server now listening on http://localhost:4000/`);
});
