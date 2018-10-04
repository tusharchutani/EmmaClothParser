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

    i = 0;
    while(true){
        console.log("CHECKING....")
        try{
            var items = await databaseConnections.numberOfAddedItems();
            var date = new Date();
            var utcDate = new Date(date.toUTCString());
            utcDate.setHours(utcDate.getHours()-8);
            var usDate = new Date(utcDate);

            var txt = "There are *"+items.length+" items indexed"+" checked at "+usDate.toTimeString();
            await slack.webhook({
                channel: "#noofproductsindexed",
                username: "ItemTracker",
                text: txt
              }, function(err, response) {
                if(err){
                    console.log("Slack"+response);
                }
              })
        }catch(err){
            console.log("there was an error "+err);
        }
        console.log("Checking again in 10 minutes");
        await sleep(600000);
        //5 minute interwals
    }

})();