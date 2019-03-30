const SerialPort = require("serialport")
const serialPort = new SerialPort("/dev/ttyS0");


let W_buff = ["AT\r\n", "AT+CMGF=1\r\n", "AT+CSCA=\"+12063130004\"\r\n", "AT+CMGS=\"16307308188\"\r\n","hey girl"]

serialPort.on("open", function () {
    console.log('Serial communication open');
    // serialPort.write("AT^SYSCFG=13,1,3FFFFFFF,2,4");
    serialPort.write(W_buff[0]);
    serialPort.on('data', function(data) {
        console.log("Received data: " + data);
    });
    gsm_message_sending();
});

function gsm_message_sending() {
    for(let i = 1; i < W_buff.length; i++){
        setTimeout(function(){
            serialPort.write(W_buff[i]);
        }, 3000)
    }
    serialPort.write("\x1a\r\n")
    serialPort.write(Buffer.from([0x1A]));
}





// serialPort.on("open", function () {
//     console.log('Serial communication open');
//     // serialPort.write("AT^SYSCFG=13,1,3FFFFFFF,2,4");
//     serialPort.write("AT");
//     serialPort.write('\r');
//     serialPort.on('data', function(data) {
//         console.log("Received data: " + data);
//     });
//     gsm_message_sending(serialPort, "hey girl", "16307308188");
// });

// function gsm_message_sending(serial, message, phone_no) {
//     serial.write("AT+CMGF=1");
//     serial.write('\r');
//     serial.write("AT+CSCA=\"");
//     serial.write("+12063130004")
//     serial.write('"')
//     serial.write('\r');
//     serial.write("AT+CMGS=\"");
//     serial.write(phone_no);
//     serial.write('"')
//     serial.write('\r');
//     serial.write(message); 
//     serial.write('\r');
//     // serial.write(Buffer.from([0x1A]));
//     // serial.write(Buffer.from([0x1A]));

//     // serial.write('^z');
// }
