const express = require('express')
const app = express();
const port = 3000
const DB = require('./database');
var databaseConnections

app.get('/', async (req, res) => {
    var total = await databaseConnections.numberOfAddedItems()
    res.send("There are "+total+" items");
})

app.listen(port, async () => {
    databaseConnections = await DB.create("admin","admin");
    console.log(`Example app listening on port ${port}!`)
})