const SerialPort = require("serialport")
const serialPort = new SerialPort("/dev/ttyS0");
const Readline = require('@serialport/parser-readline')

let W_buff = ["AT\r\n", "AT+CMGF=1\r\n", "AT+CSCA=\"+12063130004\"\r\n", "AT+CMGS=\"16307308188\"\r\n","hey girl\r\n"]

let count = 0;

const parser = serialPort.pipe(new Readline({ delimiter: '\r\n' }))


serialPort.on("open", function () {
    serialPort.flush()
    console.log('Serial communication open');

    serialPort.on('data', function(data) {
        console.log("Received data: " + data);
    });

    parser.on('data', function(data){
        console.log(data);
        if(data == "OK"){
            count += 1;
        }
        if(count >= W_buff.length){
            count = 0;
            serialPort.flush();
            serialPort.close();
        }
    })

    for(let i = 0; i <= W_buff.length -1; i++){
        setTimeout(function(){
            gsm_message_sending(W_buff[i]);
        }, 5000)

        if(i == W_buff.length - 1){
            serialPort.write(W_buff[i]);
            serialPort.drain()
            serialPort.write("\x1a\r\n");
            serialPort.drain()
        }
    }
});

function gsm_message_sending(message) {
    if(message !== undefined){
        serialPort.write(message);
        serialPort.drain()
        console.log(message)
    }
}
