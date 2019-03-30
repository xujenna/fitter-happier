const SerialPort = require("serialport")
const serialPort = new SerialPort("/dev/ttyS0");

let W_buff = ["AT+CMGF=1\r\n", "AT+CSCA=\"+12063130004\"\r\n", "AT+CMGS=\"16307308188\"\r\n","hey girl"]

serialPort.on("open", function () {
    console.log('Serial communication open');
    serialPort.write("AT\r\n");
    let count = 0;
    serialPort.on('data', function(data) {
        console.log("Received data: " + data);
        count += 1;
        console.log(count)
        if(count == W_buff.length - 1){
            serialPort.write(W_buff[i]);
            serialPort.write("\x1a\r\n");
            serialPort.close();
        }
        else {
            gsm_message_sending(count);
        }
    });
});

function gsm_message_sending(count) {
    serialPort.write(W_buff[count]);
    console.log(message)
}
