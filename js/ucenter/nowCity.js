
$(function(){
	var basicInfo;
	var nowCity = {
		init:function(){
			this.loadData();
			this.slide();
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/place/provinces/getAllData/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data.list;
					if(data.length!=0) {
						var html = "";
						for(var i=0; i<data.length; i++) {
							var one = data[i];
							html += "<div class=\"l-item\" code=\""+one.provincesCode+"\">"+one.provincesName+"</div>";
						}
						$(".left-wrap").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		slide:function(){
			$(document).on("click", ".l-item", function(){
				var code = $(this).attr("code");
				$(".right-wrap").hide();
				$(".middle-wrap").hide();
				$(".l-item").removeClass("active");
				$(this).addClass("active");
				var url = serverUrl + "/place/city/getAllData/"+code+"/1/100";
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data.list;
						if(data.length!=0) {
							var html = "";
							for(var i=0; i<data.length; i++) {
								var two = data[i];
								html += "<div class=\"m-item\" code=\""+two.cityCode+"\">"+two.cityName+"</div>";
							}
							$(".middle-wrap").html(html);
							$(".middle-wrap").slideDown();
						}
					} else {
						alert(result.message);
					}
					
				});
			});

			$(document).on("click",".m-item", function(){
				var code = $(this).attr("code");
				$(".right-wrap").hide();
				$(".m-item").removeClass("active");
				$(this).addClass("active");
				var html = "";
				var url = serverUrl + "/place/area/getAllData/"+code+"/1/100";
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data.list;
						if(data.length!=0) {
							var html = "";
							for(var i=0; i<data.length; i++) {
								var three = data[i];
								html += "<div class=\"r-item\" code=\""+three.areaCode+"\">"+three.areaName+"</div>";
							}
							$(".right-wrap").html(html);
							$(".right-wrap").slideDown();
						}
					} else {
						alert(result.message);
					}
					
				});
			});

			$(document).on("click",".r-item", function(){
				$(".r-item").removeClass("active");
				$(this).addClass("active");
			});

			$("#nowcity-sure").on("click", function(){
				var nowProvince_code = $(".l-item.active").attr("code");
				var nowProvince_name = $(".l-item.active").html();
				var nowCity_code = $(".m-item.active").attr("code");
				var nowCity_name = $(".m-item.active").html();
				var nowArea_code = $(".r-item.active").attr("code");
				var nowArea_name = $(".r-item.active").html();
				if(!nowArea_code || nowArea_code=='') {
					alert("请选择一个区域");
				} else {
					$("#nowProvince_code").val(nowProvince_code);
					$("#nowProvince_name").val(nowProvince_name);
					$("#nowCity_code").val(nowCity_code);
					$("#nowCity_name").val(nowCity_name);
					$("#nowArea_code").val(nowArea_code);
					$("#nowArea_name").html(nowArea_name);
					$("#mainPage").show();
					$("#cityPage").hide();
				}
			});
		}
	}
	nowCity.init();
});

