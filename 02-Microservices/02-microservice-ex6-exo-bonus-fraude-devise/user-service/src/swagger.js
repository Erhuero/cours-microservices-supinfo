import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User service API',
            version: '1.0.0',
            description: 'Gestion des utilisateurs et employes - AM BigBank'
        },
        servers: [{ url: 'http://localhost:3004' }],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email', 'password', 'role'],
                    properties: {
                        id: { type: 'integer', example: 1},
                        firstName: { type: 'string', example: 'Pierre'},
                        lastName: { type: 'string', example: 'Dulaine'},
                        email: { type: 'string', format: 'email', example: 'pierre.dulaine@gmail.com'},
                        role: { type: 'string', enum: ['client', 'employee', 'admin'], example: 'client' }
                    }
                },
                UserResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1},
                        firstName: { type: 'string', example: 'Pierre'},
                        lastName: { type: 'string', example: 'Dulaine'},
                        email: { type: 'string', example: 'pierre.dulaine@gmail.com'},
                        role: { type: 'string', example: 'client'},
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string', example: 'Message d\'erreur' }
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
        customSiteTitle: 'User Service - Swagger'
    }));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
}