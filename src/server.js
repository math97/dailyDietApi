"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var port = 3333;
app_1.app.listen({
    port: port,
    host: 'localhost',
}).then(function () {
    console.log("\uD83D\uDE80HTTP Server Running on ".concat(port));
});
