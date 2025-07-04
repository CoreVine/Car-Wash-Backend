const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// cors will be imported through the corsService
const {
  globalErrorHandler,
  notFoundHandler,
} = require("../middlewares/errorHandler.middleware");
const responseMiddleware = require("../middlewares/response.middleware");
const path = require("path");
const multerErrorHandler = require("../middlewares/multerErrorHandler.middleware");
const apiRouter = require("../routes");
const loggingService = require("./logging.service");
const rateLimitService = require("./rateLimit.service");
const corsService = require("./cors.service");
const paymentViewsRouter = require("../routes/payment-views.routes");

let server;
let logger;

const expressService = {
  init: async () => {
    try {
      // Initialize logging service first
      const { logger: winstonLogger, morgan } = await loggingService.init();
      logger = winstonLogger;

      // Initialize rate limiting service
      if (process.env.NODE_ENV === "production") {
        await rateLimitService.init();
      }

      // Initialize CORS service
      corsService.init(logger);

      server = express();

      // Apply response formatting middleware
      server.use(responseMiddleware);

      // Apply CORS middleware (before other middleware)
      server.use(corsService.getCorsMiddleware());

      // Handle Stripe webhooks before body parsing
      server.use(
        "/api/stripe-webhook",
        express.raw({ type: "application/json" })
      );

      // Apply middleware
      server.use(bodyParser.json());

      // Use cookie-parser middleware
      server.use(cookieParser());

      if (process.env.NODE_ENV === "production") {
        // Apply rate limiting middleware to all requests
        server.use(rateLimitService.standardLimiter());
      }
      // Apply morgan middleware for HTTP request logging
      server.use(morgan);

      // Apply routes
      // Static file serving for uploads
      server.use(
        "/uploads",
        express.static(path.join(__dirname, "../../uploads"))
      );
      // Serve payment views
      server.use("/views", express.static(path.join(__dirname, "../views")));
      // API routes under /api
      server.use("/api", apiRouter);
      // Payment view routes
      server.use("/", paymentViewsRouter);

      // Handle 404 routes
      server.use("*", notFoundHandler);

      // DEBUG!!
      server.use(express.raw({ type: "*/*" }));
      server.use(express.urlencoded({ extended: true }));

      // MUST BE AT THE END TO HANDLE ERRORS!
      // Handle multer-specific errors first
      server.use(multerErrorHandler);

      // Apply global error handler
      server.use(globalErrorHandler);

      // Listen on all network interfaces
      server.listen(process.env.SERVER_PORT, () => {
        logger.info(
          `[EXPRESS] Express initialized on port ${process.env.SERVER_PORT}`
        );
      });
    } catch (error) {
      logger.error(
        "[EXPRESS] Error during express service initialization",
        error
      );
      throw error;
    }
  },
};

module.exports = expressService;
