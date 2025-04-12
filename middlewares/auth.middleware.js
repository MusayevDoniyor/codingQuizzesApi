const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization ended" });
    }

    const token = authHeader.split(" ")[1];

    if (!token)
      return res.status(401).json({ message: "No token, authorization ended" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        console.log("Access denied mid");

        return res
          .status(403)
          .json({ message: "Access denied", user: req.user });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
