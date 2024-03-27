const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Check if Authorization header is present
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Bearer token is required" });
  }

  // Extract token from Authorization header
  const token = authHeader.split(" ")[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, "secretkey");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { verifyToken };
