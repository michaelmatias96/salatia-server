const {authCheckMiddlware} = require("./auth");
const bodyparser = require('body-parser');
const db = require("./DALs/db/db");
const cors = require("cors");
const express = require("express");
const moment = require('moment-timezone');
const webPush = require('web-push');
const admin = require("firebase-admin");



app.use(bodyparser.urlencoded({'extended': 'true'}));// TODO: check if this is needed
app.use(bodyparser.json());
app.use(bodyparser.json({type: 'application/vnd.api+json'})); // TODO: check if this is needed


var serviceAccount = require("./salatia-app-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://salatia-app.firebaseio.com"
});

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
        else if (origin.startsWith("https://salatia-app-admin-integ.herokuapp.com"))
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
    var auth0Id = request.user.sub;
    var extrasIds = request.body.extras;
    var meatId = request.body.meatType;
    var mealId = request.body.mealType;
    var pickupTime = moment(request.body.pickupTime).toDate();

    Promise.all([
            db.extrasDetails.getObjectIds(extrasIds),
            db.meatDetails.getObjectId(meatId),
            db.mealDetails.getObjectId(mealId),
            db.userDetails.getObjectId(auth0Id)

        ])
        .then(results => {
            let [extrasObjectIds, meatObjectId, mealObjectId,userObjectId] = results;
            return db.orders.createOrder(mealObjectId, meatObjectId, extrasObjectIds, userObjectId, pickupTime);
        })
        .then(results => {
            response.send({success : true});
            io.emit(config.socketUpdatesOrdersMsg, {'updateType': 'neworder', 'orderId': results._id});

        })
        .catch(err => {
            response.send({success: false});
        });
});


app.post('/userLogin', authCheckMiddlware, function(req,res){
    var userId = req.user.sub;
    var endPoint = req.user.endPoint;
    if(req.user.name!=null) var userName = req.user.name;
    if(req.user.picture_large!=null) var userPic = req.user.picture_large;

    db.userDetails.createUserIfNotExist(userId, userName, userPic, endPoint)
        .then(result => res.send({status: "login"}))
        .catch(err => res.send(err));
});

app.post('/updateUserEndPoint',authCheckMiddlware, function(req,res){
    var userId = req.user.sub;
    var endPoint =req.body.endPoint;

    db.userDetails.getAllEndPoints().then(data => console.log(data));
    db.userDetails.getObjectId(userId).then(objectId => {
        db.userDetails.updateUserEndPoint(objectId, endPoint)
            .then(result => res.send({status: "updated"}))
            .catch(err => res.send(err));
    });
});


app.post('/menuDetails', authCheckMiddlware, function (req, res) {
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

app.post('/removeOrder/',authCheckMiddlware, function(req,res) {
    var orderId = req.body.orderId

    db.orders.getOrderById(orderId)
        .then(results => {
                    let orderStatus = results[0].status
                    if (orderStatus == 'new') {
                        db.orders.removeOrderById(results[0]._id)
                            .then(result => res.send(result))
                            .catch(err => res.send(err));
                        io.emit(config.socketUpdatesOrdersMsg, {'updateType' : 'removeorder', 'orderId': orderId});
                    }

                    else {
                        res.send({
                            status: "error",
                            content: {
                                title: "Order Cancellation error",
                                message: "Could not cancel the specific order - either it is too late or something went wrong :(."
                            }
                        })
                    }
                })
        });

app.post('/orderDetails', authCheckMiddlware, function (req, res) {
    var currentOrder = req.body;
    Promise.all([
            db.mealDetails.getOne(currentOrder.mealType),
            db.extrasDetails.getFew(currentOrder.extras),
            db.meatDetails.getOne(currentOrder.meatType)
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

app.post('/userOrders', authCheckMiddlware, function(req,res){
    var auth0Id = req.user.sub;
        db.orders.getUserOrders(auth0Id)
            .then(result => res.send(result))
            .catch(err => res.send(err));
});


app.get('/getOrder/:id', function(req,res){
    var orderId = req.params.id;
    db.orders.getOrderById(orderId)
        .then(result => res.send(result))
        .catch(err => res.send(err));
});


app.post('/changeOrderStatus', function(req,res) {
    var id = req.body.id;
    var orderStatus = req.body.status;
    var orderStatusHeb;
    if(orderStatus == "progress")  orderStatusHeb="בהכנה";
    if(orderStatus == "finish")  orderStatusHeb="מוכנה";

    db.orders.changeStatus(id, orderStatus)
        .then(result => {
            res.send(result);
            io.emit(config.socketChangeOrderMsg);

            var payload = {
                notification: {
                    title: "מצב ההזמנה שלך התעדכן!",
                    body:  "ההזמנה שלך כעת " + orderStatusHeb,
                    click_action : "https://salatia-app.herokuapp.com/",
                    icon: 'assets/icon/Salad-icon.png'
                }
            };

            db.userDetails.getEndPointByObjectId(result.userId).then(endpoint => {
                admin.messaging().sendToDevice(endpoint[0].endPoint, payload)
                    .then(function (response) {
                        // See the MessagingDevicesResponse reference documentation for
                        // the contents of response.
                        console.log("Successfully sent message:", response);
                    })
                    .catch(function (error) {
                        console.log("Error sending message:", error);
                    });
            })
        });
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