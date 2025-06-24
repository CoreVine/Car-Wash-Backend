const dotenv = require("dotenv");
const expressService = require("./services/express.service.js");
const sequelizeService = require("./services/sequelize.service.js");
const awsService = require("./services/aws.service.js");
const emailService = require("./services/email.service.js");
dotenv.config();

const services = [expressService, awsService, sequelizeService, emailService];

(async () => {
  try {
    for (const service of services) {
      await service.init();
    }
    // Import logging service after initialization to avoid circular dependencies
    const loggingService = require("./services/logging.service");
    const logger = loggingService.getLogger();
    logger.info("Server initialized successfully");
    //PUT ADDITIONAL CODE HERE...
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
})();

