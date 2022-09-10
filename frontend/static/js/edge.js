const http = require('http')

//We use this function to round the generated values using a given precision
function roundWithMaxPrecision (n, precision) {
    const precisionWithPow10 = Math.pow(10, precision);
    return Math.round(n * precisionWithPow10) / precisionWithPow10;
}

//We would like to emulate a real sensor, so we are going to random generate a value between min and max
function getRandomNumber(min, max, decimal) {
    let n = Math.random() * (max - min) + min;
    if (decimal){
        return roundWithMaxPrecision(n, 1)//we stop at first decimal here, for example in the case of Body Temperature.
    }
    else return Math.ceil(n) //No decimal precision here because we are working with Heart Rate

}

//Since we are emulating real sensors, we need the values to slightly change in time according to a percentage
function slightlyChange(num, decimal) {
    let x = Math.random();
    if(x < 0.15){
        if (decimal){
            return roundWithMaxPrecision(num - 0.1, 1);
        }
        else return roundWithMaxPrecision(num - 1, 0);
    }
    if(x > 0.85){
        if (decimal){
            return roundWithMaxPrecision(num + 0.1, 1);
        }
        else return roundWithMaxPrecision(num + 1, 0);
    }
    else {
        return num;
    }
}

let startingtemp = getRandomNumber(36.3, 37.1, true);
let startinghr = getRandomNumber(60, 121);
let startingrespbpm = getRandomNumber(12, 17);
let startingspo2 = getRandomNumber(97, 100);

//Read values to send every 2 sec
setInterval(function() {
    const date = new Date();
    let bodytemp = slightlyChange(startingtemp, true);
    let hr = slightlyChange(startinghr);
    let respbpm = slightlyChange(startingrespbpm);
    let spo2 = startingspo2;
    console.log('Body temperature: '+bodytemp+'°C')
    console.log('Heart rate: '+hr+' BPM');
    console.log('Respiratory rate: '+respbpm+' BPM')
    console.log('Oxygen saturation: '+spo2+'%');
    //console.log(date);

    const data = JSON.stringify({
        'sensor': 'Mario Rossi',
        'timestamp': date,
        'temperature': bodytemp,
        'heartrate': hr,
        'resprate': respbpm,
        'oxygensat': spo2
    })

    const options = {

        hostname: '127.0.0.1',
        port: 3000,
        path: '/temperature',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);


        //define the callback function that will print the result of the request in case of success
        res.on('data', d => {
            process.stdout.write(d);
            console.log('\n--------------------------------------------');
        })

        //define the callback function that will print the result of the request in case of error
        req.on('error', error => {
            console.error(error);
        })
    })
    //send the request
    req.write(data);
    req.end();
}, 2000);