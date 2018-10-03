const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.emmacloth.com/Trending-vc-7051.html';

rp(url)
  .then(function(html){
    //success!
    $('.goods_mz > a ',html).each(function(i, item){
      console.log($("Item name: ", item).text())
    });
}).catch(function(err){
    //handle error
    console.log("There was an error");
  });