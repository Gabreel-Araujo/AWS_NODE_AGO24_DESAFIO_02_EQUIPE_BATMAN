import swaggerAutogen = require('swagger-autogen');

const doc = {
	info: {
		title: 'My API',
		description: 'Description',
	},
	host: 'localhost:3000',
	basepath: '/',
	schemes: ['http'],
	consumes: ['application/json'],
	produces: ['application/json'],
	securityDefinitions: {
		BearerAuth: {
			type: 'apiKey',
			name: 'Authorization',
			in: 'header',
			description: 'Token de autenticação',
		},
	},
	security: [
		{
			BearerAuth: [],
		},
	],
};

const outputFile = './src/swagger-output.json';
const routes = ['./src/http/routes/index.ts'];

swaggerAutogen()(outputFile, routes, doc);
