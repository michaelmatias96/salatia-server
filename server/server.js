#!/usr/bin/env node
var app = require('./app');


app.set('port', 4338);
app.set('view engine', 'html');

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});