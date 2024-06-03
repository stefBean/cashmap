module.exports = {
    Group1: {
        Members: ["Anna", "Stefi", "Aida", "Tobias"],
        Transactions: [
            {
                Amount: 80,
                Sender: "Tobias",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Type: "EXACT",
                Weight: ["10, 20, 30, 20"]
            },
            {
                Amount: 40,
                Sender: "Aida",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Type: "EQUAL"
            },
            {
                Amount: 40,
                Sender: "Anna",
                Receiver: ["Tobias", "Anna", "Stefi", "Aida"],
                Type: "EQUAL"
            }
        ]
    },
    Group2: {
        Members: ["Anna", "Stefi", "Aida"],
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