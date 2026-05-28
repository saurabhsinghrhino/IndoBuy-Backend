const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (userRole !== requiredRole) {
      return res.status(403).json({
        message: "Forbidden - Access denied, Only Admin can access this page.",
      });
    }
    next();
  };
};

module.exports = { roleMiddleware };
