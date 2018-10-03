const rp = require('request-promise');
const url = 'https://www.emmacloth.com/Trending-vc-7051.html';

rp(url)
  .then(function(html){
    //success!
    console.log(html.getElementsByClassName("goods_mz"));
  }).catch(function(err){
    //handle error
    console.log("There was an error");
  });