const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, (req, res) => {
  const { bank_name, balance } = req.body;

  db.run(
    `INSERT INTO accounts(user_id, bank_name, balance)
     VALUES(?,?,?)`,
    [req.user.id, bank_name, balance],
    function(err) {

      if(err){
        return res.status(400).json({
          error: err.message
        });
      }

      res.json({
        message: "Account added",
        id: this.lastID
      });

    }
  );
});

router.get("/", auth, (req, res) => {

  db.all(
    `SELECT * FROM accounts WHERE user_id=?`,
    [req.user.id],
    (err, accounts) => {

      if(err){
        return res.status(500).json(err);
      }

      const totalBalance =
        accounts.reduce(
          (sum, acc) => sum + acc.balance,
          0
        );

      res.json({
        accounts,
        totalBalance
      });

    }
  );

});

module.exports = router;