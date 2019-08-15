const express = require('express');
const bodyParser = require('body-parser');

// Configuring the database
// const dbConfig = require('./config/database.config.js');
// const mongoose = require('mongoose');
//
// mongoose.Promise = global.Promise;
//
// // Connecting to the database
// mongoose.connect(dbConfig.url)
//     .then(() => {
//         console.log("Successfully connected to the database");
//     }).catch(err => {
//     console.log('Could not connect to the database. Exiting now...');
//     process.exit();
// });

//paths
const py_env = process.argv.slice(2)[0];
const path = __dirname;

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// Default api route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to Memory Recall API"});
});

// Require main routes
require('./app/routes/account.routes.js')(app);

app.post('/predict', (req, res) => {
    var reqpath = path.substring(0, path.length - 7);

    console.log("predict");
    console.log(req.body.question);
    var spawn = require('child_process').spawn,
        py    = spawn(py_env, [reqpath+'python/predict.py']);
    if(!req.body.question) {
        return res.status(400).send({
            message: "question can not be empty"
        });
    }
    py.stdout.on('data', function(data){
        return res.send({
            message: data.toString()
        });
    });

    py.stdin.write(req.body.question);
    py.stdin.end();
});

app.post('/load', (req, res) => {
    var reqpath = path.substring(0, path.length - 7);

    console.log("predict");
    console.log(req.body.value);
    var spawn = require('child_process').spawn,
        py    = spawn(py_env, [reqpath+'python/fileUtils.py']);
    if(!req.body.value) {
        return res.status(400).send({
            message: "value can not be empty"
        });
    }
    py.stdout.on('data', function(data){
        return res.send({
            message: data.toString()
        });
    });

    py.stdin.write(req.body.value);
    py.stdout.on("end", data => {
        console.log("Token " + data + ": closing connection.");
    });
    py.stdin.end();
});


// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});