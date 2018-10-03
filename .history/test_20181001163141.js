
			
			function goods_meal_attr(){/*获取套餐的属性*/
				var type = $('#goods_meal_type').val();/*套餐类型*/
				var goods_meal_id = $('#goods_meal_id').val();
				var goods_id = '';/*套餐的产品,用逗号连接goods_id*/
				var arr_goods_id = '' ;/*goods_id数组*/
				var count = 0;/*不捆绑 产品必须勾一个*/
				var goods_id_check = '';/*选中产品*/
				arr_goods_id = document.getElementsByName('goods_meal_goods_id[]');
				if(type == 3 || type == 4 || type == 5){/*捆绑*/
					for(var i = 0; i < arr_goods_id.length; i++){
						if(arr_goods_id[i].value){
							goods_id += arr_goods_id[i].value+',';
						}
					}
					goods_id_check = goods_id;
				}else if(type == 1 || type == 2 || type == 6){/*不捆绑*/
					for(var i = 0; i < arr_goods_id.length; i++){
						if(arr_goods_id[i].value){
							goods_id += arr_goods_id[i].value+',';
						}
						
						if($('#goods_meal_'+arr_goods_id[i].value).is(':checked')){
							if(arr_goods_id[i].value){
								goods_id_check += arr_goods_id[i].value+',';
								count += 1;
							}
						}
					}
					if(count < 2){
						document.getElementById('info_goods_meal').innerHTML = '<span>Please check the package</span>';
						$('#info_goods_meal').show();
						/*alert(count + "iii" +arr_goods_id.length + "iii" +arr_goods_id[1].value);*/
						return false;
					}
				}else{
					return false;
				}
				if(goods_id){
					goods_id = goods_id.substr(0,goods_id.length-1);
				}else{
					return false;
				}
				$('.goods_attr').hide();
				
				/*alert(goods_id);return false;*/
				$.ajax({
					type:'POST',
					dataType:'json',
					data:'type=attr_goods_meal&goods_id='+goods_id+'&goods_meal_id='+goods_meal_id,
					url:'https://www.emmacloth.com/do_ajax.php',
					fail:function(){
						/*alert('fail');*/
					},
					error:function(){
						/*alert('error');*/
					},
					success:function(json){
						$('#goods_meal_commit').attr('ids','');/*有尺码的产品*/
						$('#goods_meal_commit').attr('goods_ids','');/*加入套餐的产品*/
						$('#goods_meal_commit').css('display','none');
						$('#info_goods_meal').html('');
						$('#info_goods_meal').css('display','none');
						if(json.content != 'false'){
							var temp_attr2 = '';
							var temp_goods = '';
							for(var i in json){
								document.getElementById('goods_attr_'+json[i].goods_id).innerHTML = (json[i].content);
								/*$('#goods_attr_'+json[i].goods_id).show();*/
								var script = document.createElement('script');
								script.type = 'text/javascript';
								script.text = json[i].script;
								document.getElementById('goods_attr_'+json[i].goods_id).appendChild(script);
								if(json[i].temp_attr2 == 1){
									temp_attr2 += json[i].goods_id+',';
								}
								temp_goods += json[i].goods_id+',';
							}
							
							if(goods_id_check){
								goods_id_check = goods_id_check.substr(0,goods_id_check.length-1);
								goods_id_check = goods_id_check.split(',');
								for(var i = 0; i < goods_id_check.length; i++ ){
									$('#goods_attr_'+goods_id_check[i]).show();
								}
							}
							temp_attr2 = temp_attr2.substr(0,temp_attr2.length-1);
							temp_goods = temp_goods.substr(0,temp_goods.length-1);
							$('#goods_meal_commit').attr('ids',temp_attr2);
							$('#goods_meal_commit').attr('goods_ids',temp_goods);
							if(temp_attr2 == ''){
								sub_attr3();
							}else{
								if($('#goods_meal_commit').css('display') == 'none'){
									$('#goods_meal_commit').css('display','');
								}
							}
						}else{
							document.getElementById('info_goods_meal').innerHTML = '<span>The package has expired</span>';
							$('#info_goods_meal').show();
						}
					}
				});
			}
			
			function sub_attr3(){/*插到shopCart*/
				var type = $('#goods_meal_type').val();/*套餐类型*/
                              
				var arr_goods_id = '';
				var count = 0;
				var goods_id = '';
				arr_goods_id = document.getElementsByName('goods_meal_goods_id[]');
				if(type == 1 || type == 2 || type == 6){/*不捆绑*/
					for(var i = 0; i < arr_goods_id.length; i++){
						if($('#goods_meal_'+arr_goods_id[i].value).is(':checked')){
							if(arr_goods_id[i].value){
								goods_id += arr_goods_id[i].value+',';
								count += 1;
							}
						}
					}
					if(count < 2){
						document.getElementById('info_goods_meal').innerHTML = '<span>Please check the package</span>';
						$('#info_goods_meal').show();
						return false;
					}
				}else if(type == 3 || type == 4 || type == 5){/*捆绑*/
					for(var i = 0; i < arr_goods_id.length; i++){
						if(arr_goods_id[i].value){
							goods_id += arr_goods_id[i].value+',';
						}
					}
				}else{
					return false;
				}
				if(goods_id){
					goods_id = goods_id.substr(0,goods_id.length-1);
				}else{
					return false;
				}
				$('#goods_meal_commit').attr('goods_ids',goods_id);
				$('#goods_meal_commit').attr('ids',goods_id);
				var ids = $('#goods_meal_commit').attr('ids');/*需要选尺码属性的产品*/
				var attr_return = true;
				if(ids){
					var goods_id = ids.split(',');
					for(var i in goods_id){
						if(typeof(window['submitshopcart_'+goods_id[i] ]) == "function"){
							attr_return = window['submitshopcart_'+goods_id[i] ]();
							if(attr_return == false){
								return false;
							}
						}
					}
				}		
				if(attr_return){
					var goods_ids = $('#goods_meal_commit').attr('goods_ids');/*套餐中的产品 */
					var goods_meal_id = $('#goods_meal_id').val();/*套餐id*/
					if(goods_ids){
						goods_ids = goods_ids.split(',');
						var attr_list = '';
						for(var i=0; i<goods_ids.length; i++){
							var attr_lists = $('#goods_attr_'+goods_ids[i]+' .attr_list').val();
							if(attr_lists){
								attr_lists = attr_lists.split('||');
								for(var j =0; j<attr_lists.length; j++){
									if($('#attr_value_list_'+goods_ids[i]+'_'+attr_lists[j]).val() != undefined){
										attr_list += '&attr_value_list_'+goods_ids[i]+'_'+attr_lists[j]+'='+$('#attr_value_list_'+goods_ids[i]+'_'+attr_lists[j]).val();
									}
								}
							}
						}
					}else{
						return false;
					}
                                       
					$.ajax({
						type:'POST',
						dataType:'json',
						data:'action=goods_meal_add&goods_id='+goods_ids+'&quantity=1'+'&goods_meal_id='+goods_meal_id+attr_list,
						url:'https://www.emmacloth.com/do_ajax.php',
						fail:function(){
							
						},
						error:function(){
							
						},
						success:function(json){
							if(json.common_cart_cnt && json.success){
								$("#attr_shopcart").html(json.content);
								$("#cart_items b").html(json.common_cart_cnt);
								$("#attr_shopcart").show();
								$('.goods_attr').hide();
								$('#goods_meal_commit').css('display','none');
								$('#info_goods_meal').css('display','none');
							}else{
								document.getElementById('info_goods_meal').innerHTML = '<span>The package has expired</span>';
								$('#info_goods_meal').show();
							}							
						}
					});
				}else{
					return false;
				}
			}
			
			function check_price(obj){
				$('#info_goods_meal').html('');
				var goods_id =  $(obj).attr('id1');
				var goods_price = 0;
				if($(obj).parent().parent().find('#special_price').attr('price')){
					goods_price = $(obj).parent().parent().find('#special_price').attr('price');
				}else if($(obj).parent().parent().find('#shop_price').attr('price')){
					goods_price = $(obj).parent().parent().find('#shop_price').attr('price');
				}
				var goods_meal_id = $('#goods_meal_id').val();
				var total_price = $('#goods_meal_total_cost').attr('price');
				var operate = '';
				if($(obj)[0].checked){
					operate = 'increase';
					if($('#goods_meal_commit').css('display') != 'none'){
						$(obj).parent().parent().find('.goods_attr').show();
					}
					
				}else{
					operate = 'decrease';
					$(obj).parent().parent().find('.goods_attr').hide();
				}
				
				var shop_price = delHtmlTag($(".goodPrice_good #shop_price_u span").html());
				var symbol_left = shop_price.replace(/([^0-9]+)([\.0-9]+)/,"$1");
				var shop_price = shop_price.replace(/([^0-9]+)([\.0-9]+)/,"$2");
				
				var no_discount = new Array();
				no_discount[0] = new Array();
				no_discount[0]['discount'] = 1;
				
				var r = /^[0-9]*[1-9][0-9]*$/;
				
				
				if(r.test(shop_price)){
					no_discount[0]['decimal_place'] = 0;
				}else{
					no_discount[0]['decimal_place'] = 2;
				}
				var original_price = 0;
				var combo_price = 0;		
				$("input[name^='goods_meal_']:checked").each(function(i){
					if($(this).parent().parent().find('.discount_price .final_price_strong').html()){
						var now_discount_price = $(this).parent().parent().find('.discount_price .final_price_strong').html();
						var now_discount_price = new Number(now_discount_price.replace(/([^0-9]+)([\.0-9]+)/,"$2"));
						if(isNaN(now_discount_price)){}else{
							combo_price = new Number(combo_price);
							combo_price = combo_price + now_discount_price;
						}
					}
					if($(this).parent().parent().find('.shop_price strike').html()){
						var now_shop_price = $(this).parent().parent().find('.shop_price strike').html();
						var now_shop_price = new Number(now_shop_price.replace(/([^0-9]+)([\.0-9]+)/,"$2"));
						if(isNaN(now_shop_price)){}else{
							original_price = new Number(original_price);
							original_price = original_price + now_shop_price;
						}
					}
				});
				original_price = js_get_price( symbol_left+original_price,2,no_discount);
				combo_price = js_get_price( symbol_left+combo_price,2,no_discount);
				$("#goods_meal_total_cost").html("<span id='spanSubTotal_' class='good_packtotal'><strike class='good_totalstrike'>"+symbol_left+original_price+"</strike></span>");
				$("#goods_meal_meal_discount").html("<span id='spanSubTotal_' class='good_packtotals'>"+symbol_left+combo_price+"</span>");
				
				combo_price = new Number(combo_price);
				original_price = new Number(original_price);
				var save_price = new Number(original_price-combo_price);
				save_price = js_get_price( symbol_left+save_price,2,no_discount);
				$("#goods_meal_meal_save").html("<span id='spanSubTotal_' class='good_packtotal'>"+symbol_left+save_price+"</span>");
			}
			
			