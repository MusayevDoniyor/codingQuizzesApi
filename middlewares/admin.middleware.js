const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied", user: req.user });
  }

  next();
};

module.exports = adminMiddleware;
