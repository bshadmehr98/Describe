const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Handle Unhandled Promise Rejection
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Rejection`);
  process.exit(1);
});

// Setting up config file
dotenv.config({path: 'backend/config/config.env'});

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
      `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

// Handle Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
