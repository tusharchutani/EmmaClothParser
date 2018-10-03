const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.emmacloth.com/Trending-vc-7051.html';

rp(url)
  .then(function(html){
    //success!
    console.log($('.goods_mz',html));
  }).catch(function(err){
    //handle error
    console.log("There was an error");
  });