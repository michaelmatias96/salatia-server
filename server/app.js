var express = require('express');
var app = express();

var jwt = require('express-jwt');
var cors = require('cors');

app.use(cors());

var restful = require('node-restful');
var bodyparser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var mongoose = restful.mongoose;
var async = require('async');

var config = require('./config').config;

var authCheck = jwt({
    secret: new Buffer(config.auth0SecretKey),
    audience: config.auth0ClientId
});

// <<-- Midelewares -->>
var root = __dirname.replace("server", "");
console.log(root);

app.use(morgan('dev'));
app.use(methodOverride());


app.use(bodyparser.urlencoded({'extended': 'true'}));
app.use(bodyparser.json());
app.use(bodyparser.json({type: 'application/vnd.api+json'}));


// <<-- DB -->>
mongoose.connect(config.mongoDbConnectionString);


// Define schema
var Schema = mongoose.Schema;
var orderSchema = new Schema({
    mealId: Schema.Types.ObjectId,
    meatId: Schema.Types.ObjectId,
    extras: [Schema.Types.ObjectId],
    userId: String,
    status: {type: String, default: config.newOrderDefaultStatus},
    creationTime: {type: Date, default: new Date().toISOString()}
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

app.post('/submitOrder/', authCheck, function (request, response) {
    var calls = [];
    var userId = request.user.sub;

    var mealId = request.body.mealType;
    var mealObjectId;
    calls.push(function(callback) {
        mealDetailsModel.findOne({'id' : mealId}).exec(function(err, result) {
            if (err) console.log(err);
            mealObjectId = mongoose.Types.ObjectId(result._id.toString());
            callback(err, result);
        })
    });

    var meatId = request.body.meatType;
    var meatObjectId;
    calls.push(function(callback) {
        meatDetailsModel.findOne({'id' : mealId}).exec(function(err, result) {
            if (err) console.log(err);
            meatObjectId = mongoose.Types.ObjectId(result._id.toString());
            callback(err, result);
        })
    });


    var extrasIds = request.body.extras;
    var extrasObjectIds;
    calls.push(function(callback) {
        extrasDetailsModel.find({id: { $in : extrasIds}}).exec(function(err, result) {
            result = result.map(function (document) {
                return mongoose.Types.ObjectId(document._id.toString());
            });
            extrasObjectIds = result;
            callback(err, result);
        });
    });

    async.parallel(calls, function(err, data) {
        /* this code will run after all calls finished the job or
         when any of the calls passes an error */
        if (err)
            return console.log(err);
        var order = new ordersModel({mealId: mealObjectId, meatId: meatObjectId, extras: extrasObjectIds, user: userId});
        order.save(function(result) {
            response.send({success : true});
        });
    });


});

app.get('/menuDetails/', authCheck, function (request, response) {
    var calls = [];

    calls.push(function(callback) {
        mealDetailsModel.find({}, function (err, data) {
            if (err) return callback(err);
            data = {'mealDetails' : data};
            callback(null, data);
        });
    });

    calls.push(function(callback) {
        extrasDetailsModel.find({}, function (err, data) {
            if (err) return callback(err);
            data = {'extrasDetails' : data};
            callback(null, data);
        });
    });

    calls.push(function(callback) {
        meatDetailsModel.find({}, function (err, data) {
            if (err) return callback(err);
            data = {'meatDetails' : data};
            callback(null, data);
        });
    });

    async.parallel(calls, function(err, data) {
        /* this code will run after all calls finished the job or
         when any of the calls passes an error */
        if (err)
            return console.log(err);
        response.send(data);
    });
});


//post userID and get order with all the display names
app.post('/orders', function(req,res){
    usersModel.findOne({'auth0ID':req.body.userID} , function(err, user) {
            if (!user) return res.end("no found user");
            console.log(user);

            ordersModel.findOne({'userID': user._id})
                .populate('extras', 'displayName imageSrc')
                .populate('mealType', 'displayName imageSrc')
                .populate('meatType', 'displayName imageSrc')
                .exec(function(err, orders){
                    console.log(orders);
                    res.json(orders);
                })
        });



});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
