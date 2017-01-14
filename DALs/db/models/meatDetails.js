/**
 * Created by michaelmatias on 1/14/17.
 */
const mongoose = require("mongoose");
const {Schema} = mongoose;


const meatDetailsSchema = new Schema({
    name: String,
    displayName: String,
    comments: String,
    imgUrl: String
});
const meatDetailsModel = mongoose.model('meatdetails', meatDetailsSchema);


module.exports = {
    getAll() {
        return new Promise((accept, reject) => {
            meatDetailsModel.find({}, function (err, data) {
                if (err)
                    return reject(err);

                accept(data);
            });
        });
    }
};