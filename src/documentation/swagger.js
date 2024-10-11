"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var swaggerAutogen = require("swagger-autogen");
var doc = {
    info: {
        title: 'My API',
        description: 'Description',
    },
    host: 'localhost:3000',
    basepath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
};
var outputFile = './src/swagger-output.json';
var routes = ['./src/http/routes/index.ts'];
swaggerAutogen()(outputFile, routes, doc);
