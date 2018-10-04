var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    handel: {type: String, required: true},
    title: String,
    body: String,
    migratedFrom: String,
    vendor:String,
    type:String,
    tags:[String],
    option1Name:String,
    option1Value:String,
    option2Name:String, 
    option2Value:String,
    variantSKU:String,
    variantInventoryQty:Number,
    variantPrice:Number,
    imgSrc:String, 
    imgPos:Number,
    imgAlt:String,
});

productSchema.index({ handel: 1, option1Value: 1, option1Name: 1, imgSrc: 1 }, { unique: true});

module.exports = mongoose.model('Product',productSchema);
