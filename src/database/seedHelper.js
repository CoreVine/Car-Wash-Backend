const initDatabase = require('./init');

// Initialize the database before seeding
const initBeforeSeeding = async () => {
  try {
    // This will initialize all models with the Sequelize connection
    await initDatabase();
    console.log('[SEED] Database initialized successfully before seeding');
    return true;
  } catch (error) {
    console.error('[SEED] Error initializing database before seeding:', error);
    return false;
  }
};

module.exports = {
  initBeforeSeeding
};
