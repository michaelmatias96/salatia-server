/**
 * Created by michaelmatias on 1/14/17.
 */
module.exports = {
    db: {
        connectionString: process.env.MONGODB_URI
    },
    port: process.env.PORT || 4338,
    cors: {
        mobileApp: "https://hatulia-app.herokuapp.com",
        admin: "https://hatulia-app-admin.herokuapp.com"
    }
};
