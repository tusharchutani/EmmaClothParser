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
            log.info("Saving the product. "+ product.variantSKU);
            await product.save();
            log.info("Product has been saved");
        }catch(e){
            log.error("The product was already in the DB "+product.variantSKU);
            log.error(e);
        }
    }
    static async create(username, password){
        const o = new DB();
        await o.connect(username, password);
        return o;
    }

}