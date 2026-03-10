import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Account Service API',
            version: '1.0.0',
            description: 'Gestion des comptes bancaires - AM BigBank'
        },
        servers: [{ url: 'http://localhost:3003' }],
        components: {
            schemas: {
                Account: {
                    type: 'object',
                    required: ['userId', 'type'],
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'string', enum: ['checking', 'savings'],  example: 'checking' },
                        type: { type: 'string', enum: ['checking', 'savings'], example: 'checking' },
                        balance: { type: 'number', example: 1500.00 }
                    }
                },
                BalanceUpdate: {
                    type: 'object',
                    required: ['amount'],
                    properties: {
                        amount: { type: 'number', example: 500, description: 'Positif = credit, negatif = debit'}
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
        customSiteTitle: 'Account Service - Swagger'
    }));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
}