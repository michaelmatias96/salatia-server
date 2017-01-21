/**
 * Created by michaelmatias on 1/14/17.
 */
const mongoose = require("mongoose");

const {Schema} = mongoose;


const userDetailsSchema = new Schema({
    auth0Id: String,
    name: String,
    imgUrl: String,
    creationTime: Date
});
const userDetailsModel = mongoose.model('userdetails', userDetailsSchema);


module.exports = {

    getObjectId(id) {
        return new Promise((accept, reject) => {
            userDetailsModel.findOne({auth0Id: id}).exec(function (err, result) {
                if (result == null) return reject();

                accept(mongoose.Types.ObjectId(result._id.toString()))
            });
        });
    },
    createUserIfNotExist(id, name, imgUrl){
        var user = new userDetailsModel({
            auth0Id: id,
            name: name,
            imgUrl: imgUrl,
            creationTime: new Date().toISOString()
        });

        return new Promise((accept, reject) => {


            module.exports.getObjectId(id)
                .then( accept())
                .catch(err => {
                    user.save(function (err, result) {
                    accept();
                    });
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