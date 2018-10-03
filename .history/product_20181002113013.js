var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    handel: {type: String, required: true},
    title: String,
    body: String,
    migrated_form: String,
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

productSchema.index({ handel: 1, option1Value: 1, option1Name: 1 }, { unique: true});

module.exports = mongoose.model('Product',productSchema);
