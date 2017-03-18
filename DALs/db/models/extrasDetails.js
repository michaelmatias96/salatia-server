/**
 * Created by michaelmatias on 1/14/17.
 */
const mongoose = require("mongoose");
const {Schema} = mongoose;


const extrasDetailsSchema = new Schema({
    id: String,
    name: String,
    displayName: String,
    comments: String,
    imgUrl: String,
    selectionColor: String
});
const extrasDetailsModel = mongoose.model('extrasdetails', extrasDetailsSchema);


module.exports = {
    getAll() {
        return new Promise((accept, reject) => {
            extrasDetailsModel.find({}, function (err, data) {
                if (err)
                    return reject(err);
                accept(data);
            }).sort({'isSpecial': 1});
        });
    },
    getObjectIds(ids) {
        return new Promise((accept, reject) => {
            extrasDetailsModel
                .find({id: {$in: ids}})
                .exec(function (err, result) {
                    if (err)
                        return reject(err);
                    result = result.map(function (document) {
                        return mongoose.Types.ObjectId(document._id.toString());
                    });
                    accept(result);
                });
        });
    },
    getOne(id) {
        return new Promise((accept, reject) => {
            extrasDetailsModel.findOne({id}).exec(function (err, result) {
                if (err)
                    return reject(err);
                accept(result)
            })
        })
    },
    getFew(ids) {
        return new Promise((accept, reject) => {
            extrasDetailsModel.find({ id : { $in : ids }}).exec(function(err, result) {
                if (err)
                    return reject(err);
                accept(result);
            })
        })
    }
};