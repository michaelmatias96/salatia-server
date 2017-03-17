/**
 * Created by michaelmatias on 1/14/17.
 */
module.exports = {
    db: {
        connectionString: process.env.MONGODB_URI
    },
    port: process.env.PORT || 4338,
    cors: {
        mobileApp: "https://salatia-app-integ.herokuapp.com",
        admin: "https://salatia-app-admin-integ.herokuapp.com"
    }
};
