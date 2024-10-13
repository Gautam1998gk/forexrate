const axios = require('axios');
const cheerio = require('cheerio');
const { CurrencyPair, ForexRate } = require('../models/forex');


function getPreviousDay() {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Move back by one day
    return today.toISOString().slice(0, 10); // Format: YYYY-MM-DD
  }
  
async function scrapeForexRates() {
  const currencyPairs = await CurrencyPair.findAll({ where: { isActive: true } });
  const date = getPreviousDay();

  for (let pairObj of currencyPairs) {
    const pair = pairObj.pair;  // e.g., 'GBP/USD'
    const [fromCurrency, toCurrency] = pair.split('/');  // Split the pair

    const url = `https://www.x-rates.com/historical/?from=${fromCurrency}&to=${toCurrency}&amount=1&date=${date}`;
    
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const anchorHref = `https://www.x-rates.com/graph/?from=${fromCurrency}&to=${toCurrency}`;
     const rate = $(`a[href="${anchorHref}"]`).first().text().trim();

     await ForexRate.create({ currencyPair: pair, rate: parseFloat(rate), date });
      
    } catch (error) {
      console.error(`Error scraping rate for ${pair}: ${error.message}`);
    }
  }
}

module.exports = scrapeForexRates;
