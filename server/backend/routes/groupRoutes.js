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



module.exports = router;
