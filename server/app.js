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
  orderDate: { type: Date, default: Date.now }

});

// define basic REST API
var orders = app.orders = restful.model('orders', orderSchema). methods(['get','update,','post', 'delete']);
orders.register(app, '/api/orders');

// define model so we can create a custom REST
var ordersModel = mongoose.model('orders',orderSchema);









// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
