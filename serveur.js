var express = require('express');
var serve_static = require('serve-static');
var http = require('http');
let mysql = require('mysql');

var app = express();

app.use(serve_static(__dirname+"/public"));
var serveur = http.Server(app);
serveur.listen(8080, function(){});


let connection = mysql.createConnection({
    host: 'mysql-capsoupascaps.alwaysdata.net',
    user: '251146_server',
    password: 'EXxQma5HMRp5YxW',
    database: 'capsoupascaps_database'
});


connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    } 
    console.log('Connected to the MySQL server.');
});

app.get(['/','/index.html'], function(req, res) {
    res.sendFile(path.join(__dirname +'/public/index.html'));
});

app.get('/sauveteurs', function (req, res) {
    connection.query("SELECT nom, prenom, date_naissance FROM sauveteurs", function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});