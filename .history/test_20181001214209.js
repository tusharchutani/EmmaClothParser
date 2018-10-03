
        var goods_id = 530624;
		function setCookie_pre(name, value, expires) {
			var expdate = new Date();   //
			expdate.setTime(expdate.getTime() + 1000*expires); 
			document.cookie = name+"="+escape(value)+";expires="+expdate.toGMTString()+";path=/";
		} 
		var country_pre_sale =  getCookie("country_pre_sale");
		if(country_pre_sale != 0){
			if(country_pre_sale == 1){
				change_picture();	
			}else{
				var sysLanguage=navigator.systemLanguage?navigator.systemLanguage:navigator.language;
				if(navigator.language){
					var language = navigator.language;
				}else{
					var language = navigator.browserLanguage;
				}
				if(language.indexOf('zh') > -1 || sysLanguage.indexOf('zh') > -1){
					setCookie_pre('country_pre_sale',1,60*60*24*365);
					var need_change = 1;
					change_picture();
				}else{
					if("undefined" == typeof (remote_ip_info)){
						remote_ip_info='';
					}
					if(remote_ip_info.country == "中国"){
						setCookie_pre('country_pre_sale',1,60*60*24*365);
						change_picture();
					}else{
						setCookie_pre('country_pre_sale',0,60*60*24*365);
					}
				}
			}
		}
        data_src_replace("#original_img");
        data_src_replace("#link_image");
        data_src_replace("#sphoto"+goods_id);
        $.each(other_image,function(key,value){	
            data_src_replace("#original_img_"+value);
        })
        var original_href = $("#link_url").attr('href-src');
        $("#link_url").attr('href',original_href);
        function data_src_replace(id){
            if (!$(id).attr('src')) {
            var original_url = $(id).attr('data-src');
            $(id).attr('src',original_url);
            }
        }
		function change_picture(){                                
                                             	
		}
		function change_url(id,attr_name){
			var goods_img = $(id).attr(attr_name);
			var goods_img_extension =GetFileExt(goods_img);
			var goods_img_name = GetFileNameNoExt(goods_img);
			var new_goods_img = goods_img_name+'1'+goods_img_extension;
			//$(id).attr(attr_name,new_goods_img);
		}
	    function GetFileExt(filepath) {
			if (filepath != "") {
				var pos = "." + filepath.replace(/.+\./, "");
				return pos;
			}
		}
		//取文件名不带后缀
		function GetFileNameNoExt(filepath) {
			var pos = strturn(GetFileExt(filepath));
			var file = strturn(filepath);
			var pos1 =strturn( file.replace(pos, ""));
			//alert(pos1 );
			return pos1;
		}
		//字符串逆转
		function strturn(str) {
			if (str != "") {
			var str1 = "";
			for (var i = str.length - 1; i >= 0; i--) {
				str1 += str.charAt(i);
			}
			return (str1);
			}
		}
		/*
		 *大图片预加载
		 */
		var bigimgs = new Array();
		var key = 0;
		$('.otheImg_li img').each(function(){
			if ($(this).attr('bigimg')){
			/*获取中图路径*/
				bigimgs[key] = $(this).attr('bigimg');
				key++;
			}
			if ($(this).attr('imgb')){
			/*获取大图路径*/
				bigimgs[key] = $(this).attr('imgb');
				key++;
			}
		});
		(function(bigimgs){
			var img=[];
				for(var i=2;i<bigimgs.length;i++){
					img[i] = new Image(); 
					//img[i].onload=function(){var d=new Date(); console.log(d.getTime() +": " + this.src);};
					img[i].src=bigimgs[i]; //大图路径赋值
			}		        　　
		})(bigimgs);
		/*************************************************************************/						
		$(document).ready(function(){
			if(($("#update_price_goods_id").val() > 145686 && $("#update_price_goods_id").val() < 145690) || ($("#update_price_goods_id").val() > 145690 && $("#update_price_goods_id").val() < 145694) ){
				$('#num_to_ship').html('5');
			}
		});
		function do_image_change(current, index){
			var photo=document.getElementById('photo');
			$('#magnifierImg').attr('src','');
			$('#original_img').attr('src','');
			$('#mag').css('border','0');
			var src = $(current).find("img").attr("imgb");
			var bigimgSrc = $(current).find("img").attr("bigimg");
			$('#link_url').attr('href',src);
			$('#link_image').attr('src',bigimgSrc);
			$('#original_img').attr('src',src);
			var image3=new Image();  
			image3.src=photo.getElementsByTagName('img')[1].src; 
			if(image3.width==0 && image3.height==0){
				image3.onload=function(){
					magnifier.init({ 
						cont : document.getElementById('photo'), 
						img : document.getElementById('magnifierImg'), 
						mag : document.getElementById('mag'), 
						scale : 2
						}); 
				}
			}else{
				magnifier.init({ 
					cont : document.getElementById('photo'), 
					img : document.getElementById('magnifierImg'), 
					mag : document.getElementById('mag'), 
					scale : 2
					});
			}
			$('#mag').css('border','1px solid #000');
			//滑动小图
			var left = $('.other_Imgs').position().left;
			//console.log(left);
			var total = parseInt($('.other_Imgs a').length);
			if(index >= 4){
			    $('.other_Imgs').animate({
							        'left': -(index - 4 + 1) * 105 + 'px'
			    });
			}
			if(index < 4){
                $('.other_Imgs').animate({
                   'left': 0 
                });
			}
		}
		$(document).ready(function(){
			var photo=document.getElementById('photo');
			var image1=new Image();  
			var image2=new Image();  
			image1.src=photo.getElementsByTagName('img')[0].src; 
			image2.src=photo.getElementsByTagName('img')[1].src;  
			var scales=Math.round((image1.width/image2.width)*Math.pow(10,2))/Math.pow(10,2); 
			/*
			 * 向左切图
			 */
			$(".prev").click(function() {
				var total_num = parseInt($('.other_Imgs a').length);
				var num = parseInt($(".prev").attr('num'));
				if(num==0){
					currency_num = total_num-1;
				}else{
					currency_num = num-1;
				}
				$(".prev").attr('num',currency_num);
				$(".otheImgyy").removeClass("otheImgyy");
				var current = $('.other_Imgs').find(".otheImg_li").eq(currency_num);
				$(current).addClass("otheImgyy");
				do_image_change(current, currency_num);
			});
			/*
			 * 向右切图
			 */
			$(".next").click(function() {
				var total_num = parseInt($('.other_Imgs a').length);
				var num = parseInt($(".prev").attr('num'));
				if(num+1==total_num){
					currency_num = 0;
				}else{
					currency_num = num+1;
				}
				$(".prev").attr('num',currency_num);
				$(".otheImgyy").removeClass("otheImgyy");
				var current = $('.other_Imgs').find(".otheImg_li").eq(currency_num);
				$(current).addClass("otheImgyy");
				do_image_change(current, currency_num);
			});
			if(image2.width==0 && image2.height==0){
				image2.onload=function(){
					$("#Browser").css("display","block");
					$("#mag").css("display","block");
					magnifier.init({ 
						cont : document.getElementById('photo'), 
						img : document.getElementById('magnifierImg'), 
						mag : document.getElementById('mag'), 
						scale : 2
						}); 
				}
			}else{
				$("#Browser").css("display","block");
				$("#mag").css("display","block");
				magnifier.init({ 
					cont : document.getElementById('photo'), 
					img : document.getElementById('magnifierImg'), 
					mag : document.getElementById('mag'), 
					scale : 2
					});
			}
			$(".other_Imgs a").click(function() {
				var total_num = parseInt($('.other_Imgs a').length);
				for(var i=0; i<total_num; i++){
					if($(".other_Imgs a").eq(i).find("img").attr("imgb") == $(this).find("img").attr("imgb")){
						$(".prev").attr('num',i);
						break;
					}
				}
				$(".otheImgyy").removeClass("otheImgyy");
				$(this).find(".otheImg_li").addClass("otheImgyy");
				do_image_change(this);
			});	
		});	
	var setAmount={
		min:1,
		max:999,
		reg:function(x){
			return new RegExp("^[1-9]\\d*$").test(x);
		},
		amount:function(obj,mode){
			var x=$(obj).val();
			if (this.reg(x)){
				if (mode){
					x++;
				}else{
					x--;
				}
			}else{
				alert("Please enter a correct amount!");
				$(obj).val(1);
				$(obj).focus();
				this.update(obj,1);
			}
			return x;						
		},
		reduce:function(obj,stats){
			var x=this.amount(obj,false);
			if (x>=this.min){
				
				$(obj).val(x);
				if(stats == 1){
					this.goods_meal_update(obj,x);
				}else{
					this.update(obj,x);
				}
				/*alert($(obj).val());*/
				
				
			}else{
				alert("Please be noted the minium number is "+this.min);
				$(obj).val(1);
				$(obj).focus();
			}
		},
		add:function(obj,stats){
			var x=this.amount(obj,true);
			if (x<=this.max){
				$(obj).val(x);
				if(stats == 1){
					this.goods_meal_update(obj,x);
				}else{
					this.update(obj,x);
				}
				
			}else{
				alert("Please be noted the maxium number is "+this.max);
				$(obj).val(999);
				$(obj).focus();
			}
		},
		modify:function(obj,stats){
			var x=$(obj).val();
			if (x<this.min||x>this.max||!this.reg(x)){
				alert("Please enter a correct amount!");
				$(obj).val(1);
				$(obj).focus();
				if(window.getSelection) {// all browsers, except IE before version 9 
					window.getSelection().removeAllRanges();
				}else{
					if(document.selection.createRange){//for ie before version 9
						
					}
				};
				if(stats == 1){
					this.goods_meal_update(obj,1);
				}else{
					this.update(obj,1);
				}
			}else{
				if(stats == 1){
					this.goods_meal_update(obj,x);
				}else{
					this.update(obj,x);
				}
			}
		},
		update:function(obj,x){
			obj=obj.replace('#','');
			if($(".goodPrice_good #shop_price_u span").html()){
				var shop_price_init = delHtmlTag($(".goodPrice_good #shop_price_u span").html());
				//var value1 = shop_price.replace(/([^0-9]+)([\.0-9]+)/,"$1");
				var shop_price = Number(shop_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$2"));
				if(isNaN(shop_price)){
                    var value1=shop_price_init.replace(/([\.0-9]+)([^0-9]+)/,"$2");
                    var shop_price = Number(shop_price_init.replace(/([\.0-9]+)([^0-9]+)/,"$1"));
                }else{
                    var value1=shop_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$1");
                    var shop_price = Number(shop_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$2"));
                }
			}else{
			 	alert("Page exception.Click OK, and refresh the page.");
				location.reload();
				return false;
			}
			
			if($(".goodPrice_good #special_price_u span").html()){
				var special_price_init = delHtmlTag($(".goodPrice_good #special_price_u span").html());
				//var value2=special_price.replace(/([^0-9]+)([\.0-9]+)/,"$1");
				var special_price = Number(special_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$2"));
				if(isNaN(special_price)){
                    var value2=special_price_init.replace(/([\.0-9]+)([^0-9]+)/,"$2");
                    var special_price = Number(special_price_init.replace(/([\.0-9]+)([^0-9]+)/,"$1"));
                }else{
                    var value2=special_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$1");
                    var special_price = Number(special_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$2"));
                }
			}else{
			 	var special_price ="";
				var value2=value1;
			}
			
			if($(".goodPrice_good #member_price_u span").html()){
				var member_price_init = delHtmlTag($(".goodPrice_good #member_price_u span").html());
				//var value3=member_price.replace(/([^0-9]+)([\.0-9]+)/,"$1");
				var member_price = Number(member_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$2"));
				if(isNaN(member_price)){
                    var value3=member_price_init.replace(/([\.0-9]+)([^0-9]+)/,"$2");
                    var member_price = Number(member_price_init.replace(/([\.0-9]+)([^0-9]+)/,"$1"));
                }else{
                    var value3=member_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$1");
                    var member_price = Number(member_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$2"));
                }
			}else{
			 	var member_price ="";
				var value3=value1;
			}
			
			if($(".goodPrice_good #share_price_u span").html()){
				var share_price_init = delHtmlTag($(".goodPrice_good #share_price_u span").html());
				//var value4=share_price.replace(/([^0-9]+)([\.0-9]+)/,"$1");
				var share_price = Number(share_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$2"));
				if(isNaN(share_price)){
                    var value4=share_price_init.replace(/([\.0-9]+)([^0-9]+)/,"$2");
                    var share_price = Number(share_price_init.replace(/([\.0-9]+)([^0-9]+)/,"$1"));
                }else{
                    var value4=share_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$1");
                    var share_price = Number(share_price_init.replace(/([^0-9]+)([\.0-9]+)/,"$2"));
                }
			}else{
			 	var share_price ="";
				var value4=value1;
			}
			
			var symbol_left ="";
			
			if(value1!=value2||value1!=value3||value2!=value3){
				alert("Page exception.Click OK, and refresh the page.");
				location.reload();
				return false;
			}else{
				symbol_left =value1;
			}
			
					    
			if(share_price!=""){
				var unit_price=share_price;
				
				var shop_price22_init = Number($(".goodPrice_good #share_price_u").attr("price").replace(/([^0-9]+)([\.0-9]+)/,"$2"));
				if(isNaN(shop_price22_init)){
                    var shop_price22 = Number($(".goodPrice_good #share_price_u").attr("price").replace(/([\.0-9]+)([^0-9]+)/,"$1"));
                }else{
                    var shop_price22 = Number($(".goodPrice_good #share_price_u").attr("price").replace(/([^0-9]+)([\.0-9]+)/,"$2"));
                }
			}else if(member_price!=""){
				var unit_price=member_price;
				
				var shop_price22_init = Number($(".goodPrice_good #member_price_u").attr("price").replace(/([^0-9]+)([\.0-9]+)/,"$2"));
				if(isNaN(shop_price22_init)){
                    var shop_price22 = Number($(".goodPrice_good #member_price_u").attr("price").replace(/([\.0-9]+)([^0-9]+)/,"$1"));
                }else{
                    var shop_price22 = Number($(".goodPrice_good #member_price_u").attr("price").replace(/([^0-9]+)([\.0-9]+)/,"$2"));
                }
			}else if(special_price!=""){
				var unit_price=special_price;
				
				var shop_price22_init = Number($(".goodPrice_good #special_price_u").attr("price").replace(/([^0-9]+)([\.0-9]+)/,"$2"));
				if(isNaN(shop_price22_init)){
                    var shop_price22 = Number($(".goodPrice_good #special_price_u").attr("price").replace(/([\.0-9]+)([^0-9]+)/,"$1"));
                }else{
                    var shop_price22 = Number($(".goodPrice_good #special_price_u").attr("price").replace(/([^0-9]+)([\.0-9]+)/,"$2"));
                }
			}else{
				var unit_price=shop_price;
				
				var shop_price22_init = Number($(".goodPrice_good #shop_price_u").attr("price").replace(/([^0-9]+)([\.0-9]+)/,"$2"));
				if(isNaN(shop_price22_init)){
                    var shop_price22 = Number($(".goodPrice_good #shop_price_u").attr("price").replace(/([\.0-9]+)([^0-9]+)/,"$1"));
                }else{
                    var shop_price22 = Number($(".goodPrice_good #shop_price_u").attr("price").replace(/([^0-9]+)([\.0-9]+)/,"$2"));
                }
			}
			
			//$("#totalyy").html(symbol_left+(unit_price*x).toFixed(2));
			if(symbol_left !== '€'){
                $("#totalyy").html(symbol_left+(unit_price*x).toFixed(2));
            }else{
                $("#totalyy").html((unit_price*x).toFixed(2) + symbol_left);
                
            }
			/*Earn points*/
			var get_point = parseFloat($("#get_point").val());
			if(get_point!=0){
				var point_result = parseInt(shop_price22*x/get_point);
				
				$("#j2t-pts").html(point_result);
			}else{
				$("#reward-points-info").html("");
			}
			/*Earn points*/
		}
	};
	