var express = require('express');
var restful = require('node-restful');
var bodyparser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var mongoose = require('mongoose');
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
var Objectid = Schema.Types.ObjectId;





// Define schemas
var orderSchema = new Schema({

    mealType : { type: Objectid, ref: 'mealtypes' },
    meatType : { type: Objectid, ref: 'meattypes' },
    extras : [{ type: Objectid, ref: 'extras' }],
    userID : { type: Objectid, ref: 'users' },
    date : { type: Date, default: Date.now },
    status : String

});


var usersSchema = new Schema({
    authID: String
});

var meatSchema = new Schema({

    name : String,
    displayName : String,
    comments : String

});

var mealSchema = new Schema({
    name : String,
    displayName : String,
    comments : String});


var extrasSchema = new Schema({
    name : String,
    displayName : String,
    imageSrc : String,
    inStock : Boolean,
    comments : String});

//Models:
var extraModel = mongoose.model('extras',extrasSchema);
var mealModel = mongoose.model('mealtypes',mealSchema);
var usersModel = mongoose.model('users',usersSchema);
var meatModel = mongoose.model('meattypes',meatSchema);
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


//post userID and get order with all the display names
app.post('/order', function(req,res){


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
