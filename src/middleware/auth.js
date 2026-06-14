const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = auth.split(" ")[1]; // MUST be Bearer token format

  try {
    const decoded = jwt.verify(token, "supersecret");

    req.user = decoded;
    next();


  }
   catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};