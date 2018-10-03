const rp = require('request-promise');
const $ = require('cheerio');
const log = require('simple-node-logger').createSimpleLogger('project.log');


async function getDataWithHtml(url, selector){
	try{
		var html = await rp(url);
		return $(selector,html);

	}catch(error){
		console.log("There is an error");
		throw error;
	}
}

async function getAllHeadingLinks(){
	var links = [];
	try {
	await getDataWithHtml('https://www.emmacloth.com', '.list_li.third-link.list-link.j-list-link.j-third-link > a')
	.each(function(i, item){
		var x = $(this);
		console.log("Link:" + x[0].attribs.href);
		});
	}catch(err){
		console.log("Error "+err);
		return []
	}
	return links;
}


async function test(){
	var links = [];
	try{
		var html = await rp('https://www.emmacloth.com');
		console.log("Got the html");
		$('.list_li.third-link.list-link.j-list-link.j-third-link > a',html).each(function(i, item){
			var x = $(this);
			console.log(x.text() + " " + x[0].attribs.href);

			links.push(x[0].attribs.href);
		});

	}catch(error){
		console.log(error);
	}
}




async function getProductNameAndUrl(url){

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