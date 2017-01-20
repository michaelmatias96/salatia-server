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
    imgUrl: String
});
const extrasDetailsModel = mongoose.model('extrasdetails', extrasDetailsSchema);


module.exports = {
    getAll() {
        return new Promise((accept, reject) => {
            extrasDetailsModel.find({}, function (err, data) {
                if (err)
                    return reject(err);

                accept(data);
            });
        });
    },
    getObjectIds(idList) {
       let arryIdList = Array.from(idList);
        return new Promise((accept, reject) => {
                extrasDetailsModel
                    .find({id: {$in: arryIdList}})
                    .exec(function (err, result) {
                        if (err)
                            return reject(err);

                        result = result.map(function (document) {
                            return mongoose.Types.ObjectId(document._id.toString());
                        });
                        accept(result);
                    });
        });
    }
};