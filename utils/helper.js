const checkPermission = (req, userId) => {
  if (!req.user) return false;
  return req.user.id === userId.toString() || req.user.role === "admin";
};

module.exports = checkPermission;
