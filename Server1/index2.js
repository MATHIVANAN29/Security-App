
var express = require('express');
var app = express();
var fs = require('fs');
var exec = require('child_process').exec;

var request = require('request');
var bodyParser = require('body-parser');


const favicon = require('serve-favicon');

const logger = require('morgan');
const cookieParser = require('cookie-parser');

const cors = require('cors');

var multer = require('multer');
var upload = multer({dest:'uploads/'});




///app.use(bodyParser.json({ type: 'application/json', limit: '500kb' }));
app.use(bodyParser.json({ type: 'application/json', limit: '2000kb' }));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});





const entry_shot = require('./api/entry_shot');
const entry_times = require('./api/entry_times');
const label = require('./api/label');
const photos = require('./api/photos');
const user = require('./api/user');

app.use('/api/entry_shot', entry_shot);
app.use('/api/entry_times', entry_times);
app.use('/api/label', label);
app.use('/api/user', user);



const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const sport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 })

const parser = sport.pipe(new ReadlineParser({ delimiter: '\r\n' }));


const servoport = new SerialPort({ path: '/dev/ttyUSB1', baudRate: 9600 });




//var RFIDReader = require('tk4100-rfid-reader');

//const { exec } = require("child_process");


//await new Promise(resolve => setTimeout(resolve, 5000));






/*
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

 parser.on('data', data => {
          console.log('Rx:', data);
          console.log();
	 
	 let trimmed = data.replace(/\s/g, '');

	console.log('trimeed-rx:', trimmed);
        });

*/

app.post('/open',  (req,res) => {

				setTimeout(() => {

				console.log('close gate 5 seconds duration over ');
				servoport.write("c\n");

				}, 5000);


});


app.post('/uploadEntry',  (req,res) => {});

app.post('/addNewUser',  (req,res) => {});

app.get('/getUserDetails', (req,res) => {});


app.post('/testrfid', (req,res) => {});

app.post('/testimage', upload.single('avatar'), (req,res) => {
console.log(req.file);

//console.log(req.image);

res.send("done");

});


var server = app.listen(7000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("server running at http://%s:%s", host, port);

  servoport.write("c\n");


  parser.on('data', data => {
          console.log('Rx:', data);
          console.log();
	 
	 let trimmed = data.replace(/\s/g, '');

	console.log('trimeed-rx:', trimmed);

	request.get('http://localhost:7000/api/user', function(err, response,body){
			//console.log(body);
			//console.log('resp=> ', JSON.stringify(body));
			let bodyObj = JSON.parse(body);

			//console.log('var type is => ' + typeof body);

			let found = bodyObj.filter(item =>item.rfid === trimmed);

			if (found.length > 0){
				//console.log('user is => ' + found);
				console.log('user is => ' + found[0].username);
				console.log('user is => ' + JSON.stringify(found));

				servoport.write("o\n");

				setTimeout(() => {

				console.log('close gate 5 seconds duration over ');
				servoport.write("c\n");

				}, 5000);
			}
			else{
				console.log('Unknown User !!! ');
				servoport.write("c\n");
			}


		})

	});




});




/*

var rr = new RFIDReader({
   device: '/dev/input/event0', // input device to read
   maxLength: 32 // max key length, defaults to 32, set to 0 to disable
});




 
rr.on('tag', function (tag) {
    // tag as a hex string
    // tag => "abcd1234"
	console.log('tag = > '+ tag);

	if(tag == '0015649417'){
		console.log('open gate');

		exec("./open", (error, stdout, stderr) => {
		    if (error) {
			console.log(`error: ${error.message}`);
			return;
		    }
		    if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		    }
		    console.log(`stdout: ${stdout}`);
		});
	}

else{
	console.log('unknown tag');
}




});
 
rr.on('error', function (err) {
    // error was encountered while reading
    // currently this is only fired if the key is greater than maxLength
    console.log(err)
});*/


