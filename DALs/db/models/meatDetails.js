/**
 * Created by michaelmatias on 1/14/17.
 */
const mongoose = require("mongoose");
const {Schema} = mongoose;


const meatDetailsSchema = new Schema({
    id: String,
    name: String,
    displayName: String,
    comments: String,
    imgUrl: String,
    selectionColor: String
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
    },
    getObjectId(id) {
        return new Promise((accept, reject) => {
            meatDetailsModel.findOne({id}).exec(function (err, result) {
                if (err)
                    return reject(err);

                if (result == null)
                    return accept(null);

                accept(mongoose.Types.ObjectId(result._id.toString()));
            })
        });
    },
    getOne(id) {
        return new Promise((accept, reject) => {
            meatDetailsModel.findOne({id}).exec(function (err, result) {
                if (err)
                    return reject(err);

                accept(result)
            })
        })
    }
};