const groupModel = require("../group-model")
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /transactions/{groupId}/{transactionId}:
 *   put:
 *     summary: Edit a transaction
 *     tags: [Transactions]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group
 *       - in: path
 *         name: transactionId
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
router.put('/:groupId/:transactionId', function (req, res) {
    const groupId = req.params.groupId
    const transactionId = req.params.transactionId
    const transaction = req.body;

    const thisGroup = Object.values(groupModel).find(group => group.GroupId === groupId);

    if (!thisGroup) {
        return res.status(404).send({message: 'Group not found'});
    }

    const transactionIndex = thisGroup.Transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex !== -1) {
        thisGroup.Transactions[transactionIndex]= {
            ...thisGroup.Transactions[transactionIndex],
            ...transaction,
            TransactionId: transactionId
        };
        res.status(200).send({
            message: 'Transaction updated successfully',
            transaction: thisGroup.Transactions[transactionIndex]
        });
    } else {
        res.status(404).send({message: 'Transaction not found'});
    }
})

/**
 * @swagger
 * /transactions/{groupId}:
 *   get:
 *     summary: Get all transactions in a group
 *     tags: [Transactions]
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
router.get('/:groupId', function (req, res) {
    const groupId = req.params.groupId
    if (groupId in groupModel) {
        const transactionsInThisGroup = groupModel[groupId].Transactions;
        res.send(transactionsInThisGroup)
    } else {
        res.status(404).send({message: 'Group not found'});
    }
})

/**
 * @swagger
 * /transactions/{groupId}:
 *   post:
 *     summary: Add a new transaction
 *     tags: [Transactions]
 *     security:
 *      - bearerAuth: []
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
 *     responses:
 *       201:
 *         description: Transaction added successfully
 *       404:
 *         description: Group not found
 */
router.post('/:groupId', function (req, res) {
    const newTransaction = req.body
    const groupId = req.params.groupId
    newTransaction.TransactionId = generateTransactionId();

    const thisGroup = Object.values(groupModel).find(group => group.GroupId === groupId);

    if (thisGroup) {
        thisGroup.Transactions.push(newTransaction);

        res.status(201).send({
            message: 'Transaction added successfully',
            transaction: newTransaction
        });
    } else {
        res.status(404).send({message: 'Group not found'});
    }
})

/**
 * @swagger
 * /transactions/{groupId}/{transactionId}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the group
 *       - in: path
 *         name: transactionId
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
router.delete('/:groupId/:transactionId', function (req, res) {
    const groupId = req.params.groupId
    const transactionId = req.params.transactionId
    const thisGroup = Object.values(groupModel).find(group => group.GroupId === groupId);

    if (thisGroup) {
        const transactionIndex = thisGroup.Transactions.findIndex(transaction => transaction.TransactionId === transactionId);

        if (transactionIndex !== -1) {
            const deletedTransaction = thisGroup.Transactions.splice(transactionIndex, 1)[0];
            res.status(200).send({
                message: 'Transaction deleted successfully',
                transaction: deletedTransaction
            });
        } else {
            res.status(404).send({message: 'Transaction not found'});
        }
    } else {
        res.status(404).send({message: 'Group not found'});
    }
})

function generateTransactionId() {
    let transactionId;
    do {
        transactionId = Math.random().toString(36).substring(2, 15);
    } while (Object.values(groupModel).some(group =>
        group.Transactions.some(tx => tx.TransactionId === transactionId)));
    return transactionId;
}

module.exports = router;
