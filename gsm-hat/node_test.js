const SerialPort = require("serialport")
const serialPort = new SerialPort("/dev/ttyS0");

let W_buff = ["AT\r\n", "AT+CMGF=1\r\n", "AT+CSCA=\"+12063130004\"\r\n", "AT+CMGS=\"16307308188\"\r\n","hey girl"]
serialPort.flush()

serialPort.on("open", function () {
    console.log('Serial communication open');

    serialPort.on('data', function(data) {
        console.log("Received data: " + data);
        if(data == W_buff[W_buff.length-1]){
            serialPort.close()
        }
    });

    for(let i = 0; i <= W_buff.length; i++){
        setTimeout(function(){
            gsm_message_sending(W_buff[i]);
        }, 5000)

        if(i == W_buff.length - 1){
            serialPort.write(W_buff[i]);
            serialPort.write("\x1a\r\n");
        }
    }
});

function gsm_message_sending(message) {
    if(message !== undefined){
        serialPort.write(message);
        console.log(message)
    }
}
