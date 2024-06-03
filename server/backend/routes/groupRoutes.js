const users = require("../user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const express = require("express");
const router = express.Router();
const groupModel = require("../group-model");

// Get all groups for a user
router.get('/', function (req, res) {
    const userGroups = {};
    for (const groupName in groupModel) {
        if (groupModel[groupName].Members.includes(req.user.username)) {
            userGroups[groupName] = groupModel[groupName];
        }
    }
    res.json(userGroups);
})

/*
router.get('/:groupId', function (req, res) {
    const id = req.params.groupId
    const group = Object.values(groupModel).find(group => group.GroupId === id);

    if (group) {
        res.send(group);
    } else {
        res.sendStatus(404)
    }
});

//create new group
router.post('/', function (req, res) {
    const newGroup = {
        GroupId: generateGroupId(),
        Name: req.body.name,
        Members: req.body.members,
        Transactions: []
    };
    groupModel[newGroup.GroupId]= newGroup;

    res.status(201).send({newGroup});
});

//change group details, like name or members ??
router.put('/:groupId', function (req, res) {
    const groupId = req.params.groupId;
    const group = groupModel[groupId];

    if (!group) {
        return res.status(404).send({ message: 'Group not found' });
    }

    group.Name = req.body.name || group.Name;
    group.Members = req.body.members || group.Members;

    res.status(200).send({
        message: 'Group updated successfully',
        group: group
    });
});

router.delete('/groups/:groupId', function (req, res) {
    const groupId = req.params.groupId;

    if (groupId in groupModel) {
        const deletedGroup = groupModel[groupId];
        delete groupModel[groupId];

        res.status(200).send({
            message: 'Group deleted successfully',
            group: deletedGroup
        });
    } else {
        res.status(404).send({ message: 'Group not found' });
    }

})

function generateGroupId() {
    let groupId;
    do {
        groupId = Math.random().toString(36).substring(2, 9);
    } while (groupId in groupModel);
    return groupId;
}
*/
module.exports = router;
