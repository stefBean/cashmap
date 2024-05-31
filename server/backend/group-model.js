module.exports = {
    Group1: {
        Members: ["Anna", "Stefi", "Aida", "Tobias"],
        Transactions: [
            {
                Amount: 80,
                Sender: "Tobias",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Weight: "EQUAL"
            },
            {
                Amount: 40,
                Sender: "Aida",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Weight: "EQUAL"
            },
            {
                Amount: 40,
                Sender: "Anna",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Weight: "EQUAL"
            }
        ]
    },
    Group2: {
        Members: ["Anna", "Stefi", "Aida", "Tobias"],
        Transactions: [
            {
                Amount: 80,
                Sender: "Tobias",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Weight: "EQUAL"
            },
            {
                Amount: 40,
                Sender: "Aida",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Weight: "EQUAL"
            },
            {
                Amount: 40,
                Sender: "Anna",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Weight: "EQUAL"
            }
        ]
    }
}