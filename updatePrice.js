const DB = require('./database');
const RP = require('./rp');
const webhookUri="https://hooks.slack.com/services/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";
const updatePriceLog = require('simple-node-logger').createSimpleLogger('updatePrice.log');

    async function getProductPrice(productId, times=1){ 
        var options = {
            method: 'POST',
            uri:'https://www.emmacloth.com/index.php',
            form:{
                model:"product",
                action:"update_product_price",
                goods_id:productId,
                change_currency_update:1
            },
            headers: {Connection: 'keep-alive'},
            json:true
        }
        var priceData = await RP.rp(options);
        if(priceData == ''){
            issues.error("Could not get price for "+productId);
        }
        console.log("Got the price of the product "+priceData);
        return priceData != '' ? priceData.goods_price.default_price.member_price.wholesale_11 : '';
        
    }


(async function(){

    updatePriceLog.info("---------------------------SCRIPT HAS STARTED---------------------------");
    updatePriceLog.info("Setting up DB connection");
    databaseConnections = await DB.create("admin","admin");
    updatePriceLog.info("Getting all the products to change the price for ");    
    var productHandels = await databaseConnections.getAllProductIdsAndHandels();
    updatePriceLog.info("Got all the prices");    
    var total = productHandels.length;
    var currentNumber = 1;

    for(const productHandel of productHandels){
        var productID = productHandel.migratedFrom;
        productID = productID.match("-p-(.*)-cat")[1];
        
        var newPrice = await getProductPrice(productID);
        newPrice = newPrice.substr(3);
        newPrice = parseFloat(newPrice);
        await databaseConnections.updateProductPrice(productHandel.handel, newPrice);
        var txt = currentNumber + "/" + total;

        await slack.webhook({
            channel: "#noofproductsindexed",
            username: "ItemTracker",
            text: txt
          }, function(err, response) {
            if(err){
                console.log("Slack"+response);
            }
          })

        currentNumber++;
    }
    updatePriceLog.info("Finished");



})()