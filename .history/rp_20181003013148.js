const rp = require('request-promise');
const sleep = require('util').promisify(setTimeout)


module.exports = class RP{
    static async rp(options){
        var data;
        try{
            data = await rp({uri: url, headers: {Connection: 'keep-alive'}})
        }catch(error){
            log.error("There is an error in calling getAllProductNameAndUrl info "+error);
            log.info("Trying in 1.5 seconds again"); 
            await sleep(1500)
            data = rp(options);
        }
        return data
    }
}