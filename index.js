var express = require("express");
var app = express();
var http = require("http").createServer(app);
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));

http.listen(80, () => {
    console.log("server listening on *:80");
});
