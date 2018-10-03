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
		log.info(error);
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
	var html = await rp(productUrl);
	var productId = productUrl.match("-p-(.*)-cat")[1];
	var productString = "";
	
	productString.concat("Handel-id: "+ $("#productCodeSpan",html).text());
	//change_currency_update
	console.log("Price: "+await getProductPrice(productId));
	console.log("Body: "+ $("#goods_description_top > .goods_description > .goods_description_con > .ItemSpecificationCenter",html).html())
	productString.concat("Body: "+$("#goods_description_top > .goods_description > .goods_description_con > .ItemSpecificationCenter",html).text() + ", \n"); //10.50
	// productString.concat("Body: "+$("#goods_description_top.goods_description",html).text() + ", \n"); //10.50
	

	//get bread crums
	var breadCrums = [];
	$("div.goods_top > span.good_homeTitel2>a",html).each(function(i,item){
		var x = $(this);
		log.info(x.text());
		breadCrums.push(x.text());
	});
	//bread crumbs are tags

	//options 
	//option 1
	var sizes = [];
	$('.good_size > div.good_size_row > div.good_size_cell',html).each(function(i,item){
		var x = $(this);
		if(item.attribs.class.indexOf("emptySize") == -1){
			sizes.push(x.text());
		}
	});
	console.log("Sizes - ");
	console.log(sizes);
	//option 2

	var images = [];
	var alt;
	$('div.otheImg_li > img',html).each(function(i,item){
		if(item.attribs['data-src'] != null)
		{
			alt = item.attribs.alt ? item.attribs.alt : alt;
			images.push(item.attribs['data-src'].substring(3));
		}
	});
	console.log("Images - ");
	console.log(images);
	console.log("Alt text - "+alt);
	debugger
}

async function getProductPrice(productId){ 
	var options = {
		method: 'POST',
		uri:'https://www.emmacloth.com/index.php',
		form:{
			model:"product",
			action:"update_product_price",
			goods_id:productId,
			change_currency_update:1
		},
		json:true
	}
	var priceData = await rp(options);
	return priceData.goods_price.shop_price;
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

	log.info("Starting script");
	log.info("Starting DB connection");
	const databaseConnections = await DB.create("admin","spocket2018");
	databaseConnections.addProduct();
	
	/*log.info("Getting all header links");
	var headerLinks = await getAllHeadingLinks();

	for(var i = 0; i < headerLinks.length; i++){
		getAllProductsFromHeaderLink(headerLinks[i]);
	}*/

	// await getProductInfo("https://www.emmacloth.com/Knit-Design-Slip-On-Sneakers-p-530624-cat-1913.html");

})();