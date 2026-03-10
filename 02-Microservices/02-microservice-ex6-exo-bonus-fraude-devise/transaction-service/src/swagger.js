import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Transaction Service API',
            version: '1.0.0',
            description: 'Gestion des transferts bancaires - AM BigBank'
        },
        servers: [{ url: 'http://localhost:3005' }],
        components: {
            schemas: {
                Transaction: {
                    type: 'object',
                    required: ['fromAccountId', 'toAccountId', 'amount'],
                    properties: {
                        id: { type: 'integer', example: 1 },
                        fromAccountId: { type: 'integer', example: 1},
                        toAccountId: { type: 'integer', example: 1},
                        amount: { type: 'number', example: 1200.00},
                        description: {type: 'string', example: 'Virement mensuel'},
                        status: { type: 'string', enum: ['pending', 'completed', 'failed'], example: 'completed' }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app){
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customSiteTitle: 'Transaction Service - Swagger'
    }));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
}