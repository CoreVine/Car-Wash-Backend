const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const webhookRoutes = require('./webhook.routes');

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Default route
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

// Register webhook routes first to ensure they get raw body
router.use(webhookRoutes);

// Dynamically load all route files in this directory
// This allows you to add new route files without modifying this index file
fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && 
           file !== path.basename(__filename) && 
           file !== 'webhook.routes.js' && // Skip webhook routes as they're already registered
           file.slice(-3) === '.js';
  })
  .forEach(file => {
    const route = require(path.join(__dirname, file));
    router.use(route);
  });

module.exports = router;
