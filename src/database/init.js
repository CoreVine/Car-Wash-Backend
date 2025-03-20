const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');

const initDatabase = async () => {
  try {
    // Create Sequelize instance
    const sequelize = new Sequelize(databaseConfig);
    
    // Get all model files
    const modelsDir = path.join(__dirname, '../models');
    const modelFiles = fs
      .readdirSync(modelsDir)
      .filter(file => file.endsWith('.js'));
    
    // Initialize models
    const models = {};
    for (const file of modelFiles) {
      const modelPath = path.join(modelsDir, file);
      const model = require(modelPath);
      
      if (model.init) {
        model.init(sequelize);
        models[model.name] = model;
      }
    }
    
    // Set up associations between models
    Object.keys(models).forEach(modelName => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });
    
    console.log("[DATABASE] Models initialized successfully");
    
    return { sequelize, models };
  } catch (error) {
    console.error("[DATABASE] Initialization error:", error);
    throw error;
  }
};

module.exports = initDatabase;
