const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const _ = require('lodash');
const passport = require("passport");

const InstamobileDB = require('./db/instamobileDB');

const apiPort = 3000;
const app = express();
const server = require('http').createServer(app);

var apiRoutes = require('./api/apiRoutes'); //importing route

const dbType = "firebaseDB";
var instamobileDB = new InstamobileDB(dbType)

instamobileDB
  .connectDB(db => {
    console.log(db)

    // Passport middleware
    app.use(passport.initialize());

    // Passport config
    require("./config/passport")(passport, instamobileDB);

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cors())
    app.use(bodyParser.json())

    // enable files upload
    app.use(fileUpload({
      createParentPath: true
    }));

    apiRoutes(app, instamobileDB, server)
  })

// logging
app.use(morgan('dev'));

app.use(express.static('/uploads'));
app.use("/uploads", express.static(__dirname + '/uploads'));

server.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
