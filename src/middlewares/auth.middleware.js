const JwtService = require("../services/jwt.service");
const {BadTokenError} = require("../utils/errors/types/Api.error");

const authMiddleware = async (req, res, next) => {
  try {
    if (process.env.SERVER_JWT === "false") return next();

    const token = JwtService.jwtGetToken(req);

    const decoded = JwtService.jwtVerify(token);

    req.userId = decoded;

    return next();
  } catch (error) {
    next(new BadTokenError())
  }
};

module.exports = authMiddleware;
