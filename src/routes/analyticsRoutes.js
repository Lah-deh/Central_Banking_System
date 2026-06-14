const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/overview", (req, res) => {

  db.all(
    `
    SELECT
      type,
      category,
      SUM(amount) as total
    FROM transactions
    GROUP BY type, category
    `,
    [],
    (err, rows) => {

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

          categories[row.category] =
            (categories[row.category] || 0) + row.total;
        }

      });

      const balance = income - expenses;

      res.json({
        income,
        expenses,
        balance,
        categories
      });

    }
  );

});

module.exports = router;