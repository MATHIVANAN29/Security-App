var RFIDReader = require('tk4100-rfid-reader');
 
var rr = new RFIDReader({
   device: '/dev/input/event0', // input device to read
   maxLength: 32 // max key length, defaults to 32, set to 0 to disable
});
 
rr.on('tag', function (tag) {
    // tag as a hex string
    // tag => "abcd1234"
});
 
rr.on('error', function (err) {
    // error was encountered while reading
    // currently this is only fired if the key is greater than maxLength
});


