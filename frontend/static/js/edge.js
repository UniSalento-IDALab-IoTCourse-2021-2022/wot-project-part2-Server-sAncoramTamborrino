const http = require('http')
const {spawnSync} = require('child_process');
var fs = require('fs');
var keypress = require('keypress');

function download(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);
        });
    });
}

function checkModel() {
    if(fs.existsSync('/Users/samueleancora/WebstormProjects/iot_course/finalized_model.sav')){
        console.log("The edge device found a model.")
    }
    else{
        console.log("Model not found. I'm downloading...")
        download('http://127.0.0.1:3000/download', '/Users/samueleancora/WebstormProjects/iot_course/finalized_model.sav')
    }
}

function model(hr, respbpm, spo2, bodytemp) {
    // Launch a script with Python as interpreter, and send to output what it prints
    const python = spawnSync('python3', ['../../../script.py', bodytemp, hr, respbpm, spo2]);
    if (python.status!==0) {
        console.log(Error(python.stderr))
        process.exitCode = 1;
    }
    if (python.output[1].toString().slice(1,2)==='1')
        return 'Abnormal'
    return 'Normal'
}

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

checkModel()
let startingtemp = getRandomNumber(36.3, 37.1, true);
let startinghr = getRandomNumber(60, 80);
let startingrespbpm = getRandomNumber(12, 16);
let startingspo2 = getRandomNumber(97, 99);
let stressing = false
//Read values to send every 2 sec
setInterval( function () {
    const d_t = new Date();
    let year = d_t.getFullYear();
    let month = ("0" + (d_t.getMonth() + 1)).slice(-2);
    let day = ("0" + d_t.getDate()).slice(-2);
    let hour = d_t.getHours();
    let minute = d_t.getMinutes();
    let seconds = d_t.getSeconds();
    const date = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + seconds
    console.log(date);
    let bodytemp = slightlyChange(startingtemp, true);
    let hr = slightlyChange(startinghr);
    let respbpm = slightlyChange(startingrespbpm);
    let spo2 = startingspo2;

    if(stressing){
        if(hr < 150){
            startinghr+=4;
            if(startinghr > 100){
                respbpm = 15
            }
            if(startinghr > 110){
                respbpm = 16
            }
            if(startinghr > 120){
                respbpm = 17
            }
            if(startinghr > 130){
                respbpm = 18
            }
            if(startinghr > 140){
                respbpm = 19
            }
            if(startinghr > 150){
                respbpm = 20
            }
        }
    }

    console.log('Body temperature: ' + bodytemp + '°C')
    console.log('Heart rate: ' + hr + ' BPM');
    console.log('Respiratory rate: ' + respbpm + ' BPM')
    console.log('Oxygen saturation: ' + spo2 + '%');
    // Send data to model
    let prediction = model(hr, respbpm, spo2, bodytemp)
    console.log(prediction)
    console.log(stressing)

    keypress(process.stdin);

    process.stdin.on('keypress', function (ch, key) {
        if (key.name === 'c') {
            stressing = true
            process.stdin.pause();
        }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();

    const data = JSON.stringify({
        'sensor': 'Mario Rossi',
        'timestamp': date,
        'temperature': bodytemp,
        'heartrate': hr,
        'resprate': respbpm,
        'oxygensat': spo2,
        'model_prediction': prediction
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
}, 3000);