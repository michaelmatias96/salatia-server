/**
 * Created by michaelmatias on 1/14/17.
 */
const mongoose = require("mongoose");
const db = require("../../../DALs/db/db");


const {Schema} = mongoose;

const ordersSchema = new Schema({
    mealId: {
        type: Schema.Types.ObjectId,
        ref: 'mealdetails'
    },
    meatId: {
        type: Schema.Types.ObjectId,
        ref: 'meatdetails'
    },
    extras: [{
        type: Schema.Types.ObjectId,
        ref: 'extrasdetails'
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'userdetails'
    },
    pickupTime: {type: Date},
    status: {type: String, default: config.newOrderDefaultStatus},
    creationTime: {type: Date, default: Date.now()}
});

const ordersModel = mongoose.model('orders', ordersSchema);


module.exports = {
    getProgressAndNewOrders() {
        return new Promise((accept, reject) => {
            ordersModel.find({ $or:[ {'status':'progress'}, {'status':'new'} ]})
                .sort([['creationTime', 'descending']])
                .populate('userId')
                .populate('extras', 'displayName imageSrc')
                .populate('mealId', 'displayName imageSrc')
                .populate('meatId', 'displayName imageSrc')
                .exec(function(err, result){
                    let date = new Date();
                    date = result[0].pickupTime;
                    result[0].pickupTime.setHours(date.getHours() + 9);
                if (err)
                    return reject(err);

                accept(result);
            });
        });
    },

    getObjectId(id) {
        return new Promise((accept, reject) => {
            ordersModel.findOne({id}).exec(function (err, result) {
                if (err)
                    return reject(err);

                accept(mongoose.Types.ObjectId(result._id.toString()))
            });
        });
    },

    getCompletedOrders() {
        return new Promise((accept, reject) => {
            ordersModel.find({'status': 'finish'})
                .sort([['creationTime', 'descending']])
                .populate('userId')
                .populate('extras', 'displayName imageSrc')
                .populate('mealId', 'displayName imageSrc')
                .populate('meatId', 'displayName imageSrc')
                .exec(function(err, result){
                    let date = new Date();
                    date = result[0].pickupTime;
                    result[0].pickupTime.setHours(date.getHours() + 9);
                    if (err)
                        return reject(err);

                    accept(result);
                });
        });
    },
    getUserOrders(auth0Id) {
        return new Promise((accept, reject) => {
            db.userDetails.getObjectId(auth0Id)
                .then(result => {
                    ordersModel
                        .find({'userId': result})
                        .sort([['creationTime', 'descending']])
                        .populate('extras', 'displayName imageSrc')
                        .populate('mealId', 'displayName imageSrc')
                        .populate('meatId', 'displayName imageSrc')
                        .exec(function(err, result){
                            if (err) return reject(err);
                            accept(result);
                        });
                })
                .catch(err => {
                    return reject(err);
            })

            });

    },
    getOrderById(id) {
        return new Promise((accept, reject) => {
            ordersModel.find({'_id': id})
                .populate('userId')
                .populate('extras', 'displayName imageSrc type')
                .populate('mealId', 'displayName imageSrc')
                .populate('meatId', 'displayName imageSrc')
                .exec(function(err, result){
                    let date = new Date();
                    date = result[0].pickupTime;
                    result[0].pickupTime.setHours(date.getHours() + 9);

                    if (err)
                        return reject(err);

                    accept(result);
                });
        })
    },
    createOrder(mealId, meatId, extrasIds, userId, pickupTime) {
        return new Promise((accept, reject) => {
            var order = new ordersModel({mealId: mealId, meatId: meatId, extras: extrasIds, userId: userId, pickupTime: pickupTime, creationTime: new Date().toISOString()});
            order.save(function(err, result) {
                if (err)
                    return reject(err);

                accept(result);
            });
        })
    },

    removeOrderById(id) {
        return new Promise((accept, reject) => {
            ordersModel.findOneAndRemove({'_id': id})
                .exec(function(err, result){
                    if (err)
                        return reject(err);

                    accept(result);
                });
        })
    },

    changeStatus(id, status) {
        return new Promise((accept, reject) => {
            ordersModel.findOneAndUpdate({'_id': id}, {status: status}, function(err, doc){
                if (err)
                    return reject(err);
                accept(doc);
            });

        })
    },

    getOrderStatus(id)
    {
        return new Promise((accept, reject) => {
            ordersModel.find({'_id': id}).exec(function(err, doc){
                if (err)
                    return reject(err);
                accept(doc.status);
            });

        })
    }
};