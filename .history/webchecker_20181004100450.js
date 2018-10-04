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
        var total = await databaseConnections.numberOfAddedItems();
        debugger
        var time = new Date(); // for now
        try{
            await slack.webhook({
                channel: "#noofproductsindexed",
                username: "ItemTracker",
                text: "There are "+total+" items indexed"+" checked at "+time
              })
        }catch(err){
            console.log("There are "+total+" items indexed"+" checked at "+time);
        }

        //5 minute interwals
        await sleep(300000);
    }

})();