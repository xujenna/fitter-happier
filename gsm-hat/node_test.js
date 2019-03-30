var SerialPort = require("serialport")
var serialPort = new SerialPort("/dev/ttyS0");

serialPort.on("open", function () {
    console.log('Serial communication open');
    // serialPort.write("AT^SYSCFG=13,1,3FFFFFFF,2,4");
    serialPort.write("AT");
    serialPort.write('\r');
    delay(200);
    serialPort.on('data', function(data) {
        console.log("Received data: " + data);
    });
    gsm_message_sending(serialPort, "hey girl", "16307308188");
});

function gsm_message_sending(serial, message, phone_no) {
    serial.write("AT+CMGF=1");
    serial.write('\r');
    delay(200);
    serial.write("AT+CSCA=\"");
    serial.write("+12063130004")
    serial.write('"')
    serial.write('\r');
    delay(200);
    serial.write("AT+CMGS=\"");
    serial.write(phone_no);
    serial.write('"')
    serial.write('\r');
    delay(200);
    serial.write(message); 
    serial.write('\r');
    // serial.write(Buffer.from([0x1A]));
    // serial.write(Buffer.from([0x1A]));

    // serial.write('^z');
}
