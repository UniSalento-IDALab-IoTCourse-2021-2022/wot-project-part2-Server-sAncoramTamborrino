const express = require("express");
const path = require("path");
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost/TemperatureDB';
const WebSocket =  require('ws');

const app = express();

const wss = new WebSocket.Server({ port: 3001 });

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json());
app.post("/temperature", (req, res, next) => {
    console.log('Achieved '+req.body.temperature+'°C of body temperature with prediction ' +req.body.model_prediction);
    var sensor = req.body.sensor;
    var temperature = req.body.temperature;
    var heartrate = req.body.heartrate;
    var resprate = req.body.resprate;
    var oxygensat = req.body.oxygensat;
    var timestamp = req.body.timestamp;
    var cartemp = req.body.cartemp;
    var co2 = req.body.co2;
    var prediction = req.body.model_prediction;

    let values = [temperature, heartrate, resprate, oxygensat, timestamp, cartemp, co2, prediction]

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
                timestamp: timestamp,
                cockpit_temperature: cartemp,
                cockpit_co2: co2,
                prediction: prediction
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
                client.send(values.toString());
            }
        });
    }
    pushToClient().catch(console.dir);
    res.sendStatus(200)
});
app.get('/download', function(req, res){
    const file = `${__dirname}/finalized_model.sav`;
    res.download(file); // Set disposition and send it.
});

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend","index.html"));
})

app.listen(process.env.PORT || 3000, () => console.log("Server woke up"));