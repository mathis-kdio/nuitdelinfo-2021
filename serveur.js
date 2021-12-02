var express = require('express');
var serve_static = require('serve-static');
var http = require('http');
var fs = require('fs');

var app = express();

app.use(serve_static(__dirname+"/public"));
var serveur = http.Server(app);
serveur.listen(8080, function(){});

let database = null;

app.get(['/','/index.html'], function(req, res) {
    res.sendFile(path.join(__dirname +'/public/index.html'));
});

app.get('/types', function (req, res) {
    res.send(database.types);
});

app.get('/pokemons/:type', function (req, res) {
    if (req.params.type == 'all') {
        res.send(database.pokemons);
    }
    else {
        //Filtrage par type et pokemon peut avoir plusieurs types donc .some()
        res.send(database.pokemons.filter(({types}) => types.some(type => type.nom == req.params.type)));
    }
});