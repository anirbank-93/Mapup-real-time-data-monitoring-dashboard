require("dotenv").config();

module.exports = {
    secret: process.env.PRIVATE_KEY,
    jwtExpiration: process.env.JWT_TOKEN_EXPIRATION,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
};