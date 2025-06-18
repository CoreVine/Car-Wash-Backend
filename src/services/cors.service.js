const cors = require("cors");
const corsConfig = require("../config/cors.config");
const { CorsError } = require("../utils/errors");

let logger;

const corsService = {
  init: (loggerInstance) => {
    logger = loggerInstance;
    return corsService;
  },

  getCorsMiddleware: () => {
    const isDevelopment = process.env.NODE_ENV !== 'production';

    const corsOptions = isDevelopment ? {
      // Allow all origins in development
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      optionsSuccessStatus: 200
    } : {
      origin: function (origin, callback) {
        // Allow requests with no origin (like native mobile apps, curl, etc)
        if (!origin) return callback(null, true);

        if (corsConfig.allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          if (logger) {
            logger.warn(`[CORS] Request from origin ${origin} blocked`);
          }
          callback(new CorsError(origin));
        }
      },
      credentials: corsConfig.credentials,
      methods: corsConfig.methods,
      optionsSuccessStatus: corsConfig.optionsSuccessStatus,
    };

    return cors(corsOptions);
  },
};

module.exports = corsService;
