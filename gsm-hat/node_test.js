const SerialPort = require("serialport")
const serialPort = new SerialPort("/dev/ttyS0");
const Readline = require('@serialport/parser-readline')

let W_buff = ["AT+CMGF=1\r\n", "AT+CSCA=\"+12063130004\"\r\n", "AT+CMGS=\"16307308188\"\r\n","hey girl\r\n"]

let count = 0;

const parser = serialPort.pipe(new Readline({ delimiter: '\r\n' }))

serialPort.on("open", function () {
    // serialPort.flush()
    serialPort.write("AT\r\n")
    console.log('Serial communication open');

    // serialPort.on('data', function(data) {
    //     console.log("Received data: " + data);
    // });

    parser.on('data', function(data){
        console.log("parsed data: " + data);
        // if(data.includes("OK")){
            gsm_message_sending(count)
            count += 1;
            console.log(count);
        // }
        // else if (data.includes("ERROR")){
        //     console.log("retrying?")
        //     setTimeout(function(){
        //         gsm_message_sending(count);
        //     }, 1500)
        //     console.log(count);
        // }

        if(count > W_buff.length){
            count = 0;
            serialPort.flush();
            serialPort.close();
        }
    })
});

function gsm_message_sending(count) {
    // if(message !== undefined){
    //     serialPort.write(message);
    //     serialPort.drain()
    //     console.log(message)
    // }
    setTimeout(function(){
        if(count == W_buff.length - 1){
            setTimeout(function(){
                serialPort.write(W_buff[count]);
                serialPort.write(Buffer.from([0x1A]));
                serialPort.write("\x1a\r\n");
                serialPort.drain()
            }, 1500)
        }
        else{
            serialPort.write(W_buff[count])
            serialPort.drain()
            //, function(err){
                // console.log("error, resending?" + err)
                // setTimeout(function(){
                //     serialPort.write(W_buff[count]);
                // }, 1500)
            // });
        }
    }, 1500)
}

