const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();


router.post("/", auth, (req, res) => {

  const {
    account_id,
    amount,
    type,
    category,
    description
  } = req.body;

  db.run(
    `INSERT INTO transactions
     (account_id, amount, type, category, description)
     VALUES(?,?,?,?,?)`,
    [
      account_id,
      amount,
      type,
      category,
      description
    ],
    function(err){

      if(err){
        return res.status(400).json(err);
      }

      res.json({
        message:"Transaction added"
      });

    }
  );

});

router.get("/", auth, (req,res)=>{

  db.all(
    `
      SELECT t.*
      FROM transactions t
      JOIN accounts a
      ON t.account_id = a.id
      WHERE a.user_id = ?
    `,
    [req.user.id],
    (err, rows)=>{

      if(err){
        return res.status(500).json(err);
      }

      res.json(rows);

    }
  );

});

module.exports = router;