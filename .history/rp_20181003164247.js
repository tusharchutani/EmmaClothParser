const rp = require('request-promise');
const log = require('simple-node-logger').createSimpleLogger('project.log');
const sleep = require('util').promisify(setTimeout)


module.exports = class RP{
    static async rp(options){
        var data;
        try{
            data = await rp(options)
        }catch(error){
            log.error("There is an error in calling info "+error+ " URL:"+options.uri);
            log.info("Trying in 5 seconds again"); 
            await sleep(5000);
            data = await rp(options);
        }
        return data
    }
}