const {authCheckMiddlware} = require("./auth");
const bodyparser = require('body-parser');
const db = require("./DALs/db/db");

app.use(bodyparser.urlencoded({'extended': 'true'}));// TODO: check if this is needed
app.use(bodyparser.json());
app.use(bodyparser.json({type: 'application/vnd.api+json'})); // TODO: check if this is needed

app.post('/submitOrder/', authCheckMiddlware, function (request, response) {
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
        var order = new ordersModel({mealId: mealObjectId, meatId: meatObjectId, extras: extrasObjectIds, userId: userId, creationTime: new Date().toISOString()});
        order.save(function(result) {
            response.send({success : true});
        });
    });


});

app.get('/menuDetails', /*authCheckMiddlware, */function (req, res) {
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


app.get('/orders', authCheckMiddlware, function(req,res){
    ordersModel.findOne({'userId': req.user.sub})
        .populate('extras', 'displayName imageSrc')
        .populate('mealType', 'displayName imageSrc')
        .populate('meatType', 'displayName imageSrc')
        .exec(function(err, orders){
            console.log(orders);
            res.json(orders);
        });
});

app.get('/mealTest', function(req, res) {
    db.mealDetails.getAll()
        .then(result => res.send(result))
        .catch(err => res.send(err))
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
