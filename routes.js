const {authCheckMiddlware} = require("./auth");
const bodyparser = require('body-parser');
const db = require("./DALs/db/db");
const cors = require("cors");
const express = require("express");
const moment = require('moment-timezone');
const webPush = require('web-push');
const admin = require("firebase-admin");
const utils = require("./utils");


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
    let decryptedData = utils.decrypt(request.body.data);
    function submitOrder(tries) {
        let auth0Id = request.user.sub,
            endPoint = request.user.endPoint,
            userName = request.user.name,
            userPic = request.user.picture_large,
            extrasIds = decryptedData.extras,
            meatId = decryptedData.meatType,
            mealId = decryptedData.mealType,
            pickupTime = moment(decryptedData.pickupTime).toDate();

        return Promise.all([
            db.extrasDetails.getObjectIds(extrasIds),
            db.meatDetails.getObjectId(meatId),
            db.mealDetails.getObjectId(mealId),
            db.userDetails.getObjectId(auth0Id)
        ])
            .then(results => {
                let [extrasObjectIds, meatObjectId, mealObjectId, userObjectId] = results;
                if (userObjectId == null)
                    return Promise.reject("User ID was not found in DB");

                return db.orders.createOrder(mealObjectId, meatObjectId, extrasObjectIds, userObjectId, pickupTime);
            })
            .then(results => {
                response.send(utils.getWrappedEncryptedData({success: true}));
                io.emit(config.socketUpdatesOrdersMsg, {'updateType': 'neworder', 'orderId': results._id});
            })
            .catch(err => {
                if (tries <= 0)
                    return Promise.reject(err);
                else
                    return db.userDetails.createUserIfNotExist(auth0Id, userName, userPic, endPoint)
                        .then(result => submitOrder(tries - 1));
            });
    }

    submitOrder(4)
        .catch(err => {
            console.error(err != null ? err.stack || err : err);
            response.send(utils.getWrappedEncryptedData({success: false}));
        });
});

app.post('/userLogin', authCheckMiddlware, function(req,res){
    var userId = req.user.sub;
    var endPoint = req.user.endPoint;
    if(req.user.name!=null) var userName = req.user.name;
    if(req.user.picture_large!=null) var userPic = req.user.picture_large;

    db.userDetails.createUserIfNotExist(userId, userName, userPic, endPoint)
        .then(result => res.send(utils.getWrappedEncryptedData({status: "login"})))
        .catch(err => res.send(utils.getWrappedEncryptedData(err)));
});

app.post('/updateUserEndPoint',authCheckMiddlware, function(req,res){
    let decryptedData = utils.decrypt(req.body.data);
    var userId = req.user.sub;
    var endPoint = decryptedData.endPoint;

    // db.userDetails.getAllEndPoints()
    //     .then(data => console.log(data));

    db.userDetails.getObjectId(userId)
        .then(objectId => {
            if (objectId == null)
                return Promise.reject();

            return db.userDetails.updateUserEndPoint(objectId, endPoint)
                .then(result => res.send(utils.getWrappedEncryptedData({status: "updated"})))

        })
        .catch(err => res.send(utils.getWrappedEncryptedData(err)));
});


app.post('/menuDetails', authCheckMiddlware, function (req, res) {
    Promise.all([
            db.mealDetails.getAll(),
            db.extrasDetails.getAll(),
            db.meatDetails.getAll()
        ])
        .then(results => {
            let [mealDetails, extrasDetails, meatDetails] = results;
            let encryptedData = {
                status: "ok",
                content: {
                    mealDetails,
                    extrasDetails,
                    meatDetails
                }
            };
            res.send(encryptedData);
        })
        .catch(err => {
            let encryptedData = utils.getWrappedEncryptedData({
                status: "error",
                content: {
                    title: "",
                    message: ""
                }
            });
            res.send(encryptedData);
        });
});

app.post('/removeOrder/',authCheckMiddlware, function(req,res) {
    let decryptedData = utils.decrypt(req.body.data);
    var orderId = decryptedData.orderId;

    db.orders.getOrderById(orderId)
        .then(results => {
                    let orderStatus = results[0].status
                    if (orderStatus == 'new') {
                        db.orders.removeOrderById(results[0]._id)
                            .then(result => res.send(utils.getWrappedEncryptedData(result)))
                            .catch(err => res.send(utils.getWrappedEncryptedData(err)));
                        io.emit(config.socketUpdatesOrdersMsg, {'updateType' : 'removeorder', 'orderId': orderId});
                    }

                    else {
                        let encryptedData = utils.getWrappedEncryptedData({
                            status: "error",
                            content: {
                                title: "Order Cancellation error",
                                message: "Could not cancel the specific order - either it is too late or something went wrong :(."
                            }
                        });
                        res.send(encryptedData);
                    }
                })
        });

app.post('/orderDetails', function (req, res) {
    let decryptedData = utils.decrypt(req.body.data);
    Promise.all([
            db.mealDetails.getOne(decryptedData.mealType),
            db.extrasDetails.getFew(decryptedData.extras),
            db.meatDetails.getOne(decryptedData.meatType)
        ])
        .then(results => {
            let [mealDetails, extrasDetails, meatDetails] = results;
            let encryptedData = utils.getWrappedEncryptedData({
                status: "ok",
                content: {
                    mealDetails,
                    extrasDetails,
                    meatDetails
                }
            })
            res.send(encryptedData);
        })
        .catch(err => {
            let encryptedData = utils.getWrappedEncryptedData({
                status: "error",
                content: {
                    title: "",
                    message: ""
                }
            });
            res.send(encryptedData);
        });
});

app.post('/userOrders', authCheckMiddlware, function(req,res){
    let auth0Id = req.user.sub;
    let endPoint = req.user.endPoint;
    let userName ,  userPic;


    db.orders.getUserOrders(auth0Id)
            .then(result => res.send(utils.getWrappedEncryptedData(result)))
            .catch(err => {
                if(req.user.name!=null)  userName = req.user.name;
                if(req.user.picture_large!=null)  userPic = req.user.picture_large;

                db.userDetails.createUserIfNotExist(auth0Id, userName, userPic, endPoint)
                    .then(result =>{
                        db.orders.getUserOrders(auth0Id)
                            .then(result => res.send(utils.getWrappedEncryptedData(result)))
                            .catch(err => res.send(utils.getWrappedEncryptedData(err)));
                    })
                    .catch(err => res.send(utils.getWrappedEncryptedData(err)));
            });
});

app.get('/getOrder/:id', function(req,res){
    var orderId = req.params.id;
    db.orders.getOrderById(orderId)
        .then(result => res.send(utils.getWrappedEncryptedData(result)))
        .catch(err => res.send(utils.getWrappedEncryptedData(err)));
});


app.post('/changeOrderStatus', function(req,res) {
    let decryptedData = utils.decrypt(req.body.data);
    var id = decryptedData.id;
    var orderStatus = decryptedData.status;
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
        .then(result => res.send(utils.getWrappedEncryptedData(result)))
        .catch(err => res.send(utils.getWrappedEncryptedData(err)));
});
app.get('/getCompleted', function(req,res){
    db.orders.getCompletedOrders()
        .then(result => res.send(utils.getWrappedEncryptedData(result)))
        .catch(err => res.send(utils.getWrappedEncryptedData(err)));
});

app.get('/mealTest', function(req, res) {
    log.log('getting meal test');
    db.mealDetails.getAll()
        .then(result => res.send(utils.getWrappedEncryptedData(result)))
        .catch(err => res.send(utils.getWrappedEncryptedData(err)));
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