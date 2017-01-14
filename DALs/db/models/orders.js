/**
 * Created by michaelmatias on 1/14/17.
 */
const mongoose = require("mongoose");
const {Schema} = mongoose;


const ordersSchema = new Schema({
    mealId: Schema.Types.ObjectId,
    meatId: Schema.Types.ObjectId,
    extras: [Schema.Types.ObjectId],
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
    createOrder(mealId, meatId, extrasIds, userId) {
        return new Promise((accept, reject) => {
            var order = new ordersModel({mealId: mealId, meatId: meatId, extras: extrasIds, userId: userId, creationTime: new Date().toISOString()});
            order.save(function(err, result) {
                if (err)
                    return reject(err);

                accept(result);
            });
        })
    }
};