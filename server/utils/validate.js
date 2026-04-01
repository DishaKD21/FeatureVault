const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data; 
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
  };
};

export default validate;