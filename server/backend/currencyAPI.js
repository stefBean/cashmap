const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'currencyCache.json');
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Load cache
function loadCache() {
    if (fs.existsSync(CACHE_FILE)) {
        return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
    return {data: null, lastFetched: 0};
}

// Save cache
function saveCache(cache) {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf8');
}

// Fetch currency data with caching
async function fetchCurrencyData() {
    const cache = loadCache();
    const now = Date.now();

    if (cache.data && (now - cache.lastFetched) < CACHE_DURATION) {
        console.log('Using cached data');
        return cache.data;
    }

    try {
        const response = await fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_jpxYjJT5ynqieGRSHQ2m8gXLSkYuLp8GKxOmGXtD&base_currency=EUR&type=fiat');
        const data = await response.json();

        if (response.ok) {
            console.log('Data fetched from API');
            cache.data = data;
            cache.lastFetched = now;
            saveCache(cache);
            return cache.data;
        } else {
            throw new Error('Unexpected response status: ' + response.status);
        }
    } catch (error) {
        console.error('Error fetching currency data:', error);
        if (cache.data) {
            console.log('Using stale cached data due to error');
            return cache.data;
        }
        throw error;
    }
}

async function convert(currencyIn, currencyOut, amount) {
    try {
        const data = await fetchCurrencyData();
        if (data && data.data) {

            if (!data.data[currencyOut]) {
                throw new Error("Invalid currency code: " + currencyOut);
            }
            const targetRate = data.data[currencyOut].value;


            if (currencyIn === "EUR") {
                return amount * targetRate;
            }
            else {
                if (!data.data[currencyIn]) {
                    throw new Error("Invalid currency code: " + currencyIn);
                }
                const eurRate = 1 / data.data[currencyIn].value;
                const eurAmount = amount * eurRate;
                return eurAmount * targetRate; // Use reciprocal for EUR to target conversion
            }
        } else {
            throw new Error("Error fetching exchange rate data.");
        }
    } catch (error) {
        console.error("Error converting currency:", error);
        throw error;
    }
}

module.exports = convert;

// Test
convert('USD', 'EUR', 10).then(convertedAmount => {
    console.log(`Converted Amount: ${convertedAmount}`);
}).catch(error => {
    console.error(error);
});
