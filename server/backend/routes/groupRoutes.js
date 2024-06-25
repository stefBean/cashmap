const users = require("../user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const express = require("express");
const router = express.Router();
const groupModel = require("../group-model");

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Get all groups for a user
 *     tags: [Groups]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/', function (req, res) {
    const userGroups = {};
    for (const groupName in groupModel) {
        if (groupModel[groupName].Members.includes(req.user.username)) {
            userGroups[groupName] = groupModel[groupName];
        }
    }
    res.json(userGroups);
});

/**
 * @swagger
 * /groups/{groupId}:
 *   get:
 *     summary: Get a group by ID
 *     tags: [Groups]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: A single group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Group not found
 */
router.get('/:groupId', function (req, res) {
    const id = req.params.groupId;
    const group = Object.values(groupModel).find(group => group.GroupId === id);

    if (group && group.Members.includes(req.user.username)) {
        res.send(group);
    } else {
        res.sendStatus(404);
    }
});

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               GroupName:
 *                 type: string
 *               Members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 */
router.post('/', function (req, res) {
    const newGroup = {
        GroupId: generateGroupId(),
        GroupName: req.body.GroupName,
        Members: req.body.Members,
        Transactions: []
    };
    groupModel[newGroup.GroupId] = newGroup;

    res.status(201).send({newGroup});
});

/**
 * @swagger
 * /groups/{groupId}:
 *   patch:
 *     summary: Update group details
 *     tags: [Groups]
 *     security:
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               GroupName:
 *                 type: string
 *               Members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       404:
 *         description: Group not found
 */
router.patch('/:groupId', function (req, res) {
    const groupId = req.params.groupId;
    const group = groupModel[groupId];

    if (group && group.Members.includes(req.user.username)) {
        if (req.body.GroupName !== undefined) {
            group.GroupName = req.body.GroupName;
        }
        if (req.body.Members !== undefined) {
            group.Members = req.body.Members;
        }

        res.status(200).send({
            message: 'Group updated successfully',
            group: group
        });
    } else {
        return res.status(404).send({message: 'Group not found'});
    }
});

/**
 * @swagger
 * /groups/{groupId}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *       404:
 *         description: Group not found
 */
router.delete('/:groupId', function (req, res) {
    const groupId = req.params.groupId;
    const selectedGroup = groupModel[groupId];

    if (groupId in groupModel && selectedGroup.Members.includes(req.user.username)) {

        delete groupModel[groupId];

        res.status(200).send({
            message: 'Group deleted successfully',
            group: selectedGroup
        });
    } else {
        res.status(404).send({message: 'Group not found'});
    }
});

/**
 * @swagger
 * /groups/{groupId}/balances:
 *   get:
 *     summary: Get balances of the group members
 *     tags: [Groups]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: Lists groups members balances
 *       404:
 *         description: Group not found
 *       403:
 *          description: User is not member of this group
 */
router.get('/:groupId/balances', function (req, res) {
    const groupId = req.params.groupId;
    const user = req.user;
    const group = groupModel[groupId];

    if (!group) {
        return res.status(404).send({message: 'Group not found'});
    }

    if (!group.Members.includes(user.username)) {
        return res.status(403).send({message: 'User is not a member of this group'});
    }

    const balances = calculateBalances(group, user.username);
    res.status(200).send(balances);
});

function calculateBalances(group, username) {
    const balances = {};

    Object.values(group.Transactions).forEach(transaction => {

        if (transaction.Type === "EQUAL") {
            const amountPerPerson = transaction.Amount / transaction.Receiver.length;
            updateEqualBalances(transaction, amountPerPerson);
        } else if (transaction.Type === "EXACT") {
            transaction.Receiver.forEach((receiver, index) => {
                const exactAmount = transaction.Weight[index];
                updateExactBalances(transaction, receiver, exactAmount);
            });
        }
    });

function updateEqualBalances(transaction, amountPerPerson) {
    if (transaction.Sender === username) {
        // User is the sender; add the amount others owe them
        transaction.Receiver.forEach(receiver => {
            if (receiver !== username) {
                balances[receiver] = (balances[receiver] || 0) + amountPerPerson;
            }
        });
    } else if (transaction.Receiver.includes(username)) {
        // User is a receiver; subtract the amount they owe to the sender
        balances[transaction.Sender] = (balances[transaction.Sender] || 0) - amountPerPerson;
    }
}

function updateExactBalances(transaction, receiver, exactAmount) {
    if (transaction.Sender === username && receiver !== username) {
        // When the user is the sender in an EXACT type
        balances[receiver] = (balances[receiver] || 0) + exactAmount;
    }
    if (receiver === username && transaction.Sender !== username) {
        // When the user is the receiver in an EXACT type
        balances[transaction.Sender] = (balances[transaction.Sender] || 0) - exactAmount;
    }
}

return balances;
}


function generateGroupId() {
    let groupId;
    do {
        groupId = Math.random().toString(36).substring(2, 9);
    } while (groupId in groupModel);
    return groupId;
}

module.exports = {groupModel, router};