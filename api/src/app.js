const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const toppingsRoutes = require('./routes/toppingsRoutes');
const ordersRoutes = require('./routes/ordersRoutes');
const testRoutes = require('./routes/testRoutes');
const AppError = require('./errors/appError');
const globalErrorHandler = require('./middlewares/errorMiddlewares');

const app = express();

//! Global middlewares

//Seurity HTTP headers
app.use(helmet());

//Logging HTTP requests
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body Parser
app.use(express.json({ limit: '10kb' }));

// Data sanitization against XSS
app.use(xss());

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api/v1/toppings', toppingsRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use('/api/v1/test', testRoutes);

app.all('*', (req, res, next) => {
  const error = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(error);
});

app.use(globalErrorHandler);

module.exports = app;
