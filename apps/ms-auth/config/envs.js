"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
var joi = require("joi");
var envsSchema = joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    JWT_SECRET: joi.string().required(),
})
    .unknown(true);
var _b = envsSchema.validate(__assign(__assign({}, process.env), { NATS_SERVERS: (_a = process.env.NATS_SERVERS) === null || _a === void 0 ? void 0 : _a.split(',') })), error = _b.error, value = _b.value;
if (error) {
    throw new Error("Config validation error: ".concat(error.message));
}
var envVars = value;
exports.envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    jwtSecret: envVars.JWT_SECRET,
};
