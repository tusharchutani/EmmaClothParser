const rp = require('request-promise');
const $ = require('cheerio');
var mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const log = require('simple-node-logger').createSimpleLogger('project.log');
const DB = require('./database');
const vender = "EmmaCloth";
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

	var productHandel, productTitle,variantPrice, body, productType, option1Name, option1Value, option2Name, option2Value, variantSKU, variantInventorySKU, imgSrc, imgPos, imgAlt, migratedFrom;
	var productTags = [];
	var imgSrc = [];
	productHandel = $("#productCodeSpan",html).text();
	productTitle = $('.good_descright > h1',html).text();
	variantPrice = await getProductPrice(productId);
	body = $("#goods_description_top > .goods_description > .goods_description_con > .ItemSpecificationCenter",html).html();
	
	

	//get bread crums
	var breadCrums = [];
	$("div.goods_top > span.good_homeTitel2>a",html).each(function(i,item){
		var x = $(this);
		log.info(x.text());
		if(i == 0){
			productType = x.text();
		}else{
			productType = productType + ","+x.text()
		}
		breadCrums.push(x.text());
	});
	debugger
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

	var Products = [];
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
	//Get links for each of the products
	$('#productsContent1_goods > div > div.goods_mz > a',html).each(function(i,item){
		var x = $(this);
		log.info(x.text());
		var produtLink = "https://www.emmacloth.com"+x[0].attribs.href;
		// await getProductInfo(produtLink);
		numOfItems++;
	});
	//go to the next page TODO
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
	const databaseConnections = await DB.create("admin","admin");
	
	log.info("Getting all header links");
	var headerLinks = await getAllHeadingLinks();
	getAllProductsFromHeaderLink(headerLinks[0]);

	for(var i = 0; i < headerLinks.length; i++){
		getAllProductsFromHeaderLink(headerLinks[i]);
	}*/

	await getProductInfo("https://www.emmacloth.com/Knit-Design-Slip-On-Sneakers-p-530624-cat-1913.html");

})();