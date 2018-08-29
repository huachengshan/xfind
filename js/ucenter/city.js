var query = $.getLocationQueryData();
$(function(){
	// console.log(query);
	// var currCity = query.currCity;
	// alert(decodeURI(decodeURI(currCity)));
	var city = {
		init:function(){
			this.loadData();
			this.select();
			this.sure();
		},
		loadData:function(){
			loading.show("数据加载中");
			//执行ajax请求
			var url = serverUrl + "/place/city/getAllData/620000/1/100";
			utils.get(url,{}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("没有城市数据");
					} else {
						sort(data.list);
					}
				} else {
					alert(result.message);
				}
				
			});
			loading.hide();
		},
		select:function(){
			$(".city-item").on("click", function(){
				$(".city-item").removeClass("active");
				$(this).addClass("active");
				var city_name = $(this).html();
			});
		},
		sure:function(){
			$("#sure").on("click", function(){
				var obj = $(".city-item.active");
				var code = obj.attr("code");
				var name = obj.html();
				$("#nowCity_name").html(name);
				$("#nowCity_code").val(code);
				$("#page1").hide();
				$("#mainPage").show();
			});
		}
	}

	city.init();
	
});

function sort(list) {
	var map = {};
	for(var i=0; i<list.length; i++) {
		var city = list[i];
		var cityName = city.cityName;
		var py = $("body").val(cityName).toPinyin().substr(0, 1);
		if(!map[py]) {
			map[py] = [];
		} 
		map[py].push({"code":city.cityCode, "name":cityName});
	}
	var city1 = "";
	var city2 = "";
	var city3 = "";
	var city4 = "";
	for(var i=65; i<71; i++) {
		var ch = String.fromCharCode(i);
		if(map[ch]) {
			for(var j=0; j<map[ch].length; j++) {
				var city = map[ch][j];
				city1 += "<span class=\"city-item\" code=\""+city.code+"\">"+city.name+"</span>";
			}
		}
	}
	for(var i=71; i<78; i++) {
		var ch = String.fromCharCode(i);
		if(map[ch]) {
			for(var j=0; j<map[ch].length; j++) {
				var city = map[ch][j];
				city2 += "<span class=\"city-item\" code=\""+city.code+"\">"+city.name+"</span>";
			}
		}
	}
	for(var i=78; i<85; i++) {
		var ch = String.fromCharCode(i);
		if(map[ch]) {
			for(var j=0; j<map[ch].length; j++) {
				var city = map[ch][j];
				city3 += "<span class=\"city-item\" code=\""+city.code+"\">"+city.name+"</span>";
			}
		}
	}
	for(var i=85; i<91; i++) {
		var ch = String.fromCharCode(i);
		if(map[ch]) {
			for(var j=0; j<map[ch].length; j++) {
				var city = map[ch][j];
				city4 += "<span class=\"city-item\" code=\""+city.code+"\">"+city.name+"</span>";
			}
		}
	}
	$("#city1").html(city1);
	$("#city2").html(city2);
	$("#city3").html(city3);
	$("#city4").html(city4);

	
}
