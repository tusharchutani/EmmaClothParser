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
                {id: 'handel', title: 'handel'},
                {id: 'title', title: 'title'},
                {id: 'body', title:'body'},
                {id: 'vendor', title:'vendor'},
                {id: 'type', title:'type'},
                {id: 'tags', title:'tags'},
                {id: 'option1Name', title:'option1Name'},
                {id: 'option1Value', title:'option1Value'},
                {id: 'variantSKU', title:'variantSKU'},
                {id: 'variantInventoryQty', title:'variantInventoryQty'},
                {id: 'variantPrice', title:'variantPrice'},
                {id: 'imgSrc', title:'imgSrc'},
                {id: 'imgPos', title:'imgPos'},
                {id: 'imgSrc', title:'imgSrc'},
                {id: 'imgAlt', title:'imgAlt'},
                {id: 'migratedFrom', title:'migratedFrom'},
            ]
        });
        return csvWriter;
    }
}