const createCsvWriter = require('csv-writer').createObjectCsvWriter;
var Product = require('./product');

module.exports = class CSVWritter{

    async write(products){
        debugger
        csvWriter.write(products);
    }
    static async setUp(){
        var csvWriter = createCsvWriter({
            path: './allProducts.csv',
            header: [
                {id: 'handel', title: 'Handel'},
                {id: 'title', title: 'Title'},
                {id: 'body', title:'Body(HTML)'},
                {id: 'vendor', title:'Vendor'},
                {id: 'type', title:'Type'},
                {id: 'tags', title:'Tags'},
                {id: 'option1Name', title:'Option 1 Name'},
                {id: 'option1Value', title:'Option 1 Value'},
                {id: 'variantSKU', title:'Variant SKU'},
                {id: 'variantInventoryQty', title:'Variant Inventory Qty'},
                {id: 'variantPrice', title:'Variant Price'},
                {id: 'imgSrc', title:'Image Src'},
                {id: 'imgPos', title:'Image Position'},
                {id: 'imgAlt', title:'Image Alt Text'},
                {id: 'migratedFrom', title:'migrated_from'},
            ]
        });
        return csvWriter;
    }
}