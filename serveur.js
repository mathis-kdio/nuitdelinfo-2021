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


//-----------------------------------  SELECT  -----------------------------------//
app.get('/sauveteurs', function (req, res) {
    connection.query("SELECT id, nom, prenom, date_naissance FROM sauveteurs", function (err, result) {
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

app.get('/siecle', function (req, res) {
    connection.query("SELECT id, nom FROM siecle", function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});

app.get('/villes', function (req, res) {
    connection.query("SELECT id, nom FROM villes", function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});

app.get('/stations', function (req, res) {
    connection.query("SELECT id, nom, creation, suppression, description FROM stations", function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});

app.get('/stations/:id', function (req, res) {
    let id = req.params.id;
    if (id == 'all') {
        connection.query("SELECT id, nom, creation, suppression, description FROM stations", function (err, result) {
            if (err) throw (err);
            res.send(result);
        })   
    }
    else {
        connection.query("SELECT id, nom, creation, suppression, description FROM stations WHERE id=" + id, function (err, result) {
            if (err) throw (err);
            res.send(result);
        })
    }
});

app.get('/sorties-en-mer', function (req, res) {
    connection.query("SELECT sem.id, v.nom AS ville, date, sa.nom AS commandant, succes, morts, si.nom AS siecle FROM sorties_en_mer AS sem JOIN siecle AS si ON si.id = sem.siecle JOIN villes AS v ON v.id = sem.ville JOIN sauveteurs AS sa ON sa.id = sem.commandant", function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});

app.get('/sorties-en-mer/:id', function (req, res) {
    connection.query("SELECT sem.id, v.nom AS ville, date, sa.nom AS commandant, succes, morts, si.nom AS siecle FROM sorties_en_mer AS sem JOIN siecle AS si ON si.id = sem.siecle JOIN villes AS v ON v.id = sem.ville JOIN sauveteurs AS sa ON sa.id = sem.commandant WHERE sem.id=" + req.params.id, function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});

app.get('/sorties-en-mer/siecle/:IdSiecle', function (req, res) {
    connection.query("SELECT sem.id, v.nom AS ville, date, sa.nom AS commandant, succes, morts, si.nom AS siecle FROM sorties_en_mer AS sem JOIN siecle AS si ON si.id = sem.siecle JOIN villes AS v ON v.id = sem.ville JOIN sauveteurs AS sa ON sa.id = sem.commandant WHERE si.id=" + req.params.IdSiecle, function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});

app.get('/sorties-en-mer/ville/:IdVille', function (req, res) {
    connection.query("SELECT sem.id, v.nom AS ville, date, sa.nom AS commandant, succes, morts, si.nom AS siecle FROM sorties_en_mer AS sem JOIN siecle AS si ON si.id = sem.siecle JOIN villes AS v ON v.id = sem.ville JOIN sauveteurs AS sa ON sa.id = sem.commandant WHERE v.id=" + req.params.IdVille, function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});

app.get('/search/:mysearch', function (req, res) {
    connection.query("SELECT sem.id, v.nom AS ville, date, sa.nom AS commandant, succes, morts, si.nom AS siecle FROM sorties_en_mer AS sem JOIN siecle AS si ON si.id = sem.siecle JOIN villes AS v ON v.id = sem.ville JOIN sauveteurs AS sa ON sa.id = sem.commandant WHERE v.id=" + req.params.IdVille, function (err, result) {
        if (err) throw (err);
        res.send(result);
    })
});


//-----------------------------------  INSERT INTO  -----------------------------------//

app.get('/create/sauveteurs/:nom/:prenom/:date_naissance', function (req, res) {
    if (req.params.nom && req.params.prenom && req.params.date_naissance) {
        connection.query("INSERT INTO sauveteurs VALUES ('', '" + req.params.nom + "', '" + req.params.prenom + "', '" + req.params.date_naissance + "')", function (err, result) {
            if (err) throw (err);
            res.send(result);
        })
    }
});


//-----------------------------------  UPDATE  -----------------------------------//

app.get('/update/sauveteurs/:id/:nom/:prenom/:date_naissance', function (req, res) {
    if (req.params.nom && req.params.prenom && req.params.date_naissance) {
        connection.query("UPDATE sauveteurs SET nom='" +  req.params.nom + "', prenom='" + req.params.prenom +"', date_naissance='" + req.params.date_naissance + "' WHERE id=" + req.params.id, function (err, result) {
            if (err) throw (err);
            res.send(result);
        })
    }
});
