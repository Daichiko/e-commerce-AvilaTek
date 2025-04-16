import { DataSource } from "typeorm";
import env from "./config";
import Usuario from "../models/usuarios";

export const PostgresConnectionDB = new DataSource({
  type: "postgres",
  host: env.postgresConfig.host,
  port: Number(env.postgresConfig.port),
  username: env.postgresConfig.user,
  password: env.postgresConfig.password,
  database: env.postgresConfig.database,
  synchronize: false,
  logging: true,

  entities: [Usuario],
  extra: {
    retryAttempts: 5,
    retryDelay: 1000,
  },
});
