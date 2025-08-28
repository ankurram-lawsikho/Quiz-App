import "reflect-metadata";
import { DataSource } from "typeorm";
import { Quiz } from "../entities/Quiz";
import { Question } from "../entities/Question";
import { Answer } from "../entities/Answer";
import { User } from "../entities/User";
import { Role } from "../entities/Role";
import { Permission } from "../entities/Permission";
import { createClient } from "redis";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "quizdb",
    synchronize: process.env.DB_SYNCHRONIZE === "true" || false,
    logging: process.env.DB_LOGGING === "true" || false,
    entities: [Quiz, Question, Answer, User, Role, Permission],
});

export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));