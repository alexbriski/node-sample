const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
//listener - function when we get a new request (handling) - point to app MW function
const server = http.createServer(app);

server.listen(port);