/**
 * Created by michaelmatias on 1/14/17.
 */
const mongoose = require("mongoose");

const {Schema} = mongoose;


const userDetailsSchema = new Schema({
    auth0Id: String,
    name: String,
    imgUrl: String,
    endPoint: { type: String, default: "" },
    creationTime: Date
});
const userDetailsModel = mongoose.model('userdetails', userDetailsSchema);

module.exports = {

    getObjectId(id) {
        return new Promise((accept, reject) => {
            userDetailsModel.findOne({auth0Id: id}).exec(function (err, result) {
                if (err)
                    return reject(err);

                if (result == null)
                    return accept(null);

                accept(mongoose.Types.ObjectId(result._id.toString()))
            });
        });
    },
    createUserIfNotExist(id, name, imgUrl, endPoint){
        let user = new userDetailsModel({
            auth0Id: id,
            name: name,
            imgUrl: imgUrl,
            endPoint: endPoint ,
            creationTime: new Date().toISOString()
        });

        return new Promise((accept, reject) => {
            module.exports.getObjectId(id)
                .then(userId => {
                    if (userId != null)
                        return accept();

                    user.save(function (err, result) {
                        if (err != null)
                            return reject();

                        accept(result);
                    });
                })
                .catch(err => reject(err));
        });
    },
    updateUserEndPoint(id, endPoint){
        return new Promise((accept, reject) => {
                userDetailsModel.findById(id, function (err, user) {
                    if (err)
                        return reject(err);
                    user.endPoint = endPoint;
                    user.save(function (err, result) {
                        accept(result);
                    });
                }
                )})
    },
    getEndPointByObjectId(objectId) {
        return new Promise((accept, reject) => {
            userDetailsModel.find({'_id': objectId},'endPoint', function (err, data) {
                if (err)
                    return reject(err);
                accept(data);
            });
        });
    },
    getAllEndPoints() {
        return new Promise((accept, reject) => {
            userDetailsModel.find({},'endPoint', function (err, data) {
                if (err)
                    return reject(err);
                accept(data);
            });
        });
    },
    getAll() {
        return new Promise((accept, reject) => {
            userDetailsModel.find({}, function (err, data) {
                if (err)
                    return reject(err);

                accept(data);
            });
        });
    }
};