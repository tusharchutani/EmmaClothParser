var mongoose = require('mongoose');
const log = require('simple-node-logger').createSimpleLogger('project.log');
var Product = require('./product');
var db;

module.exports = class DB{
    async connect(username, password){
        
        
        const connectionString = `mongodb+srv://${username}:${password}@cluster0-ibjdj.mongodb.net/test?retryWrites=true`;
        const ret = await mongoose.connect(connectionString);
        db = mongoose.connection;
        if(ret === mongoose){
            log.info("Connected to db");
        }else{
            log.info("Unable to connect to database");
        }
    }

    async addProduct(product){
        try{
            log.info("Finding");
            var x = await Product.findOne({ handel: product.handel, option1Value: product.option1Value, option1Name: product.option1Name });
            log.info("Found");
            if(x != null){
                return false;
            }else{
                await product.save();
                log.info("Product was saved");
                return true;
            }
        }catch(e){
            log.error("There was an error trying to save product "+product.variantSKU);
            log.error(e);
        }
    }
    static async create(username, password){
        const o = new DB();
        await o.connect(username, password);
        return o;
    }

}