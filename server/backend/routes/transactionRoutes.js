//edit transaction
const groupModel = require("../group-model")
const express = require("express");
const router = express.Router();

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

//get all transactions in a group
router.get('/:groupId/transactions', function (req, res) {

    const groupId = req.params.groupId
    if (groupId in groupModel) {
        const transactionsInThisGroup = groupModel[groupId].Transactions;
        res.send(transactionsInThisGroup)
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

//new transaction
router.post('/:groupId/transactions', function (req, res) {

    const newTransaction = req.body
    const thisGroup = req.params.groupId
    newTransaction.TransactionId = generateTransactionId();

    if (groupId in groupModel) {
        groupModel[groupId].Transactions.push(newTransaction);

        res.status(201).send({
            message: 'Transaction added successfully',
            transaction: newTransaction
        });
    } else {
        res.status(404).send({message: 'Group not found'});
    }
})

//delete transaction
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

module.exports = router;