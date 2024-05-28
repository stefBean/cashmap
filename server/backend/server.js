const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../frontend')));










app.listen(port)

console.log("Server now listening on http://localhost:3000/")