async function convertEURto(currencyType, amount) {

    try {
        const response = await fetch("https://api.currencyapi.com/v3/latest?apikey=cur_live_jpxYjJT5ynqieGRSHQ2m8gXLSkYuLp8GKxOmGXtD&base_currency=EUR&type=fiat");
        const data = await response.json();

        if (data && data.data && data.data[currencyType]) {
            const rate = data.data[currencyType].value;
            return amount * rate;
        } else {
            throw new Error("Invalid currency type or data not found.");
        }
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        throw error;
    }
}

module.exports = convertEURto;

//Test
convertEURto('USD', 100).then(convertedAmount => {
    console.log(`Converted Amount: ${convertedAmount}`);
}).catch(error => {
    console.error(error);
});

