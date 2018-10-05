const rp = require('request-promise');
const $ = require('cheerio');
var mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const log = require('simple-node-logger').createSimpleLogger('project.log');
const DB = require('./database');
const RP = require('./rp');
const CSVWritter = require('./csvWritter');
var async = require('async');
const sleep = require('util').promisify(setTimeout)
const issues = require('simple-node-logger').createSimpleLogger('issues.log');
const headerLinkLogs = require('simple-node-logger').createSimpleLogger('headingLink.log');


var Product = require('./product');
var databaseConnections, csvWrite;
var totalNumberOfProducts = 0;
var totalNumberOfVariations = 0;

const vendor = "EmmaCloth";
async function getAllHeadingLinks(){
	var links = [];
	try{
		var html = await rp({uri: 'https://www.emmacloth.com', headers: {Connection: 'keep-alive'}}).catch(function(error){
			log.error("There is an error in calling EmmaCloth.com "+error);
		});
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

function getProductArray(productInfo){
	var products = [];
	const variantInventoryQty = 100;
	//variables to be computed
	var firstVariantSKU;
	const {productHandel, productTitle, variantPrice, body, productType, option1Name, option1Values, imgAlt, migratedFrom} = productInfo;
	if(productHandel == null || productHandel == ""){
		debugger
	}
	const imgSrcArr = productInfo.imgSrc ? productInfo.imgSrc : [];
	const productTags = productInfo.productTags;
	var firstImage = imgSrcArr[0] ? imgSrcArr[0] : null;
	var firstOption = option1Values[0] ? option1Values[0] : null;
	firstVariantSKU = productHandel+"-"+firstOption;
	//push the first one
	products.push(
		new Product({
			handel:productHandel, 
			title:productTitle, 
			body,
			migratedFrom:migratedFrom,
			vendor:vendor,
			type:productType,
			tags:productTags,
			option1Name, 
			option1Value:firstOption,
			variantSKU:firstVariantSKU,
			variantInventoryQty:100,
			variantPrice,
			imgAlt,
			migratedFrom,
			imgSrc:firstImage,
			imgPos:0
		}));


	var largerValue = productInfo.imgSrc.length >= productInfo.option1Values.length ? productInfo.imgSrc.length : productInfo.option1Values.length;
	for(var i = 1; i < largerValue; i++){
		var option1Value = option1Values[i] ? option1Values[i] : '';
		var imgSrc = imgSrcArr[i] ? imgSrcArr[i] : '';
		var imgPos = imgSrc ? i : '';
		var variantSKU = option1Value ? productHandel+"-"+option1Values[i]:'';
		var tempProduct = new Product({
			handel:productHandel, 
			imgSrc,
			imgPos,
			option1Name,
			variantSKU,
			option1Value
		});
		products.push(tempProduct);
	}
	return products;
}

async function getProductInfo(productUrl, otherOptionsVisisted=false){
	console.log("------------------------PRODUCT START---------------------------------------");
	console.log("PRODUCT: Getting product info by url:"+productUrl);
	var html = await RP.rp({uri: productUrl, headers: {Connection: 'keep-alive'}});
	var productId = productUrl.match("-p-(.*)-cat")[1];
	var productData = {
		productHandel:"", 
		productTitle:"",
		variantPrice:"", 
		body:"",
		productType:"",
		productTags:[],
		option1Name:"",
		option1Values:[],
		imgSrc:[],
		imgAlt:"",
		migratedFrom:""
	};

	productData.productHandel = $("#productCodeSpan",html).text();
	productData.productTitle = $('.good_descright > h1',html).text();
	productData.variantPrice = await getProductPrice(productId);
	productData.migratedFrom = productUrl.match('(.*).com/(.*).html')[2];
	productData.body = $("#goods_description_top > .goods_description > .goods_description_con > .ItemSpecificationCenter",html).html();
	
	

	//tags and types
	$("div.goods_top > span.good_homeTitel2>a",html).each(function(i,item){
		var x = $(this);
		//PS - This piece of code sucks I know
		if(i == 0){
			productData.productType = x.text();
		}else if(i == 1){
			productData.productType = productData.productType + " "+x.text()
		}
		productData.productTags.push(x.text());
	});
	
	
	
	//options 
	productData.option1Name = "size";
	//option 1
	$('.good_size > div.good_size_row > div.good_size_cell',html).each(function(i,item){
		var x = $(this);
		if(item.attribs.class.indexOf("emptySize") == -1){
			productData.option1Values.push(x.text());
		}
	});
	
	//option 2
	
	$('div.otheImg_li > img',html).each(function(i,item){
		if(item.attribs['data-src'] != null)
		{
			productData.imgAlt = item.attribs.alt ? item.attribs.alt : productData.imgAlt;
			productData.imgSrc.push(item.attribs['data-src'].substring(3));
		}
	});
	
	var ProductsArr = getProductArray(productData);
	console.log("There are "+ProductsArr.length + " variations of the product");
	for(const product of ProductsArr){
		console.log("Adding product to DB"+product.variantSKU);

		var added = await databaseConnections.addProduct(product).catch((error)=>{
			console.log("Error adding the product "+product.variantSKU);
		});
		if(added == false){
			break;
		}
		console.log("Finished Adding the product "+product.variantSKU);
	}

	//insert into csv WE DO NOT NEED THI
	/*await csvWrite.writeRecords(ProductsArr).catch((error)=>{
		log.error("There was an error inserting into csv."+error);
	});*/
	console.log("------------------------PRODUCT END-----------------------------------------\n\n");
	//Only look at different colours if other options have not been vetted
	if(!otherOptionsVisisted){
		var otherOptionLinks = []; 
		$('#_related_goods > span',html).each(async function(i, item){
			if(item.attribs.class != "_current"){
				var html = $(this);
				html = $('a',html.html());
				var link = "https://www.emmacloth.com"+ html[0].attribs.href;
				otherOptionLinks.push(link);
			}})

			for(const otherOptionLink of otherOptionLinks){
				await getProductInfo(otherOptionLink, true);
			}
	}
}

async function getProductPrice(productId, times=1){ 
	var options = {
		method: 'POST',
		uri:'https://www.emmacloth.com/index.php',
		form:{
			model:"product",
			action:"update_product_price",
			goods_id:productId,
			change_currency_update:1
		},
		headers: {Connection: 'keep-alive'},
		json:true
	}
	var priceData = await RP.rp(options);
	if(priceData == ''){
		issues.error("Could not get price for "+productId);
	}
	console.log("Got the price of the product "+productId);
	return priceData != '' ? priceData.goods_price.shop_price : '';
	
}

async function getAllProductsFromHeaderLink(headerLink){
	headerLinkLogs.log("Scraping:"+(headerLink));
	console.log("Getting products from url:"+headerLink);
	var nextLink;
	try{
	var html = await RP.rp({uri: headerLink, headers: {Connection: 'keep-alive'}});
	var numOfItems = 0;
	//Get links for each of the products
	var productLinks = [];
	$('#productsContent1_goods > div > div.goods_mz > a',html).each(async function(i,item){
		var x = $(this);
		var prodcutLink = "https://www.emmacloth.com"+x[0].attribs.href;
		productLinks.push(prodcutLink);
	});
	for (const productLink of productLinks ){
		await getProductInfo(productLink);
		totalNumberOfProducts++;
	}

	//go to the next page TODO
	nextLink = $('#box-pagelist > div > div > a:contains(\'Next\')',html);
	if(nextLink.length != 0){
		nextLink = nextLink[0].attribs.href;
	}else{
		nextLink = null;
	}
	}catch(error){
		log.error(error + " for page "+headerLink);
		throw error;
	}
	//TODO: make sure next is working
	if(nextLink != null ){
		if(nextLink.charAt(0) == "/"){
			console.log("Had to append the domain to nextLink. "+nextLink)
			nextLink = 'https://www.emmacloth.com'+nextLink;
		}
		await getAllProductsFromHeaderLink(nextLink);
	}
}



(async function(){
	try{
		console.log("---------------------------SCRIPT HAS STARTED---------------------------");
		console.log("Setting up DB connection");
		databaseConnections = await DB.create("admin","admin");
		console.log("Setting up CSV");
		csvWrite = await CSVWritter.setUp();
		console.log("Getting all header links");
		var headerLinks = await getAllHeadingLinks();
		//TEMP to run it faster
		headerLinks = headerLinks.reverse();
		var headerLinksLenght = headerLinks.length;
		headerLinks = headerLinks.slice(headerLinksLenght/2);
		//REMOVE IT LATER ON
		headerLinkLogs.log("____________________HEADER LINKS_______________")
		for(const headerLink of headerLinks){
			headerLinkLogs.log(headerLink);
		}
		headerLinkLogs.log("____________________HEADER VISITED_______________")

		for (const headerLink of headerLinks){
			console.log("Getting header link info "+headerLink)
			await getAllProductsFromHeaderLink(headerLink);
			console.log("Got all the info from the header")
		}
	
		console.log("---------------------------SCRIPT HAS ENDED---------------------------");
		console.log("there are a total of "+totalNumberOfProducts+ " in emma store");
	}catch(error){
		console.log("---------------------------SCRIPT HAS ENDED DUE TO ERROR---------------------------");
		log.error("Error stack: "+error);
	}
	console.log("Totalnumber of products scanned "+totalNumberOfProducts);

})();