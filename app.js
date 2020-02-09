// This is the root nodejs application file
const http = require('http');
const routes = require('./routes');

const server = http.createServer(routes.requestHandler);

server.listen(3000);
