const rp = require('request-promise');
const $ = require('cheerio');
var mongoose = require('mongoose');
const log = require('simple-node-logger').createSimpleLogger('project.log');
var db;
const DB = require('./database');

async function getAllHeadingLinks(){
	var links = [];
	try{
		var html = await rp('https://www.emmacloth.com');
		console.log("Got the html");
		$('.list_li.third-link.list-link.j-list-link.j-third-link > a',html).each(function(i, item){
			var x = $(this);
			links.push(x[0].attribs.href);
			log.info("Link: "+x[0].attribs.href+ " Text: "+x.text())
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


async function getProductInfo(productUrl){
	debugger
	var html = await rp(productUrl);
	var productString = "";
	productString.concat("handel-id: "+$("#productCodeSpan",html).text() + ", \n");
	productString.concat("Price: "+$("#good_spantotal.good_spantotal".text() + ", \n")); //10.50
	productString.concat("Body: "+$("#goods_description_top.goods_description".text() + ", \n")); //10.50
	productString.concat("Body: "+$("#goods_description_top.goods_description".text() + ", \n")); //10.50
	

	//get bread crums
	var breadCrums = [];
	$("div.goods_top > span.good_homeTitel2>a",html).each(function(i,item){
		var x = $(this);
		log.info(x.text());
		breadCrums.push(x.text());
	});
	

}

async function getAllProductsFromHeaderLink(headerLink){
	log.info("Getting products from url:"+headerLink);
	try{
	var html = await rp(headerLink);
	var numOfItems = 0;
	$('#productsContent1_goods > div > div.goods_mz > a',html).each(function(i,item){
		var x = $(this);
		log.info(x.text());
		numOfItems++;
	});

		
	}catch(error){
		log.error(error + " for page "+headerLink);
		throw error;
	}
	//TODO: make sure next is working
	log.info("There are a total of "+numOfItems+" on "+headerLink);
}



(async function(){

	/*log.info("Starting script");
	log.info("Starting DB connection");
	const databaseConnections = await DB.create("admin","spocket2018");
	databaseConnections.addProduct();
	
	log.info("Getting all header links");
	var headerLinks = await getAllHeadingLinks();

	for(var i = 0; i < headerLinks.length; i++){
		getAllProductsFromHeaderLink(headerLinks[i]);
	}*/

	await getProductInfo("https://www.emmacloth.com/Knot-Back-Lace-Trim-Blouse-p-506664-cat-1733.html");

})();