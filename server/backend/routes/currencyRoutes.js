const express = require('express');
const convertEURto = require('../currencyAPI');
const router = express.Router();

/**
 * @swagger
 * /currency/convert:
 *   get:
 *     summary: Convert EUR to specified currency
 *     parameters:
 *       - in: query
 *         name: currencyType
 *         required: true
 *         schema:
 *           type: string
 *         description: The currency type to convert to
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: number
 *         description: The amount in EUR to convert
 *     responses:
 *       200:
 *         description: Converted amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 convertedAmount:
 *                   type: number
 *                   example: 118.5
 *       400:
 *         description: Missing or invalid query parameters
 *       500:
 *         description: Error converting currency
 */
router.get('/convert', async (req, res) => {
    const { currencyType, amount } = req.query;

    if (!currencyType || isNaN(amount)) {
        return res.status(400).send('Missing or invalid query parameters');
    }

    try {
        const convertedAmount = await convertEURto(currencyType, parseFloat(amount));
        res.json({ convertedAmount });
    } catch (error) {
        res.status(500).send('Error converting currency');
    }
});

module.exports = router;
