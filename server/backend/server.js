const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../frontend')));










app.listen(3000)

console.log("Server now listening on http://localhost:3000/")