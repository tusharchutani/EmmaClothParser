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

var Product = require('./product');
var databaseConnections, csvWrite;
var totalNumberOfProducts = 0;

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

async function getAllProductNameAndUrl(url){
	console.log("Getting itesmf for "+url);
	try{
	var html = await RP.rp({uri: url, headers: {Connection: 'keep-alive'}}).catch(function(error){
		log.error("There is an error in calling getAllProductNameAndUrl info "+error); 
	});
	var numOfItems = 0;
	$('#productsContent1_goods > div > div.goods_mz > a',html).each(function(i,item){
		var x = $(this);
		// console.log(x.text());
		numOfItems++;
		totalNumberOfProducts++
	});

		
	}catch(error){
		console.log("Error");
		throw error;
	}
	console.log("There are a total of "+numOfItems+" on this page");
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
	console.log("Getting product info by url:"+productUrl);
	var html = await RP.rp({uri: productUrl, headers: {Connection: 'keep-alive'}});
	 /*rp({uri: productUrl, headers: {Connection: 'keep-alive'}}).catch(function(error){
		console.log("There is an error in calling getProductInfo "+error);
	});*/
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
	await sleep(1500);
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
	await async.each(ProductsArr, async (product)=>{
		console.log("Adding product to DB"+product.variantSKU + " link:"+productUrl);
		var res = await databaseConnections.addProduct(product);
		console.log("Finished Adding the product "+product.variantSKU + " link:"+productUrl);
		
	});
	/*for ( const  product of ProductsArr){
		console.log("Adding product to DB"+product.variantSKU + " link:"+productUrl);
		var res = await databaseConnections.addProduct(product);

		if(!res){
			console.log("The product was already in the DB");
		}else{
			console.log("The product was inserted into the DB");
		}		
	}*/
	
	console.log("Inserting records into csv");
	//insert into csv
	/*await csvWrite.writeRecords(ProductsArr).catch((error)=>{
		log.error("There was an error inserting into csv."+error);
	});*/

	//Only look at different colours if other options have not been vetted
	if(!otherOptionsVisisted){
		
		$('#_related_goods > span',html).each(async function(i, item){
			if(item.attribs.class != "_current"){
				var html = $(this);
				html = $('a',html.html());
				var link = "https://www.emmacloth.com"+ html[0].attribs.href;
				await sleep(1500);
				await getProductInfo(link, true);
			}})
	}
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
		headers: {Connection: 'keep-alive'},
		json:true
	}
	var priceData = await RP.rp(options);
	if(priceData == null || priceData.goods_price == null || priceData.goods_price.shop_price == null){
		console.log("Couldn't get the price of the product. Retrying now "+productId);
		return getProductPrice(productId); 
	}else{
		console.log("Got the price of the product "+productId);
		return priceData.goods_price.shop_price;
	}
}

async function getAllProductsFromHeaderLink(headerLink){
	console.log("Getting products from url:"+headerLink);
	var nextLink;
	try{
	var html = await RP.rp({uri: headerLink, headers: {Connection: 'keep-alive'}});
	var numOfItems = 0;
	//Get links for each of the products
	$('#productsContent1_goods > div > div.goods_mz > a',html).each(async function(i,item){
		var x = $(this);
		console.log(x.text());
		var produtLink = "https://www.emmacloth.com"+x[0].attribs.href;
		await getProductInfo(produtLink);
		numOfItems++;
	});
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
		console.log("Going to the next page of " + headerLink)
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
		

		await async.each(headerLinks, async (headerLink)=>{
			console.log("Getting header link info "+headerLink)
			await getAllProductsFromHeaderLink(headerLink);
			console.log("Got all the info from the header")
		});
		for(var i = 0; i < headerLinks.length; i++){
			await getAllProductsFromHeaderLink(headerLinks[i]);
		}
	
		console.log("---------------------------SCRIPT HAS ENDED---------------------------");
		console.log("there are a total of "+totalNumberOfProducts+ " in emma store");
	}catch(error){
		console.log("---------------------------SCRIPT HAS ENDED DUE TO ERROR---------------------------");
		log.error("Error stack: "+error);

	}

})();