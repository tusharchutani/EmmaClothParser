const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.emmacloth.com/Trending-vc-7051.html';





(async function(){
	console.log("Starting the function");
	try{
		var html = await rp(url);
		console.log("Got the html");
		$('.list_li.third-link.list-link.j-list-link.j-third-link>a',html).each(function(item, i){
			console.log(item);
		});

	}catch(error){
		console.log(error);
	}


let value = await testingURL();
console.log("Done "+value);
/*
	.then(function(html){
	  	console.log(html);
	  	console.log("________________________________________");
	    //success!
	    /*$('.goods_mz > a ',html).each(function(i, item){
	      console.log("Item: ");
	      console.log(item.attribs.title);
	    });
	}).catch(function(err){
	    //handle error
	    console.log("There was an error "+err);
  });*/
})();