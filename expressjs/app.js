const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//connect to db
const mysql = require('mysql');
 
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'expressdb'
});
 
connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
});

//definir moteur de template
//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//ajouter le chemin d'accueil et définir la page d'index des etudiants
app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    let sql = "SELECT * FROM `monument`";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('index', {
            title : 'Gestion des monuments',
            monument : rows
        });
    });
});

app.get('/add',(req, res) => {
    res.render('add', {
        title : 'Gestion des monuments'
    });
});

app.post('/visite/:Id',(req, res) => { 
    let data = {nom: req.body.nom, date: date.Now(), etat:'True'};
    let sql = "INSERT INTO `visite` SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.post('/save',(req, res) => { 
    let data = {nom: req.body.nom, latitude: req.body.latitude, longitude: req.body.longitude, ville: req.body.ville};
    let sql = "INSERT INTO `monument` SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


app.get('/edit/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `SELECT * FROM monument where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('edit', {
            title : 'Gestion des monuments',
            m : result[0]
        });
    });
});


app.post('/update',(req, res) => {
    const Id = req.body.id;
    let sql = "UPDATE `monument` SET nom='"+req.body.nom+"', `latitude`='"+req.body.latitude+"', `longitude`='"+req.body.longitude+"', `ville`='"+req.body.ville+"'  where id ="+Id;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});


app.get('/delete/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `DELETE FROM monument where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});