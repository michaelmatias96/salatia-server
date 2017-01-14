#!/usr/bin/env node

// for safety
process.on('uncaughtException', function (err) {
    console.error(err ? err.stack || err : err);
});

const express = require("express");


// config
const currentConfig = require("./currentConfig");
global.config = require("./configs/default");
Object.assign(global.config, require("./configs/" + currentConfig));


global.app = express();
app.listen(config.port, function() {
    console.info("Listening on", config.port);
});

require("./DALs/DALs").init();

global.log = console;

require('./routes');