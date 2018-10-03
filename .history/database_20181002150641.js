var mongoose = require('mongoose');
const log = require('simple-node-logger').createSimpleLogger('project.log');
var Product = require('./product');
var db;

module.exports = class DB{
    async connect(username, password){
        const connectionString = `mongodb://${username}:${password}@cluster0-shard-00-00-ibjdj.mongodb.net:27017,cluster0-shard-00-01-ibjdj.mongodb.net:27017,cluster0-shard-00-02-ibjdj.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`;
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
            debugger
            var x = await Product.findOne({ handel: product.handel, option1Value: product.option1Value, option1Name: product.option1Name });
            if(x != null){
                return false;
            }else{
                log.info("Saving a new product");
                await product.save();
                return true;
            }
        }catch(e){
            debugger
            log.error(e);
        }
    }

    productExists(){
    }

    static async create(username, password){
        const o = new DB();
        await o.connect(username, password);
        return o;
    }

}