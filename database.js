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
            console.log("Getting number of items");
            var distinct = await Product.collection.distinct('handel');
            // console.log(distinct);
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
            return false;
        }
    }

    async updateProductPrice(productId, price){
        try{
            await Product.findOneAndUpdate({handel: productId, variantPrice: { $ne: null}},{$set: {variantPrice: price}});
        }catch(error){
            console.log("There was an error updating the product price")
        }
    }


    async getAllProductIdsAndHandels(){
        try {
            var toUpdate = await Product.find({ variantPrice: { $ne: null}});
            return toUpdate;
        }catch(error){
            console.log("Gettin an error"); 
        }
        return [];
    }

    static async create(username, password){
        const o = new DB();
        await o.connect(username, password);
        return o;
    }

}