const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter;

module.exports = class CSVWritter{
    static async setUp(){
        csvWriter = createCsvWriter({
            path: './allProducts.csv',
            header: [
                {id: 'handel', title: 'handel'},
                {id: 'title', title: 'title'},
                {id: 'body', title:'body'},
                {id: 'vendor', title:'vendor'},
                {id: 'type', title:'type'},
                {id: 'tags', title:'tags'},
                {id: 'option1Name', title:'option1Name'},
                {id: 'option1', title:'option1'},
                {id: 'option2Name', title:'option2Name'},
                {id: 'option2', title:'option2'},
                {id: 'option2Name', title:'option2Name'},
                {id: 'variantSKU', title:'variantSKU'},
                {id: 'inventoryQty', title:'inventoryQty'},
                {id: 'option2Name', title:'option2Name'},
                {id: 'variantPrice', title:'variantPrice'},
                {id: 'imgSrc', title:'imgSrc'},
                {id: 'imgPos', title:'imgPos'},
                {id: 'imgSrc', title:'imgSrc'},
                {id: 'imgAlt', title:'imgAlt'},
                {id: 'migrated_from', title:'migrated_from'},



            ]
        });
        
    }
}