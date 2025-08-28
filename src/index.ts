import 'dotenv/config';
import express from "express";
import swaggerUi from 'swagger-ui-express';
import { AppDataSource, redisClient } from "./config/data-source";
import { specs } from "./config/swagger";
import quizRoutes from "./modules/quiz/routes/quiz.routes";
import authRoutes from "./modules/auth/routes/auth.routes";
import permissionRoutes from "./modules/auth/routes/permission.routes";

const main = async () => {
    try {
        await AppDataSource.initialize();
        console.log("PostgreSQL Connected!");
        await redisClient.connect();
        console.log("Redis Connected!");
    } catch (error) {
        console.error("Error connecting to databases:", error);
        process.exit(1);
    }

    const app = express();
    app.use(express.json());

    // Swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: "Quiz API Documentation"
    }));

    // Routes
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/auth", permissionRoutes);
    app.use("/api/v1/quizzes", quizRoutes);

    const PORT = process.env.PORT || 3010;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
};

main();