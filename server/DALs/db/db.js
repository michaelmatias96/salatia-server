/**
 * Created by michaelmatias on 1/14/17.
 */
const mongoose = require("mongoose");

exports.mealDetails = require("./models/mealDetails");
exports.extrasDetails = require("./models/extrasDetails");
exports.meatDetails = require("./models/meatDetails");
exports.orders = require("./models/orders");

exports.init = function() {
    mongoose.connect(config.db.connectionString);
};