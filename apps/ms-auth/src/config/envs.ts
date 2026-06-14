import * as dotenv from 'dotenv';
import * as path from 'path';
import * as joi from 'joi';

// 👇 FORZAMOS la ruta absoluta desde la raíz de tu proyecto hasta el .env
dotenv.config({ path: path.join(process.cwd(), 'apps/ms-auth/.env') });

interface EnvVars {
  PORT: number;
  NATS_SERVERS: string[];
  JWT_SECRET: string;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  NATS_SERVERS: joi.array().items(joi.string()).required(),
  JWT_SECRET: joi.string().required(),
}).unknown(true);

const natsRaw = process.env.NATS_SERVERS ? process.env.NATS_SERVERS.split(',') : [];

const { error, value } = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: natsRaw,
});

if (error) {
  throw new Error(`Config validation error: ${error.message} (Asegúrate de que el archivo .env existe y está guardado)`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  natsServers: envVars.NATS_SERVERS,
  jwtSecret: envVars.JWT_SECRET,
};