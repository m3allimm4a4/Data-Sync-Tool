const AppError = require('../errors/appError');

const sendErrorDev = (error, res) =>
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error: error,
  });

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
};

const handleJwtError = () => {
  const message = 'Invalid token. Please log in again!';
  return new AppError(message, 401);
};

const handleTokenExpiredError = () => {
  const message = 'Your token has expired. Please log in again!';
  return new AppError(message, 401);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(error, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let errorObj = { ...error };

    if (error.name === 'JsonWebTokenError') {
      errorObj = handleJwtError();
    } else if (error.name === 'TokenExpiredError') {
      errorObj = handleTokenExpiredError();
    }

    return sendErrorProd(errorObj, res);
  }
};
