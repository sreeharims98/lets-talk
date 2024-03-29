import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SOCKET_CORS_ORIGIN: process.env.SOCKET_CORS_ORIGIN,
};
