/**
 * Created by michaelmatias on 1/14/17.
 */

app.get('/', function(req, res) {
    res.send("Hello world!");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    console.error(req, res);
});