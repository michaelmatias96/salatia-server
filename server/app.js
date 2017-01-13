var express = require('express');
var restful = require('node-restful');
var bodyparser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var mongoose = restful.mongoose;
var cors = require('cors');
var async = require('async');

var app = express();

// <<-- Midelewares -->>
var root = __dirname.replace("server", "");
console.log(root);

app.use(cors());
app.use(morgan('dev'));
app.use(methodOverride());


app.use(bodyparser.urlencoded({'extended': 'true'}));
app.use(bodyparser.json());
app.use(bodyparser.json({type: 'application/vnd.api+json'}));


// <<-- DB -->>
mongoose.connect('mongodb://localhost/hatuliaDB');


// Define schema
var Schema = mongoose.Schema;
var orderSchema = new Schema({
    orderType: Number,
    meatType: String,
    extras: [String],
    name: String,
    email: String,
    phone: String,
    finish: {type: Boolean, default: false},
    finishTime: Date,
    orderDate: {type: Date, default: Date.now}
});

var mealDetailsSchema = new Schema({
    name: String,
    displayName: String,
    comments: String,
    imgUrl: String,
    price: String
});

var extrasDetailsSchema = new Schema({
    name: String,
    displayName: String,
    comments: String,
    imgUrl: String
});

var meatDetailsSchema = new Schema({
    name: String,
    displayName: String,
    comments: String,
    imgUrl: String
});

// define model so we can create a custom REST
var ordersModel = mongoose.model('orders', orderSchema);
var mealDetailsModel = mongoose.model('mealtypes', mealDetailsSchema);
var extrasDetailsModel = mongoose.model('extras', extrasDetailsSchema);
var meatDetailsModel = mongoose.model('meattypes', meatDetailsSchema);

app.get('/wines', function (req, res) {
    res.send([{name: 'wine1'}, {name: 'wine2'}]);
});

app.post('/submitOrder/', function (request, response) {
    console.log(request.body);
});

app.get('/menuDetails/', function (request, response) {
    var calls = [];
    var result = {};

    calls.push(function(callback) {
        mealDetailsModel.find({}, function (err, data) {
            if (err) return callback(err);
            result['mealDetails'] = data;
        });
    });

    calls.push(function(callback) {
        extrasDetailsModel.find({}, function (err, data) {
            if (err) return callback(err);
            result['extrasDetails'] = data;
        });
    });

    calls.push(function(callback) {
        meatDetailsModel.find({}, function (err, data) {
            if (err) return callback(err);
            result['meatDetails'] = data;
        });
    });

    async.parallel(calls, function(err, result) {
        /* this code will run after all calls finished the job or
         when any of the calls passes an error */
        if (err)
            return console.log(err);
        response.send(result);
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
