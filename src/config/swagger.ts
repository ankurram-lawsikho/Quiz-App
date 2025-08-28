import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Quiz App API',
            version: '1.0.0',
            description: 'A comprehensive Quiz API with role-based authentication',
        },
        servers: [
            {
                url: 'http://localhost:3010',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: Bearer <token>'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/modules/**/*.ts', './src/modules/**/routes/*.ts', './src/modules/**/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);
