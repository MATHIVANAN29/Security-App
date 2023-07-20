


const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const sport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 })

const parser = sport.pipe(new ReadlineParser({ delimiter: '\r\n' }));


const servoport = new SerialPort({ path: '/dev/ttyUSB1', baudRate: 9600 });


  parser.on('data', data => {
          console.log('Rx:', data);
          console.log();
	 
	 let trimmed = data.replace(/\s/g, '');

	 console.log('trimed-rx:', trimmed);



	});

