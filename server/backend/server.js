const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const groupModel = require('./group-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = []

//https://expressjs.com/en/starter/static-files.html ?
app.use(express.static(path.join(__dirname, '../frontend')));

//get group per ID
app.get('/groups/:groupID', function (req, res) {
    const id = req.params.groupID
    const exists = id in groupModel

    if (exists) {
        res.send(groupModel[id])
    } else {
        res.sendStatus(404)
    }
})

//get all groups where user is member
app.get('/groups/:groupID', function (req, res) {
    const id = req.params.groupID
    const exists = id in groupModel

    if (exists) {
        res.send(groupModel[id])
    } else {
        res.sendStatus(404)
    }
})

app.get('/users', (req, res) => {
    res.json(users)
})

//https://www.youtube.com/watch?v=Ud5xKCYQTjM
app.post('/users', async (req, res) => {
    const existingUser = users.find(user => user.name === req.body.name)
    if(existingUser){
        return res.status(400).send('Username already used');
    }
    if(loginJoke(req.body.password)) return res.status(400).send('Password already used by User: Aida');

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})

function loginJoke(password){
    if (password === "Joke")
        return true;
}

app.listen(port)

console.log("Server now listening on http://localhost:3000/")