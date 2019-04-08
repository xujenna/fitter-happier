su - pi <<!
sudo bluetoothctl 
connect 00:00:00:00:88:C8
quit
ping -q -w 1 -c 1 `ip r | grep default | cut -d ' ' -f 3` > /dev/null && echo ‘ok’ || (python /home/pi/fitter-happier/gsm-hat/GSM_PWRKEY.py && sleep 45)
cd /home/pi/fitter-happier/
npm run cred node index_query.js
ip addr | grep ppp && (python /home/pi/fitter-happier/gsm-hat/GSM_PWRKEY.py) || echo ‘done’
!