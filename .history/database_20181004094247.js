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

    async numberOfAddedItems(){
        try{
            var distinct = await Product.find().distinct('handle').count().exec();
            return distinct;
        }catch(error){
            log.error("Unable to get number of disctinct items"+error);
        }

    }

    async addProduct(product){
        try{
            log.info("Saving the product. "+ product.variantSKU);
            await product.save();
            log.info("Product has been saved");
            return true;
        }catch(e){
            console.log("The product was already in the DB "+product.handel);
            // log.error(e);
        }
    }
    static async create(username, password){
        const o = new DB();
        await o.connect(username, password);
        return o;
    }

}