var mongoose = require('mongoose');
const log = require('simple-node-logger').createSimpleLogger('project.log');
var Product = require('./product');
var db;

module.exports = class DB{
    /*constructor(){
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
    }*/

    async connect(username, password){
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

        var testProduct = new Product({
            handel: "Testing a new handel",
            title: "Title-handel-1",
            body: "<b>Testing an html body</b>",
            vendor:"Emma cloth",
            type:"type1",
            tags:["tag 1","tag 2","tag 3"],
            option1Name:"color",
            option1Value:"red",
            variantSKU:"tee-1234",
            variantInventoryQty:100,
            imgSrc:"google.com", 
            imagePos:1,
            imageAltText:"Alt text"
        });
        log.info("Saving a new product");
        testProduct.save();
        
    }

    productExists(){
    }

    static async create(username, password){
        const o = new DB();
        await o.connect(username, password);
        return o;
    }

}