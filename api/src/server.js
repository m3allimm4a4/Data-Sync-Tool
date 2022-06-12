process.on('uncaughtException', err => {
  console.log('Uncaught Exception', err);
  process.exit(1);
});

const app = require('./app');

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection', err);
  server.close(() => process.exit(1));
});
