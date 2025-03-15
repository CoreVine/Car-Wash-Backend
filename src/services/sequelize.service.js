import { Sequelize } from "sequelize";
import databaseConfig from "../config/database";
import fs from "fs";

// The model files are loaded here
const modelFiles = fs
  .readdirSync(__dirname + "/../models/")
  .filter((file) => file.endsWith(".js"));

const sequelizeService = {
  init: async () => {
    try {
      let connection = new Sequelize(databaseConfig);

      /* Loading models automatically */
      const models = [];
     
      // This is where models are initialized
      for (const file of modelFiles) {
        const model = await import(`../models/${file}`);

        model.default.init(connection);
        models.push(model.default);
      }

      // This is where associations are set up
      for (const model of models) {
        model.associate && model.associate(connection.models);
      }

      console.log("[SEQUELIZE] Database service initialized");
    } catch (error) {
      console.log("[SEQUELIZE] Error during database service initialization");
      throw error;
    }
  },
};

export default sequelizeService;
