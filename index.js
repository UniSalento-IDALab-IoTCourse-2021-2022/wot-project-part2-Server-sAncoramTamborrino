const http = require('http')

//We are acting like there is a real sensor, so we need random float in range
function getRandomNumber(min, max) {
    let n = Math.random() * (max - min) + min;
    return Number(n).toFixed(1) //we stop at first decimal
}

//Read values to send every 2 sec
setInterval(function() {
    const date = new Date()
    const bodytemp = getRandomNumber(36.3, 36.8);
    console.log('Body temperature:', bodytemp + 'C');
    console.log(date.toString());

    const data = JSON.stringify({
        'sensor': 'Body Temperature',
        'timestamp': date.toString(),
        'temperature': bodytemp
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