const {authCheckMiddlware} = require("../auth");
const bodyparser = require('body-parser');
const db = require("../DALs/db/db");
const cors = require("cors");
const express = require("express");

const api = express.Router();
app.use("/api", api);

api.use(bodyparser.urlencoded({'extended': 'true'}));// TODO: check if this is needed
api.use(bodyparser.json());
api.use(bodyparser.json({type: 'application/vnd.api+json'})); // TODO: check if this is needed

api.use(cors({
    origin: function(origin, callback) {
        function ok() {
            callback(null, true);
        }

        function notAuthorized() {
            callback('Bad Request', false);
        }

        if (origin == null)
            ok();
        else if (origin.startsWith("http://localhost:"))
            ok();
        else if (origin.startsWith("file://"))
            ok();
        else if (origin == "chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop")
            ok();
        else
            notAuthorized();
    }
}));

api.post('/submitOrder', authCheckMiddlware, function (request, response) {
    var userId = request.user.sub;
    var extrasIds = request.body.extras;
    var meatId = request.body.meatType;
    var mealId = request.body.mealType;

    var extrasObjectIds;
    var meatObjectId;
    var mealObjectId;

    Promise.all([
        db.extrasDetails.getObjectIds(extrasIds),
        db.meatDetails.getObjectId(meatId),
        db.mealDetails.getObjectId(mealId)
    ])
        .then(results => {
            let [extrasObjectIds, meatObjectId, mealObjectId] = results;
            return db.orders.createOrder(mealObjectId, meatObjectId, extrasObjectIds, userId);
        })
        .then(results => {
            response.send({success : true});
        })
        .catch(err => {
            response.send({success: false});
        });
});

api.get('/menuDetails', /*authCheckMiddlware, */function (req, res) {
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

api.get('/orders', authCheckMiddlware, function(req,res){
    ordersModel.findOne({'userId': req.user.sub})
        .populate('extras', 'displayName imageSrc')
        .populate('mealType', 'displayName imageSrc')
        .populate('meatType', 'displayName imageSrc')
        .exec(function(err, orders){
            console.log(orders);
            res.json(orders);
        });
});

api.get('/mealTest', function(req, res) {
    db.mealDetails.getAll()
        .then(result => res.send(result))
        .catch(err => res.send(err));
});

