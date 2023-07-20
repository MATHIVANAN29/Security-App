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
app.use('/api/photos', photos);



const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const sport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 })

const parser = sport.pipe(new ReadlineParser({ delimiter: '\r\n' }));


const servoport = new SerialPort({ path: '/dev/ttyUSB1', baudRate: 9600 });



/*

var corsOptions = {
  origin: ['http://127.0.0.1:4000', 'http://localhost:4000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cookieParser('cookie_cat'));
//app.use(cors({credentials:true}));
app.use(cors(corsOptions));


const dsource = require('./api/dsource');
const dpoint_value = require('./api/dpoint_value');
const data_point_access = require('./api/dpoint_access');
const data_point = require('./api/dpoint');



app.use('/api/mobile/dpv', dpoint_value);
app.use('/api/mobile/datapoint', data_point);
app.use('/api/mobile/datapointaccess', data_point_access);


*/


// TODO make an api to get the face posted, add delay of ten sec befoe between each recognition



app.post('/uploadEntry',  (req,res) => {});

app.post('/addNewUser',  (req,res) => {});

app.get('/getUserDetails', (req,res) => {});


app.post('/testrfid', (req,res) => {});

app.post('/testimage', (req,res) => {
console.log(req);

res.send("done");

});

app.post('/detect', (req,res) => {

		console.log("payload for req.body");
		console.log(JSON.stringify(req.body.blob ));

		request.post('http://localhost:5000/verify', {json:req.blob},function(err, response,body){
				res.send(response);
		});

});


app.post('/opengate', (req,res) => {

	servoport.write("o\n");

	setTimeout(() => {

	console.log('close gate 5 seconds duration over ');
	servoport.write("c\n");

	}, 5000);

});


//res.send('done');

//});



var server = app.listen(9000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("server running at http://%s:%s", host, port);

 servoport.write("c\n");
 parser.on('data', data => {
          console.log('Rx:', data);
          console.log();
	 
	 let trimmed = data.replace(/\s/g, '');

	console.log('trimeed-rx:', trimmed);

	request.get('http://localhost:9000/api/user', function(err, response,body){
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



