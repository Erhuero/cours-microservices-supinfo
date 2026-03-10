import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BigBank Admin API',
            version: '1.0.0',
            description: 'Interface d\'administration - Vue d\'ensemble du système'
        },
        servers: [{ url: 'http://localhost:3001' }]
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
        customTitle: 'BigBank Admin - Swagger'
    }));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
}