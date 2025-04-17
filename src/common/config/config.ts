import dotnev from "dotenv";

dotnev.config();

export default {
  appConfig: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "prod",
    tableRoutes: process.env.TABLE_ROUTES === "true" || false,
    apiVersion: process.env.API_VERSION || "v1",
  },
  postgresConfig: {
    host: process.env.POSTGRES_HOST || "localhost",
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "soprano",
    auto_async: process.env.POSTGRES_AUTO_ASYNC === "true" || false,
    logging: process.env.POSTGRES_LOGGING === "true" || false,
  },
  jwtConfig: {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    secretPass: process.env.JWT_PASS || "secret",
  },
  bcryptConfig: {
    saltRounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  },
};
