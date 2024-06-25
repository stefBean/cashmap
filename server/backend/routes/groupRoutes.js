const users = require("../user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");
const express = require("express");
const router = express.Router();
const groupModel = require("../group-model");

/**
 * @swagger
 * /api/groups:
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
    res.send(userGroups);
});

/**
 * @swagger
 * /api/groups/{groupId}:
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
 * /api/groups:
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
 * /api/groups:
 *   get:
 *     summary: Get all groups for a user
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of user groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Group Name"
 *                   Members:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: "username"
 *           application/xml:
 *             schema:
 *               type: object
 *               properties:
 *                 groups:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Group Name"
 *                       Members:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "username"
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
        return res.status(404).send({ message: 'Group not found' });
    }
});

/**
 * @swagger
 * /api/groups/{groupId}:
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

function generateGroupId() {
    let groupId;
    do {
        groupId = Math.random().toString(36).substring(2, 9);
    } while (groupId in groupModel);
    return "_"+groupId;
}

module.exports = {groupModel, router};