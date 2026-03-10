import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BigBankApi Gateway',
            version: '1.0.0',
            description: 'Service d\'entrée principal, agrégateur de users, d\'accounts et de transactions'
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'password', 'role'],
                    properties: {
                        firstName: { type: 'string', example: 'Jean' },
                        lastName: { type: 'string', example: 'Dupont'},
                        email: { type: 'string', format: 'email', example: 'mirabeau@gmail.com'},
                        password: { type: 'string', example: 'Lemotdepassemicroservice!' },
                        role: { type: 'string' , enum: ['client', 'employee', 'admin'], example: 'client' }
                    }
                },
                Account: {
                    type: 'object',
                    required: ['type'],
                    properties: {
                        type: { type: 'string', enum: ['checking', 'savings'], example: 'checking' },
                        balance: { type: 'number', example: 0 }
                    }
                },
                Transaction:{
                    type: 'object',
                    required: ['fromAccountId', 'toAccountId', 'amount'],
                    properties: {
                        fromAccountId: { type: 'integer', example: 1 },
                        toAccountId: { type: 'integer', example: 2 },
                        amount: { type: 'number', example: 250 },
                        description: { type: 'string', example: 'Virement' }
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
        customSiteTitle: 'BigBank Gateway - Swagger'
    }));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'aplication/json');
        res.send(specs);
    });
}