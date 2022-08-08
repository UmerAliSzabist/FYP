const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Admin = require('./routes/Admin.route');
const User = require('./routes/User.route');
const Login = require('./routes/Login.route');

const app = express();
const  cors = require("cors");



// var MongoClient = require('mongodb').MongoClient;
// var uri = "mongodb://Anas:anas123@cluster0-shard-00-00.yppnc.mongodb.net:27017,cluster0-shard-00-01.yppnc.mongodb.net:27017,cluster0-shard-00-02.yppnc.mongodb.net:27017/RentBucket?ssl=true&replicaSet=atlas-efscmc-shard-0&authSource=admin&retryWrites=true&w=majority";
// MongoClient.connect(uri, function(err, client) {
    
//     console.log("Connected to Database")
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// mongodb+srv://Anas:anas123@cluster0.yppnc.mongodb.net/RentBucket?retryWrites=true&w=majority

mongoose.connect('mongodb://Anas:anas123@cluster0-shard-00-00.yppnc.mongodb.net:27017,cluster0-shard-00-01.yppnc.mongodb.net:27017,cluster0-shard-00-02.yppnc.mongodb.net:27017/RentBucket?ssl=true&replicaSet=atlas-efscmc-shard-0&authSource=admin&retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to Database"))
    .catch(err => {
        console.error("Couldnot connect to Database", err);
        process.exit();
    });

app.use(cors());

// app.options("*", cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

// app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', Admin);
app.use('/user', User);
app.use('/', Login);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App is running on ${port} ...`);
});