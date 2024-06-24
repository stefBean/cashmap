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

    if (group) {
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               members:
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
        Name: req.body.name,
        Members: req.body.members,
        Transactions: []
    };
    groupModel[newGroup.GroupId] = newGroup;

    res.status(201).send({ newGroup });
});

/**
 * @swagger
 * /groups/{groupId}:
 *   put:
 *     summary: Update group details
 *     tags: [Groups]
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
 *               name:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Group updated successfully
 *       404:
 *         description: Group not found
 */
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

/**
 * @swagger
 * /groups/{groupId}:
 *   delete:
 *     summary: Delete a group
 *     tags: [Groups]
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
});

function generateGroupId() {
    let groupId;
    do {
        groupId = Math.random().toString(36).substring(2, 9);
    } while (groupId in groupModel);
    return groupId;
}

module.exports = router;
