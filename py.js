const {spawn} = require('child_process');

// Test data to send
var data = ['98','22', '97', '37'];
var outcome;

// Launch a script with Python as interpreter, and send to output what it prints
const python = spawn('python', ['script.py', data[0], data[1], data[2], data[3]]);
python.stdout.on("data", function (data) {
    console.log("data from script");
    outcome = data.toString()
    console.log(outcome)
})

// Return exit code of the script
python.on("close", (code) => {
    console.log(`child process closed stdio with code ${code}`)
})

