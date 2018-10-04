const rp = require('request-promise');
const log = require('simple-node-logger').createSimpleLogger('project.log');
const sleep = require('util').promisify(setTimeout)


module.exports = class RP{
    static async rp(options, times=1){
        if(options.uri.charAt(0)=="/"){
            debugger
        }
        if(times != 6){
            console.log("Trying to connect to "+options.uri+" try #"+time); 
            if(times != 1){
                var waitTime = Math.pow(3000,times);
                await sleep(waitTime);
            }
            var data;
            try{
                data = await rp(options)
            }catch(error){
                times++;
                log.error("There is an error in calling info "+error+ " URL:"+options.uri);
                console.log("Trying in 5 seconds again"); 
                data = await rp(options,times);
            }
            return data
        }else{
            log.error("Could not get data");
            return null;
        }
    }
}