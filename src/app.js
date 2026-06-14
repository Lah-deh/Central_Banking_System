// src/app.js

const express = require("express");
const cors = require("cors");

require("./db/database");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/accounts", require("./routes/accountRoutes"));
app.use("/transactions", require("./routes/transactionRoutes"));
app.use("/analytics", require("./routes/analyticsRoutes"));
app.use("/ai", require("./routes/aiRoutes"));
app.get("/", (req, res) => {
  res.send("Smart Finance API Running");
});

app.listen(5173, () => {
  console.log("Server running on port 5173");
});