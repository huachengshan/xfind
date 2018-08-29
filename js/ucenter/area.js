
$(function(){
	var basicInfo;
	var evaluation = {
		init:function(){
			this.loadData();
			this.slide();
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/place/provinces/getAllData/1/100";
			utils.get(url,{}, function(result){
				if(result.code==0) {
					var data = result.data.list;
					if(data.length!=0) {
						var html = "";
						for(var i=0; i<data.length; i++) {
							var one = data[i];
							html += "<div class=\"l-item\" code=\""+one.provincesCode+"\">"+one.provincesName+"</div>";
						}
						$("#areaContainer .left-wrap").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		slide:function(){
			$(document).on("click", "#areaContainer .l-item", function(){
				var code = $(this).attr("code");
				$("#areaContainer .right-wrap").hide();
				$("#areaContainer .middle-wrap").hide();
				$("#areaContainer .l-item").removeClass("active");
				$(this).addClass("active");
				var url = serverUrl + "/place/city/getAllData/"+code+"/1/100";
				utils.get(url,{}, function(result){
					if(result.code==0) {
						var data = result.data.list;
						if(data.length!=0) {
							var html = "";
							for(var i=0; i<data.length; i++) {
								var two = data[i];
								html += "<div class=\"m-item\" code=\""+two.cityCode+"\">"+two.cityName+"</div>";
							}
							$("#areaContainer .middle-wrap").html(html);
							$("#areaContainer .middle-wrap").slideDown();
						}
					} else {
						alert(result.message);
					}
					
				});
			});

			$(document).on("click","#areaContainer .m-item", function(){
				var code = $(this).attr("code");
				$("#areaContainer .right-wrap").hide();
				$("#areaContainer .m-item").removeClass("active");
				$(this).addClass("active");
				var html = "";
				var url = serverUrl + "/place/area/getAllData/"+code+"/1/100";
				utils.get(url,{}, function(result){
					if(result.code==0) {
						var data = result.data.list;
						if(data.length!=0) {
							var html = "";
							for(var i=0; i<data.length; i++) {
								var three = data[i];
								html += "<div class=\"r-item\" code=\""+three.areaCode+"\">"+three.areaName+"</div>";
							}
							$("#areaContainer .right-wrap").html(html);
							$("#areaContainer .right-wrap").slideDown();
						}
					} else {
						alert(result.message);
					}
					
				});
			});

			$(document).on("click","#areaContainer .r-item", function(){
				$("#areaContainer .r-item").removeClass("active");
				$(this).addClass("active");
			});

			$("#area-sure").on("click", function(){
				var countyProvince_code = $("#areaContainer .l-item.active").attr("code");
				var countyProvince_name = $("#areaContainer .l-item.active").html();
				var countyCity_code = $("#areaContainer .m-item.active").attr("code");
				var countyCity_name = $("#areaContainer .m-item.active").html();
				var countyArea_code = $("#areaContainer .r-item.active").attr("code");
				var countyArea_name = $("#areaContainer .r-item.active").html();
				if(!countyArea_code || countyArea_code=='') {
					alert("请选择一个区域");
				} else {
					$("#countyProvince_code").val(countyProvince_code);
					$("#countyProvince_name").val(countyProvince_name);
					$("#countyCity_code").val(countyCity_code);
					$("#countyCity_name").val(countyCity_name);
					$("#countyArea_code").val(countyArea_code);
					$("#countyArea_name").html(countyArea_name);
					$("#mainPage").show();
					$("#areaPage").hide();
				}
			});
		}
	}
	evaluation.init();
});

