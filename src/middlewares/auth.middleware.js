const loggingService = require("../services/logging.service");
const JwtService = require("../services/jwt.service");
const { BadTokenError } = require("../utils/errors/types/Api.error");

const logger = loggingService.getLogger();

const authMiddleware = async (req, res, next) => {
  try {
    if (process.env.SERVER_JWT === "false") return next();

    const token = JwtService.jwtGetToken(req);

    const decoded = JwtService.jwtVerify(token);

    req.userId = decoded;

    return next();
  } catch (error) {
    logger.error(error);
    next(new BadTokenError());
  }
};

module.exports = authMiddleware;
