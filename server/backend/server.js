const config = require('./config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const groupModel = require('./group-model');
const users = require('./user-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express();
const port = 3000;

app.use(bodyParser.json());


//https://expressjs.com/en/starter/static-files.html ?
app.use(express.static(path.join(__dirname, '../frontend')));

//get group per ID not needed
/*
app.get('/groups/:groupID', function (req, res) {
    const id = req.params.groupID
    const exists = id in groupModel

    if (exists) {
        res.send(groupModel[id])
    } else {
        res.sendStatus(404)
    }
})
*/

//get all groups where user is member
app.get('/groups', authenticateToken, (req, res) => {
    const userGroups = {};
    for (const groupName in groupModel) {
        if (groupModel[groupName].Members.includes(req.user.name)) {
            userGroups[groupName] = groupModel[groupName];
        }
    }
    res.json(userGroups);
})

app.get('/users', (req, res) => {
    res.json(users)
})

//https://www.youtube.com/watch?v=Ud5xKCYQTjM User authorization
//https://www.youtube.com/watch?v=mbsmsi7l3r4 JWT
app.post('/users', async (req, res) => {
    const existingUser = users.find(user => user.username=== req.body.name)
    if(existingUser){
        return res.status(400).send('Username already used');
    }
    if(loginJoke(req.body.password)) return res.status(400).send('Password already used by User: Aida');

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { username: req.body.username, password: hashedPassword }
        users.push(user)
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.username === req.body.username)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {

            const accessToken = jwt.sign(user, config.jwtSecretKey);

            res.status(200).json({ accessToken: accessToken});
        } else {
            res.status(401).send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})

function loginJoke(password){
    if (password === "Joke")
        return true;
}

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token =  authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, config.jwtSecretKey, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}



app.listen(port)

console.log("Server now listening on http://localhost:3000/")