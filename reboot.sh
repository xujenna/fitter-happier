#!/bin/sh

su - pi <<!
sudo bluetoothctl 
connect 53:B7:C7:01:02:F2
quit
ping -q -w 1 -c 1 `ip r | grep default | cut -d ' ' -f 3` > /dev/null && echo ‘ok’ || (python /home/pi/fitter-happier/gsm-hat/GSM_PWRKEY.py sleep 20)
cd /home/pi/fitter-happier/
npm run cred node index_rituals.js
ip addr | grep ppp && (python /home/pi/fitter-happier/gsm-hat/GSM_PWRKEY.py) || echo ‘done’
!