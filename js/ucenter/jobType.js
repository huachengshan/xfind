
$(function(){
	var jobType = {
		init:function(){
			this.loadData();
			this.click();
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/industry/one/getAllData/1/100";
			utils.get(url,{}, function(result){
				if(result.code==0) {
					var data = result.data.list;
					if(data.length!=0) {
						var html = "";
						for(var i=0; i<data.length; i++) {
							var one = data[i];
							html += "<div class=\"l-item\" code=\""+one.oneCode+"\">"+one.oneName+"</div>";
						}
						$("#jobContainer .left-wrap").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		click:function(){
			$("#jobContainer .l-item").on("click", function(){
				var code = $(this).attr("code");
				$("#jobContainer .right-wrap").hide();
				$("#jobContainer .l-item").removeClass("active");
				$(this).addClass("active");

				var html = "";
				var url = serverUrl + "/industry/two/getAllData/"+code+"/1/100";
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data.list;
						if(data.length!=0) {
							var html = "";
							for(var i=0; i<data.length; i++) {
								var three = data[i];
								html += "<div class=\"r-item\" code=\""+three.twoCode+"\">"+three.twoName+"</div>";
							}
							$("#jobContainer .right-wrap").html(html);
							$("#jobContainer .right-wrap").slideDown();
						}
					} else {
						alert(result.message);
					}
				
				});

				$("#jobContainer .r-item").on("click", function(){
					$("#industry_name").html($(this).html());
					$("#industry_code").val($(this).attr("code"));
					$("#jobContainer .r-item").removeClass("active");
					$(this).addClass("active");

				});

				$("#job-sure").on("click", function(){
					var industry_code = $("#industry_code").val();
					if(industry_code=='') {
						alert("请选择一个行业");
						return;
					} else {
						$("#mainPage").show();
						$("#page4").hide();
					}
				});
			});
			
			
		}
	}
	jobType.init();
});

