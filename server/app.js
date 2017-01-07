var express = require('express');
var restful = require('node-restful');
var bodyparser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var mongoose = restful.mongoose;
var cors = require('cors');

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
var Schema = mongoose.Schema;
var extraSchema = new Schema({
    id: Number,
    name: String,
    exists: Boolean,
    imgSrc: String
});

var extra = app.extra = restful.model('extra', extraSchema). methods(['get','update,','post', 'delete']);
extra.register(app, '/api/extra');
var extraModel = mongoose.model('extra',extraSchema);




// Define schema
var orderSchema = new Schema({
  orderType: Number,
  meatType: String,
  extras: [extraSchema],
  name: String,
  email: String,
  phone: String,
  finish: {type: Boolean, default: false},
  finishTime: Date,
  orderDate: { type: Date, default: Date.now }

});



// define basic REST API
var orders = app.orders = restful.model('orders', orderSchema). methods(['get','update,','post', 'delete']);
orders.register(app, '/api/orders');

// define model so we can create a custom REST
var ordersModel = mongoose.model('orders',orderSchema);


app.get('/wines', function(req, res) {
  res.send([{name:'wine1'}, {name:'wine2'}]);
});

app.get('/auth/login', function(req, res) {
    res.send({
        success: true,
        data: {
          name: "Michael Matias",
          email: "michael@michaelmatias.com"
        }
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
