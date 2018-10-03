var mongoose = require('mongoose');
const log = require('simple-node-logger').createSimpleLogger('project.log');
var Product;
var username;
var password;

module.exports = class DB{
    constructor(username, password){
        this.username = username;
        this.password = password;
        var productSchema = new mongoose.Schema({
            handel: String,
            title: String,
            body: String,
            vendor:String,
            type:String,
            tags:[String],
            option1Name:String,
            option1Value:String,
            variantSKU:String,
            variantInventoryQty:Number,
            imgSrc:String, 
            imagePos:Number,
            imageAltText:String
        });
        
        Product = mongoose.model('Product',productSchema);
    }

    async connect(){
        console.log("username:"+username+" password:"+password);
        const connectionString = `mongodb+srv://${username}:${password}@cluster0-ibjdj.mongodb.net/test?retryWrites=true`
        const ret = await mongoose.connect(connectionString);
        db = mongoose.connection;
        if(ret === mongoose){
            log.info("Connected to db");
        }else{
            log.info("Unable to connect to database");
        }
    }

    addProduct(){
        
    }

    productExists(){
    }

    static async create(username, password){
        const o = new DB(username, password);
        await o.connect();
        return o;
    }

}