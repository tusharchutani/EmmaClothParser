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

    try{
        await slack.webhook({
            channel: "#general",
            username: "webhookbot",
            text: "This is posted to #general and comes from a bot named webhookbot."
          })
    }catch(err){
        console.log("There was an error");
    }
    

    while(true){
        var total = await databaseConnections.numberOfAddedItems()

        //5 minute interwals
        await sleep(300000);
    }

})();