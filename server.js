'use strict';

// Requires
var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');
var helmet = require('helmet');


// Routes Requires
var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');



// Express
var app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Helmet
app.use(helmet());
app.use(helmet.frameguard({action: 'sameorigin'}));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.referrerPolicy({ policy: "same-origin" }));






// Front End Routes
app.route('/b/:board/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/board.html');
  });
app.route('/b/:board/:threadid')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/thread.html');
  });



// Index
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });





// API Routes
fccTestingRoutes(app);
//Routing for API 
apiRoutes(app);


    


// 404 
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Server Listener
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing
