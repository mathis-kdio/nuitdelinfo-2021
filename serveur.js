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

app.get(['/admin','/admin.html'], function(req, res) {
    res.sendFile(path.join(__dirname +'/public/admin.html'));
});

app.get('/sauveteurs', function (req, res) {
    connection.query("SELECT nom, prenom, date_naissance FROM sauveteurs", function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});

app.get('/bateaux', function (req, res) {
    connection.query("SELECT id, nom FROM bateaux_categories", function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});

app.get('/bateaux/:type', function (req, res) {
    let type = req.params.type;
    if (type == 'all') {
        connection.query("SELECT id, nom, type, annee_debut, description FROM bateaux", function (err, result) {
            if (err) throw (err);
            res.send(result);
        })
    }
    else {
        connection.query("SELECT id, nom, type, annee_debut, description FROM bateaux WHERE type=" + type, function (err, result) {
            if (err) throw (err);
            res.send(result);
        })
    }
});

app.get('/stations', function (req, res) {
    connection.query("SELECT id, nom, creation, suppression FROM stations", function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});

app.get('/stations/:id', function (req, res) {
    let id = req.params.id;
    if (id == 'all') {
        connection.query("SELECT id, nom, creation, suppression FROM stations", function (err, result) {
            if (err) throw (err);
            res.send(result);
        })   
    }
    else {
        connection.query("SELECT id, nom, creation, suppression FROM stations WHERE id=" + id, function (err, result) {
            if (err) throw (err);
            res.send(result);
        })
    }
});

app.get('/sorties-en-mer/:type', function (req, res) {
    let type = req.params.type;
    if (type == 'all') {
        connection.query("SELECT id, ville, date, commandant, succes, morts FROM sorties_en_mer", function (err, result) {
            if (err) throw (err);
            res.send(result);
        })
    }
    else {
        connection.query("SELECT v.nom AS ville, date, sa.nom AS commandant, succes, morts, si.nom AS siecle FROM sorties_en_mer AS sem JOIN siecle AS si ON si.id = sem.siecle JOIN villes AS v ON v.id = sem.ville JOIN sauveteurs AS sa ON sa.id = sem.commandant WHERE siecle=" + type, function (err, result) {
            if (err) throw (err);
            res.send(result);
        })
    }
});