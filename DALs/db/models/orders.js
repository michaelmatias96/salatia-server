/**
 * Created by michaelmatias on 1/14/17.
 */
const mongoose = require("mongoose");
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
    userId: String,
    status: {type: String, default: config.newOrderDefaultStatus},
    creationTime: {type: Date, default: Date.now()}
});
const ordersModel = mongoose.model('orders', ordersSchema);


module.exports = {
    getAll() {
        return new Promise((accept, reject) => {
            ordersModel.find({}, function (err, data) {
                if (err)
                    return reject(err);

                accept(data);
            });
        });
    },
    getUserOrders(userId) {
        return new Promise((accept, reject) => {
            ordersModel.find({'userId': userId})
                .sort({ creationTime: -1 })
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
    createOrder(mealId, meatId, extrasIds, userId) {
        return new Promise((accept, reject) => {
            var order = new ordersModel({mealId: mealId, meatId: meatId, extras: extrasIds, userId: userId, creationTime: new Date().toISOString(), status: config.defaultCreateOrderWaitingStatus});
            order.save(function(err, result) {
                if (err)
                    return reject(err);

                accept(result);
            });
        })
    }
};