const {authCheckMiddlware} = require("./auth");
const bodyparser = require('body-parser');
const db = require("./DALs/db/db");
const cors = require("cors");
const express = require("express");

app.use(bodyparser.urlencoded({'extended': 'true'}));// TODO: check if this is needed
app.use(bodyparser.json());
app.use(bodyparser.json({type: 'application/vnd.api+json'})); // TODO: check if this is needed

app.use(cors({
    origin: function(origin, callback) {
        function ok() {
            callback(null, true);
        }

        function notAuthorized() {
            callback('Bad Request', false);
        }

        if (origin == null)
            ok();
        else if (origin.startsWith(config.cors.mobileApp))
            ok();
        else if (origin.startsWith(config.cors.admin))
            ok();
        else if (origin.startsWith("file://"))
            ok();
        else if (origin.startsWith("https://hatulia-app-admin-integ.herokuapp.com"))
            ok();
        else if (origin == "chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop")
            ok();
        else if (origin == "chrome-extension://aicmkgpgakddgnaphhhpliifpcfhicfo")
            ok();
        else
            notAuthorized();
    }
}));

var io = require('socket.io').listen(server);
var newstate;

io.on('connection', function (socket) {

    console.log('user connected');



    socket.on('newState', function (data) {
        newstate = data;
        updateUser(newstate);
    });
});



app.post('/submitOrder', authCheckMiddlware, function (request, response) {
    var userId = request.user.sub;
    console.log(request.user);
   if(request.user.name!=null) var userName = request.user.name;
    if(request.user.picture_large!=null) var userPic = request.user.picture_large;

    var extrasIds = request.body.extras;

    var meatId = request.body.meatType;
    var mealId = request.body.mealType;


    Promise.all([
            db.extrasDetails.getObjectIds(extrasIds),
            db.meatDetails.getObjectId(meatId),
            db.mealDetails.getObjectId(mealId),
            db.userDetails.getObjectId(userId)

        ])
        .catch(err => {
            return db.userDetails.createUser(userId, userName, userPic);
        })
        .then(results => {
            let [extrasObjectIds, meatObjectId, mealObjectId, userObjectId] = results;
            return db.orders.createOrder(mealObjectId, meatObjectId, extrasObjectIds, userObjectId);
        })
        .then(results => {
            response.send({success : true});
            io.emit("neworder");

        })
        .catch(err => {
            response.send({success: false});
        });
});

app.get('/menuDetails', authCheckMiddlware, function (req, res) {
    Promise.all([
            db.mealDetails.getAll(),
            db.extrasDetails.getAll(),
            db.meatDetails.getAll()
        ])
        .then(results => {
            let [mealDetails, extrasDetails, meatDetails] = results;

            res.send({
                status: "ok",
                content: {
                    mealDetails,
                    extrasDetails,
                    meatDetails
                }
            });
        })
        .catch(err => {
            res.send({
                status: "error",
                content: {
                    title: "",
                    message: ""
                }
            });
        });
});

app.get('/orderDetails', authCheckMiddlware, function (req, res) {
    var currentOrder = req.body;
    db.orders.getOrderDetails(currentOrder)
        .then(result => res.send(result))
        .catch(err => res.send(err))
});

app.get('/userOrders', authCheckMiddlware, function(req,res){
    var userId = req.user.sub;
    db.orders.getUserOrders(userId)
        .then(result => res.send(result))
        .catch(err => res.send(err));
});


app.get('/getOrder/:id', function(req,res){
    var orderId = req.params.id;
    db.orders.getOrderById(orderId)
        .then(result => res.send(result))
        .catch(err => res.send(err));
});


app.post('/changeOrderStatus', function(req,res){
    var id = req.body.id;
    var orderStatus = req.body.status;
    db.orders.changeStatus(id, orderStatus)
        .then(result => {
            res.send(result);
            io.emit('neworder')
        })
        .catch(err => res.send(err));
});

app.get('/getProgressAndNewOrders', function(req,res){
    db.orders.getProgressAndNewOrders()
        .then(result => res.send(result))
        .catch(err => res.send(err));
});
app.get('/getCompleted', function(req,res){
    db.orders.getCompletedOrders()
        .then(result => res.send(result))
        .catch(err => res.send(err));
});

app.get('/mealTest', function(req, res) {
    log.log('getting meal test');
    db.mealDetails.getAll()
        .then(result => res.send(result))
        .catch(err => res.send(err));
});

app.get('/', function(req, res) {
    res.send("Hello world!");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    console.error(req, res);
});