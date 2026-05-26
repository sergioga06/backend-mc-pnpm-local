import 'dotenv/config';
import * as Joi from 'joi';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'deploy/.env' });


interface EnvVars {
    PORT: number;
    DB_NAME: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DATABASE_URL?: string;
    NATS_SERVERS: string[];
}

const envsSchema = Joi.object({
    PORT: Joi.number().required(),
    DB_NAME: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DATABASE_URL: Joi.string().optional(),
    NATS_SERVERS: Joi.array().items(Joi.string()).required(),
}).unknown(true);

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS.split(',')
});

export const envs = {
    port: value.PORT,
    dbName: value.DB_NAME,
    dbPort: value.DB_PORT,
    dbUsername: value.DB_USERNAME,
    dbPassword: value.DB_PASSWORD,
    dbHost: value.DB_HOST,
    databaseUrl: value.DATABASE_URL,
    natsServers: value.NATS_SERVERS,
}