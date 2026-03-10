import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Account Service API',
            version: '1.0.0',
            description: 'Service ce notiifications de transactions - AM BigBank'
        },
        servers: [{ url: 'http://localhost:3002' }],
        components: {
            schemas: {
                Notification: {
                    type: 'object',
                    properties: {
                        fromAccount: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 1 },
                                label: { type: 'string', example: 'Compte courant' }
                            }
                        },
                        toAccount: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 2 },
                                label: { type: 'string', example: 'Compte epargne' }
                            }
                        },
                        amount: { type: 'number', example: 250.00 },
                        description: { type: 'string', example: 'Virement mensuel' }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customSiteTitle: 'Notification Service - Swagger'
    }));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
}