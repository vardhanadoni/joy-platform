// server/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  // Determine the status code: if a status was set on the response, use it, otherwise 500 (server error)
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message, // The error message
    // In production, you might not want to send the stack trace for security reasons
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;