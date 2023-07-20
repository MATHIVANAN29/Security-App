
//gcc open1.c -o open1

#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <termios.h>

int fd, len;
char text[255];
struct termios options; /* Serial ports setting */


void on_off_motor(){

unsigned char channel = 0x01;
unsigned char first_byte = 0;
first_byte  = 0b11000000 | channel;
//write first byte
//serial write on

text[1]= first_byte;
write(fd, text, len);

text[1]= 0x01; //on
write(fd, text, len);

}


void set_ch_psd(unsigned char channel, unsigned  int position, unsigned char velocity){
unsigned char first_byte = 0;
unsigned char high_byte = 0;
unsigned char low_byte = 0;

first_byte = 0b11000000 | channel;
high_byte = (position >> 6 ) & 0b01111111;
low_byte  = position & 0b00111111;

//serial write first, high, low , velocity in order 
text[0]= first_byte;
write(fd, text, 1);

text[0]= high_byte;
write(fd, text, 1);

text[1]= low_byte;
write(fd, text, 1);

text[1]= velocity;
write(fd, text, 1);  

}



int main() {

    int i = 3;

	fd = open("/dev/ttyUSB0", O_RDWR | O_NDELAY | O_NOCTTY);
	if (fd < 0) {
		perror("Error opening serial port");
		return -1;
	}

	/* Read current serial port settings */
	// tcgetattr(fd, &options);
	
	/* Set up serial port */
	options.c_cflag = B9600 | CS8 | CLOCAL | CREAD;
	options.c_iflag = IGNPAR;
	options.c_oflag = 0;
	options.c_lflag = 0;

	/* Apply the settings */
	tcflush(fd, TCIFLUSH);
	tcsetattr(fd, TCSANOW, &options);


    //on_off_motor();
    while (i> 0){
        i --;

        
        set_ch_psd(0x01,400,50);

        sleep(5);

  
        set_ch_psd(0x01,1250,50);  

        sleep(5);

    }




/*
	// Write to serial port
	strcpy(text, "Hello from my RPi\n\r");
	len = strlen(text);
	len = write(fd, text, len);
	printf("Wrote %d bytes over UART\n", len);

	printf("You have 5s to send me some input data...\n");
	sleep(5);

	// Read from serial port 
	memset(text, 0, 255);
	len = read(fd, text, 255);
	printf("Received %d bytes\n", len);
	printf("Received string: %s\n", text);
*/

    sleep(5);

	close(fd);
	return 0;
}