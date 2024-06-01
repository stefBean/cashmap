const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const groupModel = require('./group-model');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = []

//https://expressjs.com/en/starter/static-files.html ?
app.use(express.static(path.join(__dirname, '../frontend')));

//get group per ID
app.get('/groups/:groupId', function (req, res) {
    const id = req.params.groupId
    const group = Object.values(groupModel).find(group => group.GroupId === id);

    if (group) {
        res.send(group);
    } else {
        res.sendStatus(404)
    }
})

//get all groups where user is member
app.get('/users/:username/groups', function (req, res) {
    const username = req.params.username
    const userGroups = Object.values(groupModel).filter(group =>
        group.Members.includes(username)
    );

    if (userGroups.length) {
        res.send(userGroups);
    } else {
        res.sendStatus(404);
    }
})

//create new group
app.post('/groups', function (req, res) {
    const newGroup = {
        GroupId: generateGroupId(),
        Name: req.body.name,
        Members: req.body.members,
        Transactions: []
    };
    groupModel[newGroup.GroupId]= newGroup;

    res.status(201).send({newGroup});
});

//change group details, like name or members
app.put('/groups/:groupId', function (req, res) {
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

app.delete('/groups/:groupId', function (req, res) {
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


app.get('/users', (req, res) => {
    res.json(users)
})

//https://www.youtube.com/watch?v=Ud5xKCYQTjM
app.post('/users', async (req, res) => {
    const existingUser = users.find(user => user.name === req.body.name)
    if (existingUser) {
        return res.status(400).send('Username already used');
    }
    if (loginJoke(req.body.password)) return res.status(400).send('Password already used by User: Aida');

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
})

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})

function loginJoke(password) {
    if (password === "Joke")
        return true;
}

app.post('/')

//new transaction
app.post('/groups/:groupId/transactions', function (req, res) {

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
        res.status(404).send({ message: 'Group not found' });
    }
})

//delete transaction
app.delete('/groups/:groupId/transactions/:transactionId', function (req, res) {

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
            res.status(404).send({ message: 'Transaction not found' });
        }
    } else {
        res.status(404).send({ message: 'Group not found' });
    }

})

//edit transaction
app.put('/groups/:groupId/transactions/:transactionId', function (req, res) {

    const groupId = req.params.groupId
    const transactionId = req.params.transactionId
    const transaction = req.body;

    if (!(groupId in groupModel)) {
        return res.status(404).send({ message: 'Group not found' });
    }

    const transactionIndex = groupModel[groupId].Transactions.findIndex(t => t.id === transactionId);
    if (transactionIndex !== -1) {
        groupModel[groupId].Transactions[transactionIndex] = transaction;
        res.status(200).send({
            message: 'Transaction updated successfully',
            transaction: transaction
        });
    } else {
        res.status(404).send({ message: 'Transaction not found' });
    }

})

//get all transactions in a group
app.get('/groups/:groupId/transactions', function (req, res) {

    const groupId = req.params.groupId
    if (groupId in groupModel) {
        const transactionsInThisGroup = groupModel[groupId].Transactions;
        res.send(transactionsInThisGroup)
    } else {
        res.status(404).send({ message: 'Group not found' });
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

app.listen(port)

console.log("Server now listening on http://localhost:3000/")