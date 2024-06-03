const users = require("../user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const express = require("express");
const router = express.Router();
const groupModel = require("../group-model");

// Get all groups for a user
router.get('/:username/groups', function (req, res) {
    const username = req.params.username;
    const userGroups = Object.values(groupModel).filter(group =>
        group.Members.includes(username)
    );

    if (userGroups.length) {
        res.send(userGroups);
    } else {
        res.sendStatus(404);
    }
});

// Get all users
router.get('/', (req, res) => {
    res.json(users);
});

// Register a new user
router.post('/register', async (req, res) => {
    const existingUser = users.find(user => user.username === req.body.username);
    if (existingUser) {
        return res.status(400).send('Username already used');
    }
    if (loginJoke(req.body.password)) return res.status(400).send('Password already used by User: Aida');

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { username: req.body.username, password: hashedPassword };
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

// Login a user
router.post('/login', async (req, res) => {
    const user = users.find(user => user.username === req.body.username);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign(user, config.jwtSecretKey);
            res.status(200).json({ accessToken: accessToken });
        } else {
            res.status(401).send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
});

function loginJoke(password) {
    if (password === "Joke")
        return true;
}

module.exports = router;
