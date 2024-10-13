const express = require("express")
const { ForexRate, CurrencyPair } = require("../models/forex")
const { Op } = require("sequelize")
const router = express.Router()

router.post("/average-rate", averageRate)
router.post("/closing-rate", closingRate)
router.post("/add-pair", addCurrencyPair)

// 1. Get Average Conversion Rate
async function averageRate(req, res) {
    try {
        const { currencyPair, startDate, endDate } = req.body;

        if (!currencyPair || !startDate || !endDate) {
            return res.status(400).json({ message: "Missing required parameters." });
        }

        const rates = await ForexRate.findAll({
            where: {
                currencyPair,
                date: { [Op.between]: [startDate, endDate] }
            }
        });

        if (rates.length === 0) {
            return res.status(404).json({ message: "No rates found for the specified range." });
        }

        const avgRate = rates.reduce((sum, rate) => sum + rate.rate, 0) / rates.length;
        res.status(200).json({ averageRate: avgRate });
    } catch (error) {
        console.error("Error fetching average rate:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}

// 2. Get Closing Conversion Rate
async function closingRate(req, res) {
    try {
        const { currencyPair, date } = req.body;

        if (!currencyPair || !date) {
            return res.status(400).json({ message: "Missing required  parameters." });
        }

        const closingRate = await ForexRate.findOne({
            where: { currencyPair, date },
            order: [["date", "DESC"]]
        });

        if (closingRate) {
            res.status(200).json({ closingRate: closingRate.rate });
        } else {
            res.status(404).json({ message: "No data found for the specified date." });
        }
    } catch (error) {
        console.error("Error fetching closing rate:", error);
        res.status(500).json({ message: "Internal server error." });
    }

}


// 3. Add New Currency Pair (Optional)
async function addCurrencyPair(req,res) {
    try {
        const { currencyPair } = req.body;
    
        if (!currencyPair) {
          return res.status(400).json({ message: "Currency pair is required." });
        }
    
        const existingPair = await CurrencyPair.findOne({ where: { pair: currencyPair } });
        if (existingPair) {
          return res.status(409).json({ message: "Currency pair already exists." });
        }
    
        const newPair = await CurrencyPair.create({ pair: currencyPair });
    
        res.status(201).json({ message: `Currency pair ${newPair.pair} added successfully.` });
      } catch (error) {
        console.error("Error adding currency pair:", error);
        res.status(500).json({ message: "Internal server error." });
      }
   
}


module.exports = router 