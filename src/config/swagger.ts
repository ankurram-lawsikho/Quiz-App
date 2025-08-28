import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz API',
      version: '1.0.0',
      description: 'A RESTful API for managing quizzes with Redis caching',
      contact: {
        name: 'Quiz API Support',
        email: 'support@quizapi.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3010',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Quiz: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The quiz ID'
            },
            title: {
              type: 'string',
              description: 'The quiz title'
            },
            questions: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Question'
              }
            }
          }
        },
        Question: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The question ID'
            },
            text: {
              type: 'string',
              description: 'The question text'
            },
            answers: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Answer'
              }
            }
          }
        },
        Answer: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The answer ID'
            },
            text: {
              type: 'string',
              description: 'The answer text'
            },
            isCorrect: {
              type: 'boolean',
              description: 'Whether this answer is correct'
            }
          }
        },
        QuizSubmission: {
          type: 'object',
          properties: {
            answers: {
              type: 'object',
              description: 'Object mapping question IDs to answer IDs',
              additionalProperties: {
                type: 'integer'
              }
            }
          }
        },
        QuizResult: {
          type: 'object',
          properties: {
            score: {
              type: 'integer',
              description: 'Number of correct answers'
            },
            total: {
              type: 'integer',
              description: 'Total number of questions'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./src/modules/**/*.ts']
};

export const specs = swaggerJsdoc(options);
