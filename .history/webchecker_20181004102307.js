var Slack = require('slack-node');
const DB = require('./database');
const sleep = require('util').promisify(setTimeout)
var databaseConnections

webhookUri="https://hooks.slack.com/services/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";


(async function(){
    console.log("Setting up data base");
    databaseConnections = await DB.create("admin","admin");
    slack = new Slack();
    slack.setWebhook(webhookUri);


    while(true){
        try{
            var items = await databaseConnections.numberOfAddedItems();
            var time = new Date(); // for now
            /*await slack.webhook({
                channel: "#noofproductsindexed",
                username: "ItemTracker",
                text: "There are "+items.length+" items indexed"+" checked at "+time
              })*/
        }catch(err){
            console.log("there was an error "+err);
        }

        //5 minute interwals
        await sleep(600000);
    }

})();