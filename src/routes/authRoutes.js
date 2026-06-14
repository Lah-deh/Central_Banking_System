const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const router = express.Router();

const SECRET = "supersecret";

//REGISTER

router.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users(name,email,password)
     VALUES(?,?,?)`,
    [name, email, hashed],
    function(err) {

      if(err){
        return res.status(400).json({
          error: err.message
        });
      }

      res.json({
        message: "User created"
      });

    }
  );

});

//LOGIN

router.post("/login", (req, res) => {

  const { email, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE email=?`,
    [email],
    async (err, user) => {

      if(!user){
        return res.status(404).json({
          message:"User not found"
        });
      }

      const match =
        await bcrypt.compare(
          password,
          user.password
        );

      if(!match){
        return res.status(401).json({
          message:"Invalid credentials"
        });
      }

      const token = jwt.sign(
        { id: user.id },
        SECRET
      );

      res.json({ token });

    }
  );

});


module.exports = router;