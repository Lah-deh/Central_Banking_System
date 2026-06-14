const express = require("express");
const db = require("../db/database");
const { generateAdvice } = require("../services/aiService");

const router = express.Router();

router.get("/advice", (req, res) => {

  db.all(
    `
    SELECT type, category, SUM(amount) as total
    FROM transactions
    GROUP BY type, category
    `,
    async (err, rows) => {

      if (err) {
        return res.status(500).json({ error: err.message });
      }

      let income = 0;
      let expenses = 0;
      let categories = {};

      rows.forEach(row => {
        if (row.type === "income") {
          income += row.total;
        } else {
          expenses += row.total;
          categories[row.category] = row.total;
        }
      });

      const financialData = {
        income,
        expenses,
        balance: income - expenses,
        categories
      };

      const advice = await generateAdvice(financialData);

      res.json({
        summary: financialData,
        advice
      });

    }
  );

});

module.exports = router;