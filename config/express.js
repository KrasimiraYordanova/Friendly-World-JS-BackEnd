const express = require('express');


function templateConfig(app) {

    app.use(express.static("static"));
    app.use(express.json());
    
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        next();
    })

}

module.exports = templateConfig;

