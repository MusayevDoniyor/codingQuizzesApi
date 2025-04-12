const { isValidObjectId } = require("mongoose");

const validateObjectId =
  (paramNames = ["id"]) =>
  (req, res, next) => {
    if (!Array.isArray(paramNames)) paramNames = [paramNames];

    for (const paramName of paramNames) {
      const id =
        req.params[paramName] || req.body[paramName] || req.query[paramName];

      if (!id)
        return res.status(400).json({ error: `${paramName} is required` });

      if (!isValidObjectId(id))
        return res.status(400).json({ error: `Invalid ${paramName} format` });
    }

    next();
  };

module.exports = validateObjectId;
