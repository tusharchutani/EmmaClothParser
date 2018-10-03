const rp = require('request-promise');
const $ = require('cheerio');
const log = require('simple-node-logger').createSimpleLogger('project.log');


async function getDataWithHtml(url, selector){
	try{

	}catch(err){
		throw err;
	}
}

async function getAllHeadingLinks(){
	var links = [];
	try {
	await getDataWithHtml('https://www.emmacloth.com', 'list_li.third-link.list-link.j-list-link.j-third-link > a')
		.each(function(i, item){
			var x = $(this);
			links.push(x[0].attribs.href);
		});
	}catch(err){
		return []
	}
	return links;
}

async function getProductNameAndUrl(url){

}

async function getProductInfo(){
	
}


(async function(){
	var links = await getAllHeadingLinks();

	for(var i = 0; i < links.length; i++){
		console.log("Using helper function "+links[i]);
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