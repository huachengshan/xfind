
$(function(){
	var evaluation = {
		init:function(){
			this.loadData();
			this.slide();
		},
		loadData:function(){
			if(positions && positions.length>0) {
				for(var i=0;i<positions.length;i++) {
					var text = positions[i].name;
					var code = positions[i].code;
					var html = "<div class=\"selected\" code=\""+code+"\">"+
	                  "<span><font>"+text+"</font>&nbsp;<img src=\"images/close.png\" class=\"my-close\"></span>"+
	               	  "</div>";
	               	  $(".select-options").append(html);
					
				}
				$("#num").html(positions.length);
			}
			//执行ajax请求
			var url = serverUrl + "/adminPosition/one/getAllData/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data.list;
					if(data.length!=0) {
						var html = "";
						for(var i=0; i<data.length; i++) {
							var one = data[i];
							html += "<div class=\"l-item\" code=\""+one.oneCode+"\">"+one.oneName+"</div>";
						}
						$("#positionContainer .left-wrap").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		slide:function(){
			$(document).on("click", "#positionContainer .l-item", function(){
				var code = $(this).attr("code");
				$("#positionContainer .right-wrap").hide();
				$("#positionContainer .middle-wrap").hide();
				$("#positionContainer .l-item").removeClass("active");
				$(this).addClass("active");
				var url = serverUrl + "/adminPosition/two/getAllData/"+code+"/1/100";
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data.list;
						if(data.length!=0) {
							var html = "";
							for(var i=0; i<data.length; i++) {
								var two = data[i];
								html += "<div class=\"m-item\" code=\""+two.twoCode+"\">"+two.twoName+"</div>";
							}
							$("#positionContainer .middle-wrap").html(html);
							$("#positionContainer .middle-wrap").slideDown();
						}
					} else {
						alert(result.message);
					}
					
				});
			});

			$(document).on("click","#positionContainer .m-item", function(){
				var code = $(this).attr("code");
				$("#positionContainer .right-wrap").hide();
				$("#positionContainer .m-item").removeClass("active");
				$(this).addClass("active");
				var html = "";
				var url = serverUrl + "/adminPosition/getAllData/"+code+"/1/100";
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data.list;
						console.log(data);
						if(data.length!=0) {
							var html = "";
							for(var i=0; i<data.length; i++) {
								var three = data[i];
								var active = "";
								if(positions && positions.length>0) {
									for(var j=0;j<positions.length;j++) {
										var code = positions[j].code;
										if(code==three.positionCode) {
											active = "active";
											break;
										}
									}
									$("#num").html(positions.length);
								}
								html += "<div class=\"r-item "+active+"\" code=\""+three.positionCode+"\">"+three.positionName+"</div>";
							}
							$("#positionContainer .right-wrap").html(html);
							$("#positionContainer .right-wrap").slideDown();
						}
					} else {
						alert(result.message);
					}
					
				});
			});

			$(document).on("click","#positionContainer .r-item", function(){
				var num = $("#num").html();
				var code = $(this).attr("code");
				if($(this).hasClass("active")) {
					$(this).removeClass("active");
					$("#num").html(parseInt(num) - 1);
					$(".select-options .selected[code='"+code+"']").remove();
				} else if(num<3) {
					var text = $(this).html();
					$(this).addClass("active");
					var html = "<div class=\"selected\" code=\""+code+"\">"+
	                  "<span><font>"+text+"</font>&nbsp;<img src=\"images/close.png\" class=\"my-close\"></span>"+
	               	  "</div>";
					$(".select-options").append(html);
					$("#num").html(parseInt(num) + 1);
				} else {
					alert("最多可选择三项");
				}

				// var position_code = $(this).attr("code");
				// var position_name = $(this).html();
				// $("#positionContainer .r-item").removeClass("active");
				// $(this).addClass("active");
				// $("#position_code").val(position_code);
				// $("#position_name").html(position_name);
			});

			$("#position-sure").on("click", function(){
				var position_name = "";
				var position_code = "";
				$(".select-options .selected").each(function(){
					var code = $(this).attr("code");
					var name = $(this).find("font").html();
					position_name += name + ",";
					position_code += code + ",";
				});
				$("#position_name").html(position_name.substring(0, position_name.length-1));
				$("#position_code").val(position_code.substring(0, position_code.length-1));
				if(position_code=='') {
					alert("请选择一个岗位");
				} else {
					$("#mainPage").show();
					$("#page3").hide();
				}
			});

			$(document).on("click",".select-options .selected",function(e){
				var code = $(this).attr("code");
		        $(this).remove();
				var num = $("#num").html();
				$("#num").html(parseInt(num) - 1);
				$("#positionContainer .right-wrap .r-item[code='"+code+"']").removeClass("active");
		    });
		}
	}
	evaluation.init();
});

