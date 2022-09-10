const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost/TemperatureDB';

app.get('/dashboard', async (req, res) => {
    async function run() {
        const client = new MongoClient(uri, {useUnifiedTopology: true});
        try {

            await client.connect();
            const database = client.db("TemperatureDB");
            const tem = database.collection("temperature");
            // Query for a temperature with a timestamp that is greater than 0
            const query = { timestamp: {$gt: 0}};
            const options = {
                // sort matched documents in descending order by timestamp
                sort: { timestamp: 1 },
            };
            const singleTemperature = await tem.findOne(query, options);
            // since this method returns the matched document, not a cursor, print it directly
            console.log(singleTemperature);
            try {
                return singleTemperature.value;
            }
            catch (e)
            {
                return -1;
            }
        } finally {
            await client.close();
        }
    }
    //use await for wating the promise
    var finalTemp = await run().catch(console.dir);
    res.send('Hello World! The last temperature is: '+finalTemp);
})
