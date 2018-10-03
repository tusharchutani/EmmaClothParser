const rp = require('request-promise');
const $ = require('cheerio');
const log = require('simple-node-logger').createSimpleLogger('project.log');


async function getAllHeadingLinks(){
	var links = [];
	try{
		var html = await rp('https://www.emmacloth.com');
		console.log("Got the html");
		$('.list_li.third-link.list-link.j-list-link.j-third-link > a',html).each(function(i, item){
			var x = $(this);
			links.push(x[0].attribs.href);
		});

	}catch(error){
		console.log(error);
	}
	return links;
}

async function getAllProductNameAndUrl(url){

	try{
	var html = await rp(url);
	$('#productsContent1_goods > div:nth-child(3) > div.goods_mz > a',html).each(function(i,item){
		console.log(item);
		debugger
	});

		
	}catch(error){
		console.log("Error");
		throw error;
	}

}

async function getProductInfo(){
	
}


(async function(){
	var links = await getAllHeadingLinks();

	for(var i = 0; i < links.length; i++){
		console.log(links[i]);
	}
	
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