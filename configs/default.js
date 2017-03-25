/**
 * Created by michaelmatias on 1/14/17.
 */

module.exports = {
    port: 4338,
    auth: {
        auth0: {
            secretKey: "nDVMJ8hlAoKt4L_AV3XwT4gzBrKkyVBAcuyP7iX_k8SNFrwQQbqcFz7JopvUj-Tc",
            clientId: "m1NOCEkfL6jZYZLBjvgbzaIFaKg0bK18"
        }
    },
    defaultCreateOrderWaitingStatus: "waiting",
    cors: {
        mobileApp: "",
        admin: ""
    },
    newOrderDefaultStatus: "new",
    socketUpdatesOrdersMsg: "updateorders",
    socketChangeOrderMsg: "changeorder",
    timeToNudge: 15 * 60 * 1000

};