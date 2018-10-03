const rp = require('request-promise');
const $ = require('cheerio');
var mongoose = require('mongoose');
const log = require('simple-node-logger').createSimpleLogger('project.log');

var db;

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
	console.log("Getting itesmf for "+url);
	try{
	var html = await rp(url);
	var numOfItems = 0;
	$('#productsContent1_goods > div > div.goods_mz > a',html).each(function(i,item){
		var x = $(this);
		// console.log(x.text());
		numOfItems++;
	});

		
	}catch(error){
		console.log("Error");
		throw error;
	}
	console.log("There are a total of "+numOfItems+" on this page");
}

async function getProductInfo(){
	
}


async function connectDB(){
	console.log("Connecting to db");
	debugger
	const connectionString = "mongodb+srv://admin:spocket2018@cluster0-ibjdj.mongodb.net/test?retryWrites=true"
	mongoose.connect(connectionString);
	db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	console.log("Connected to the mongo db");
	});

}


(async function(){
	/*var links = await getAllHeadingLinks();
	getAllProductNameAndUrl(links[0]);

	for(var i = 0; i < links.length; i++){
		console.log(links[i]);
	}*/
	connectDB();
	
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