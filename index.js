// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// date variable aquisition 
app.get("/api/:date", function (req, res) {
  var unixRegex = new RegExp(/^\d+$/);//regular expression to test valid unix timestamp format
  let currentDate = new Date();
  let jsonDate = {"unix": null, "utc": null};
  let isUnix = false;
  let isDate = false;

  //check if Date.parse returns a number and not NaN, otherwise check if it is unix timestamp
  if(!isNaN(Date.parse(req.params.date))){
    isDate = true;
  } else if(unixRegex.test(req.params.date)){
    isUnix = true;
  };

  //Modify jsonData object based on isUnix and isDate flags
  //if no flags set to true, return "invalid date"
  if(!isUnix && !isDate){
    res.json({ "error": "Invalid Date"});
    return;
  };
  
  if(isUnix){
    jsonDate.unix = parseInt(req.params.date);
    jsonDate.utc = unixToUTC(req.params.date);
    res.json(jsonDate);
    return;
  } else if(isDate){
    jsonDate.unix = Date.parse(req.params.date);
    jsonDate.utc = dateToUTC(req.params.date);
    res.json(jsonDate);
    return;
  };
  
  res.json({ "WARNING": "end of apt.get reached with no response with date object"});
});

// empty :date, a.k.a. /api/
app.get("/api/", function (req, res) {
  let unixTimestamp = Date.parse( new Date() );//also converted to a number, rather than string
  let utcTime = new Date().toUTCString();
  res.json({"unix": unixTimestamp, "utc": utcTime});
});

//function to convert valid date to UTC format
function dateToUTC(date){
  let dateObject = new Date(date);
  return dateObject.toUTCString();
};

//function to convert unix timestamp to UTC format
function unixToUTC(date){
  let dateObject = new Date(parseInt(date));
  return dateObject.toUTCString();
  
};

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
