const SerialPort = require("serialport")
const serialPort = new SerialPort("/dev/ttyS0");

let W_buff = ["AT\r\n", "AT+CMGF=1\r\n", "AT+CSCA=\"+12063130004\"\r\n", "AT+CMGS=\"16307308188\"\r\n","hey girl","\x1a\r\n"]

serialPort.on("open", function () {
    console.log('Serial communication open');

    serialPort.on('data', function(data) {
        console.log("Received data: " + data);
    });
    gsm_message_sending();
});

function gsm_message_sending() {
    for(let i = 0; i < W_buff.length; i++){
        setTimeout(function(){
            serialPort.write(W_buff[i]);
        }, 4000)
    }
    serialPort.write(Buffer.from([0x1A]));
}
