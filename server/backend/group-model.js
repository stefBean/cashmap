module.exports = {
    Group1: {
        GroupId: "5g0zswb",
        GroupName: "Group 1",
        Members: ["Anna", "Stefi", "Aida", "Tobias"],
        Transactions: [
            {
                TransactionId: "kqj5g0zsw0bq7",
                Amount: 80,
                Sender: "Tobias",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Type: "EXACT",
                Weight: ["10, 20, 30, 20"]
            },
            {
                TransactionId: "3n5b9m8df0xi6",
                Amount: 40,
                Sender: "Aida",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Type: "EQUAL"
            },
            {
                TransactionId: "hj47x9n2v3ks0",
                Amount: 40,
                Sender: "Anna",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Type: "EQUAL"
            }
        ]
    },
    Group2: {
        GroupId: "m8df0xi",
        GroupName: "Group 2",
        Members: ["Anna", "Stefi", "Aida", "Tobias"],
        Transactions: [
            {
                TransactionId: "x9q3b0w5p1d2z",
                Amount: 80,
                Sender: "Tobias",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Weight: "EQUAL"
            },
            {
                TransactionId: "0pq8s4v6y1m3n",
                Amount: 40,
                Sender: "Aida",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Weight: "EQUAL"
            },
            {
                TransactionId: "z3b6v9w2s5k8j",
                Amount: 40,
                Sender: "Anna",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Weight: "EQUAL"
            }
        ]
    }
}