/**
 * Created by michaelmatias on 1/14/17.
 */
const mongoose = require("mongoose");
const {Schema} = mongoose;


const userDetailsSchema = new Schema({
    id: String,
    name: String,
    imgUrl: String,
    creationTime: Date
});
const userDetailsModel = mongoose.model('userdetails', userDetailsSchema);


module.exports = {
    createUser(id, name, imgUrl){
        return new Promise((accept, reject) => {
            var user = new userDetailsModel({
                id: id,
                name: name,
                imgUrl: imgUrl,
                creationTime: new Date().toISOString()
            });
            user.save(function (err, result) {
                if (err)
                    return reject(err);


                accept(mongoose.Types.ObjectId(result._id.toString()));
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
    },
    getObjectId(id) {
        return new Promise((accept, reject) => {
            userDetailsModel.findOne({id}).exec(function (err, result) {
                if (result == null)
                    return reject(err);
                
                accept(mongoose.Types.ObjectId(result._id.toString()))
            });
        });
    }
};