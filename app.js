const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users')
//password as a process.env.VARIABLE as an env variable in the server
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:'+process.env.MONGO_ATLAS_PW+'@node-rest-shard-00-00-8slaz.mongodb.net:27017,node-rest-shard-00-01-8slaz.mongodb.net:27017,node-rest-shard-00-02-8slaz.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shard-0&authSource=admin', {
    useMongoClient: true
});

//saves log when requests are done
app.use(morgan('dev'));
//make folder public available
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//prevent CORS errors
app.use((req, res, next) => {
    //access to any origin(client)
    res.header('Access-Control-Allow-Origin', '*');
    //all these headers can be appended
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    //OPTIONS request always come first
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        //no need to go to routes (return)
        return res.status(200).json({});
    }
    //go to other routes. without next it blocks
    next();
})

//middleware - requests come here
//get a request, responde and special next function to execute after this one is execute, to move the MW forward
//make sure we receive a response
/*
app.use((req, res, next) => {
    res.status(200).json({
        message: 'Hello world'
    }); //OK
});
*/

//first argument is filter
//only requests which start with /products or /orders will be handled by this MW
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    //forward the request
    next(error);
});

//handles all kinds of errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
