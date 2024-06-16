const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'currencyCache.json');
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Load cache
function loadCache() {
    if (fs.existsSync(CACHE_FILE)) {
        return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
    return { data: null, lastFetched: 0 };
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
        throw error; // Re-throw error if no cached data is available
    }
}

async function convertEURto(currencyType, amount) {
    try {
        const data = await fetchCurrencyData();
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

// Test
convertEURto('USD', 100).then(convertedAmount => {
    console.log(`Converted Amount: ${convertedAmount}`);
}).catch(error => {
    console.error(error);
});
