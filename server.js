const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost/TemperatureDB';
const WebSocket =  require('ws');
const path = require('path');

const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    ws.send('something');
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});



app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json());
app.post("/temperature", (req, res, next) => {
    console.log('Achieved '+req.body.temperature+'°C of body temperature.');
    var sensor = req.body.sensor;
    var temperature = req.body.temperature;
    var heartrate = req.body.heartrate;
    var resprate = req.body.resprate;
    var oxygensat = req.body.oxygensat;
    var timestamp = req.body.timestamp;

    let values = [temperature, heartrate, resprate, oxygensat, timestamp]

    async function pushInDb() {
        const client = new MongoClient(uri, {useUnifiedTopology: true});
        try {

            await client.connect();

            const database = client.db("TemperatureDB");
            const temperatureColl = database.collection("temperature");
            // create a document to be inserted
            const doc = {
                sensor: sensor,
                body_temperature: temperature,
                heart_rate: heartrate,
                respiration_rate: resprate,
                oxygen_saturation: oxygensat,
                timestamp: timestamp
            };

            const result = await temperatureColl.insertOne(doc);
        } finally {
            await client.close();
        }
    }

    pushInDb().catch(console.dir);
    async function pushToClient(){
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(temperature);
            }
        });
    }
    pushToClient().catch(console.dir);
    res.sendStatus(200)
});

app.get('/dashboard', async (req, res) => {
    /*const client = new MongoClient(uri);
    async function run() {
        try {
            const database = client.db("TemperatureDB");
            const temp = database.collection("temperature");
            const cursor = temp.find();

            if ((await temp.estimatedDocumentCount()) === 0) {
                console.log("No documents found!");
            }

            let found = await cursor.toArray()
            let tempvalues = []
            let hrvalues = []
            let respvalues = []
            let oxyvalues = []
            let timevalues = []
            for(let i =0; i < await temp.estimatedDocumentCount(); i++){
                tempvalues.push(found[i].body_temperature)
                hrvalues.push(found[i].heart_rate)
                respvalues.push(found[i].respiration_rate)
                oxyvalues.push(found[i].oxygen_saturation)
                timevalues.push(found[i].timestamp)
            }

            let values = [tempvalues, hrvalues, respvalues, oxyvalues, timevalues]
            try {
                return values;
            }
            catch (e)
            {
                return -1;
            }
        } finally {
            await client.close();
        }
    }
    var finalvalues = await run().catch(console.dir);
    console.log('Body temperatures: '+finalvalues[0])
    console.log('Heart rates: '+finalvalues[1])
    console.log('Respiration rates: '+finalvalues[2])
    console.log('Oxygen saturations: '+finalvalues[3])
    //console.log('Timestamps: '+finalvalues[4])
    //let time = Date.parse(finalvalues[4][0]);
    //console.log(new Date(time).toUTCString())
    res.send('Hello World! The last temperature is: '+finalvalues[0]);*/
    res.sendFile(path.join(__dirname + '/index.html'));
    })
