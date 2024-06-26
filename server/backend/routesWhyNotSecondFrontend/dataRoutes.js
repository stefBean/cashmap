const express = require('express');
const router = express.Router();
const { users } = require('../routes/userRoutes');
const { groupModel } = require('../routes/groupRoutes')

const countUsers = () => {
    return users.length;
};

const countGroups = () => {
    return Object.keys(groupModel).length;
};

const countTransactions = () => {
    let transactionCount = 0;
    for (const group of Object.values(groupModel)) {
        transactionCount += Object.keys(group.Transactions).length;
    }
    return transactionCount;
};

router.get('/users', (req, res) => {
    const userCount = countUsers();
    res.json({ userCount });
});

router.get('/groups', (req, res) => {
    const groupCount = countGroups();
    res.json({ groupCount });
});

router.get('/transactions', (req, res) => {
    const transactionCount = countTransactions();
    res.json({ transactionCount });
});

router.get('/', (req, res) => {
    const userCount = countUsers();
    const groupCount = countGroups();
    const transactionCount = countTransactions();
    res.json({ userCount, groupCount, transactionCount });
});

module.exports = router;