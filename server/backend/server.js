const config = require('./config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const authenticateToken = require('./authenticateToken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc')
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

//All routes

const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const currencyRoutes = require('./routes/currencyRoutes');

app.use(bodyParser.json());
app.use(cookieParser());

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
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['server/backend/routes/userRoutes.js',
           'server/backend/routes/groupRoutes.js',
           'server/backend/routes/transactionRoutes.js',
           'server/backend/routes/currencyRoutes.js'],
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve static files
app.use(express.static(path.join(__dirname, '../reactfront/build')));


app.use('/users', userRoutes.router);


// Apply the authenticateToken middleware to routes below
app.use(authenticateToken);

app.use('/groups', groupRoutes.router);
app.use('/transactions', transactionRoutes);
app.use('/currency', currencyRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../reactfront/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server now listening on http://localhost:${port}/`);
});


//second frontend
const dataRoutes = require('./routesWhyNotSecondFrontend/dataRoutes'); // Ensure this path is correct

const app2 = express();
app2.use(bodyParser.json());
app2.use('/', dataRoutes);
app2.listen(4000, () => {
    console.log(`Server now listening on http://localhost:4000/`);
});
