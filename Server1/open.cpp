

// g++ open.cpp -o open -lCppLinuxSerial
#include <CppLinuxSerial/SerialPort.hpp>


#include <chrono>
#include <thread>



using namespace mn::CppLinuxSerial;

    // using namespace std::this_thread;     // sleep_for, sleep_until
    // using namespace std::chrono_literals; // ns, us, ms, s, h, etc.
    // using std::chrono::system_clock;


void on_off_motor(){

unsigned char first_byte = 0;
first_byte  = 0b11000000 | channel;
//write first byte
//serial write on

}


void set_ch_psd(unsigned char channel, unsigned char int position, unsigned char velocity){
unsigned char first_byte = 0;
unsigned char high_byte = 0;
unsigned char low_byte = 0;

first_byte = 0b11000000 | channel;
high_byte = (position >> 6 ) & 0b01111111;
low_byte  = position & 0b00111111;

//serial write first, high, low , velocity in order   

}

int main() {
	// Create serial port object and open serial port at 57600 buad, 8 data bits, no parity bit, one stop bit (8n1),
	// and no flow control
	SerialPort serialPort("/dev/ttyUSB0", BaudRate::B_9600, NumDataBits::EIGHT, Parity::NONE, NumStopBits::ONE);
	// Use SerialPort serialPort("/dev/ttyACM0", 13000); instead if you want to provide a custom baud rate
	serialPort.SetTimeout(-1); // Block when reading until any data is received
	serialPort.Open();


	unsigned char channel = 0x01;
	unsigned char first_byte = 0;
	first_byte  = 0b11000000 | channel;

	serialPort.Write(first_byte);
	serialPort.Write(0x01); //on



	unsigned char int position = 400;
	unsigned char velocity = 100;

	first_byte = 0;
	unsigned char high_byte = 0;
	unsigned char low_byte = 0;

	first_byte = 0b11000000 | channel;
	high_byte = (position >> 6 ) & 0b01111111;
	low_byte  = position & 0b00111111;

	serialPort.Write(first_byte);
	serialPort.Write(high_byte);
	serialPort.Write(low_byte);
	serialPort.Write(velocity);


	// Write some ASCII data
	//serialPort.Write("Hello");

	// Read some data back (will block until at least 1 byte is received due to the SetTimeout(-1) call above)
	
	
	///std::string readData;
	///serialPort.Read(readData);

	// Close the serial port


	//sleep_for(10ns);
    //sleep_until(system_clock::now() + 1s);


    std::this_thread::sleep_for(std::chrono::nanoseconds(10));
    std::this_thread::sleep_until(std::chrono::system_clock::now() + std::chrono::seconds(1));



	serialPort.Close();
}
