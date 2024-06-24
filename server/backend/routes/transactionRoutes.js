const groupModel = require("../group-model")
const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /groups/{groupId}/transactions/{transactionId}:
 *   put:
 *     summary: Edit a transaction
 *     tags: [Transactions]
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
router.put('/groups/:groupId/transactions/:transactionId', function (req, res) {
    const groupId = req.params.groupId
    const transactionId = req.params.transactionId
    const transaction = req.body;

    if (!(groupId in groupModel)) {
        return res.status(404).send({message: 'Group not found'});
    }

    const transactionIndex = groupModel[groupId].Transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex !== -1) {
        groupModel[groupId].Transactions[transactionIndex] = transaction;
        res.status(200).send({
            message: 'Transaction updated successfully',
            transaction: transaction
        });
    } else {
        res.status(404).send({message: 'Transaction not found'});
    }
})

/**
 * @swagger
 * /groups/{groupId}/transactions:
 *   get:
 *     summary: Get all transactions in a group
 *     tags: [Transactions]
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
router.get('/:groupId/transactions', function (req, res) {
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
 * /groups/{groupId}/transactions:
 *   post:
 *     summary: Add a new transaction
 *     tags: [Transactions]
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
router.post('/:groupId/transactions', function (req, res) {
    const newTransaction = req.body
    const thisGroup = req.params.groupId
    newTransaction.TransactionId = generateTransactionId();

    if (thisGroup in groupModel) {
        groupModel[thisGroup].Transactions.push(newTransaction);

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
 * /groups/{groupId}/transactions/{transactionId}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
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
router.delete('/:groupId/transactions/:transactionId', function (req, res) {
    const groupId = req.params.groupId
    const transactionId = req.params.transactionId

    if (groupId in groupModel) {
        const transactionIndex = groupModel[groupId].Transactions.findIndex(transaction => transaction.id === transactionId);

        if (transactionIndex !== -1) {
            const deletedTransaction = groupModel[groupId].Transactions.splice(transactionIndex, 1)[0];
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
