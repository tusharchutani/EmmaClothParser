const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.emmacloth.com/Trending-vc-7051.html';



function getAllHeadingLinks(){
	try{
		var html = await rp('https://www.emmacloth.com');
		console.log("Got the html");
		$('.list_li.third-link.list-link.j-list-link.j-third-link > a',html).each(function(i, item){
			var x = $(this);
			console.log($(this).text() + " - "+x[0].attribs.href);
		});

	}catch(error){
		console.log(error);
	}
}


(async function(){
	getAllHeadingLinks();

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