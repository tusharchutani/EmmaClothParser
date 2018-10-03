var mongoose = require('mongoose');

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

var Product = mongoose.model('Product',productSchema);
