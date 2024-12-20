import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  const token = req.header("Authorization") || req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded.id; // Attach user ID to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export { protect };