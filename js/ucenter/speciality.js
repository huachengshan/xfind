
$(function(){
	var basicInfo;
	var evaluation = {
		init:function(){
			this.loadData();
			this.slide();
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/adminMajors/one/getAllData/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data.list;
					if(data.length!=0) {
						var html = "";
						for(var i=0; i<data.length; i++) {
							var one = data[i];
							html += "<div class=\"l-item\" code=\""+one.oneCode+"\">"+one.oneName+"</div>";
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
				var url = serverUrl + "/adminMajors/two/getAllData/"+code+"/1/100";
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data.list;
						if(data.length!=0) {
							var html = "";
							for(var i=0; i<data.length; i++) {
								var two = data[i];
								html += "<div class=\"m-item\" code=\""+two.twoCode+"\">"+two.twoName+"</div>";
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
				var url = serverUrl + "/adminMajors/getAllData/"+code+"/1/100";
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data.list;
						if(data.length!=0) {
							var html = "";
							for(var i=0; i<data.length; i++) {
								var three = data[i];
								html += "<div class=\"r-item\" code=\""+three.majorsCode+"\">"+three.majorsName+"</div>";
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
				var majors_code = $(this).attr("code");
				var majors_name = $(this).html();
				$(".r-item").removeClass("active");
				$(this).addClass("active");
				$("#majors_code").val(majors_code);
				$("#majors").html(majors_name);
			});

			$("#majors-sure").on("click", function(){
				var majors_code = $("#majors_code").val();
				if(majors_code=='') {
					alert("请选择一个专业");
				} else {
					$("#mainPage").show();
					$("#page2").hide();
				}
			});
		}
	}
	evaluation.init();
});

