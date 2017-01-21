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
    userName: String,
    userPic: String,
    status: {type: String, default: "new"},
    creationTime: {type: Date, default: Date.now()}
});
const ordersModel = mongoose.model('orders', ordersSchema);


module.exports = {
    getProgressAndNewOrders() {
        return new Promise((accept, reject) => {
            ordersModel.find({ $or:[ {'status':'progress'}, {'status':'new'} ]})
                .sort([['creationTime', 'descending']])
                .populate('extras', 'displayName imageSrc')
                .populate('mealId', 'displayName imageSrc')
                .populate('meatId', 'displayName imageSrc')
                .exec(function(err, result){
                if (err)
                    return reject(err);

                accept(result);
            });
        });
    },
    getCompletedOrders() {
        return new Promise((accept, reject) => {
            ordersModel.find({'status': 'finish'})
                .sort([['creationTime', 'descending']])
                .populate('extras', 'displayName imageSrc')
                .populate('mealId', 'displayName imageSrc')
                .populate('meatId', 'displayName imageSrc')
                .exec(function(err, result){
                    if (err)
                        return reject(err);

                    accept(result);
                });
        });
    },
    getUserOrders(userId) {
        return new Promise((accept, reject) => {
            console.log("dfdf");

            db.userDetails.getObjectId(userId)
            .then(result => {

                ordersModel.find({'userId': result})
                    .sort([['creationTime', 'descending']])
                    .populate('extras', 'displayName imageSrc')
                    .populate('mealId', 'displayName imageSrc')
                    .populate('meatId', 'displayName imageSrc')
                    .exec(function(err, result){
                        if (err)
                            return reject(err);

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
                .populate('extras', 'displayName imageSrc')
                .populate('mealId', 'displayName imageSrc')
                .populate('meatId', 'displayName imageSrc')
                .exec(function(err, result){
                    if (err)
                        return reject(err);

                    accept(result);
                });
        })
    },
    createOrder(mealId, meatId, extrasIds, userId, userName, userPic) {
        return new Promise((accept, reject) => {
            var order = new ordersModel({mealId: mealId, meatId: meatId, extras: extrasIds, userId: userId,userName: userName, userPic: userPic, creationTime: new Date().toISOString()});
            order.save(function(err, result) {
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
    }
};