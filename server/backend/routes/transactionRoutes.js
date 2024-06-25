const groupModel = require("../group-model");
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api/transactions/{GroupId}/{TransactionId}:
 *   put:
 *     summary: Edit a transaction
 *     tags: [Transactions]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: GroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group
 *       - in: path
 *         name: TransactionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Group or transaction not found
 */
router.put('/:GroupId/:TransactionId', function (req, res) {
    const groupId = req.params.GroupId;
    const transactionId = req.params.TransactionId;
    const transaction = req.body;

    const thisGroup = groupModel[groupId];

    if (thisGroup && thisGroup.Members.includes(req.user.username)) {
        if (thisGroup.Transactions[transactionId]) {
            thisGroup.Transactions[transactionId] = {
                ...thisGroup.Transactions[transactionId],
                ...transaction,
                TransactionId: transactionId
            };
            res.status(200).send({
                message: 'Transaction updated successfully',
                transaction: thisGroup.Transactions[transactionId]
            });
        } else {
            res.status(404).send({ message: 'Transaction not found' });
        }
    } else {
        res.status(404).send({ message: 'Group not found' });
    }
});

/**
 * @swagger
 * /api/transactions/{GroupId}:
 *   get:
 *     summary: Get all transactions in a group
 *     tags: [Transactions]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: GroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Group not found
 */
router.get('/:GroupId', function (req, res) {
    const groupId = req.params.GroupId;
    const thisGroup = groupModel[groupId];

    if (thisGroup && thisGroup.Members.includes(req.user.username)) {
        res.send(Object.values(thisGroup.Transactions));
    } else {
        res.status(404).send({ message: 'Group not found' });
    }
});

/**
 * @swagger
 * /api/transactions/{GroupId}:
 *   post:
 *     summary: Add a new transaction
 *     tags: [Transactions]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: GroupId
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
 *     responses:
 *       201:
 *         description: Transaction added successfully
 *       404:
 *         description: Group not found
 */
router.post('/:GroupId', function (req, res) {
    const newTransaction = req.body;
    const groupId = req.params.GroupId;
    newTransaction.TransactionId = generateTransactionId();

    const thisGroup = groupModel[groupId];

    if (thisGroup) {
        thisGroup.Transactions[newTransaction.TransactionId] = newTransaction;

        res.status(201).send({
            message: 'Transaction added successfully',
            transaction: newTransaction
        });
    } else {
        res.status(404).send({ message: 'Group not found' });
    }
});

/**
 * @swagger
 * /api/transactions/{GroupId}/{TransactionId}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: GroupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group
 *       - in: path
 *         name: TransactionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Group or transaction not found
 */
router.delete('/:GroupId/:TransactionId', function (req, res) {
    const groupId = req.params.GroupId;
    const transactionId = req.params.TransactionId;
    const thisGroup = groupModel[groupId];

    if (thisGroup && thisGroup.Members.includes(req.user.username)) {
        if (thisGroup.Transactions[transactionId]) {
            const deletedTransaction = thisGroup.Transactions[transactionId];
            delete thisGroup.Transactions[transactionId];
            res.status(200).send({
                message: 'Transaction deleted successfully',
                transaction: deletedTransaction
            });
        } else {
            res.status(404).send({ message: 'Transaction not found' });
        }
    } else {
        res.status(404).send({ message: 'Group not found' });
    }
});

function generateTransactionId() {
    let transactionId;
    do {
        transactionId = Math.random().toString(36).substring(2, 15);
    } while (Object.values(groupModel).some(group =>
        Object.keys(group.Transactions).includes(transactionId)));
    return "_"+transactionId;
}

module.exports = router;
