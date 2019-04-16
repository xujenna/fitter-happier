const Intervention = require('./base')
const emailer = require('../modules/emailer');
// const geoip = require('geoip-lite');
// var os = require('os');
// var ifaces = os.networkInterfaces();

class FieldTrip extends Intervention {
    async trigger(){
        let url = "https://www.google.com/maps/search/?api=1&query="
        let maxLat = 40.741740;
        let minLat = 40.725802;
        let maxLatDiff = maxLat - minLat;
        let maxLong = -73.984456;
        let minLong = -74.010345;
        let maxLongDiff = maxLong - minLong;

        let randLat = minLat + Math.random() * maxLatDiff;
        let randLong = minLong + Math.random() * maxLongDiff;
        let randCoords = randLat + "," + randLong;
        let randURL = url + randCoords;

        await emailer.emailContent("Time for a mini field trip!", randURL)

        let randPlaceInfo = {
            script: "Time for a mini field trip!",
            title: randURL
        }
        console.log(randPlaceInfo)
        return randPlaceInfo

        // let ip;
        // Object.keys(ifaces).forEach(function (ifname) {
        //     var alias = 0;

        //     ifaces[ifname].forEach(function (iface) {
        //         if ('IPv4' !== iface.family || iface.internal !== false) {
        //         // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        //             return;
        //         }
        //         if (alias >= 1) {
        //             // this single interface has multiple ipv4 addresses
        //             // console.log(ifname + ':' + alias, iface.address);
        //             ip = iface.address;
        //         } else {
        //             // this interface has only one ipv4 adress
        //             // console.log(ifname, iface.address);
        //             ip = iface.address;
        //         }
        //         ++alias;
        //     });
        // });
        // console.log(ip)
        // var coords = geoip.lookup(ip)

    }
}

module.exports = FieldTrip