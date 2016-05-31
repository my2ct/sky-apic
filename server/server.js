/*
Server for Shipped APIC-EM demo project

Author: David Tootill 2015.07.15
Copyright (C) Cisco, Inc.  All rights reserved.
*/

var express     = require("express")
var serveStatic = require("serve-static")
var compression = require("compression")

var nconf = require("nconf");
nconf.argv()
     .file({file: __dirname + "/config.json"})

// Set up middleware to serve UI static content

var app = express();
app.use(compression())
app.use(serveStatic(__dirname + "/../ui"))
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*")
  next()
})

// Start the server
app.listen(nconf.get("port"))
console.log("Server is listening on port " + nconf.get("port"))