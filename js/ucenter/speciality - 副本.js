
$(function(){
	var evaluation = {
		init:function(){
			this.loadData();
			this.slide();
		},
		loadData:function(){
			var user = JSON.parse(localStorage.getItem("user"));
			var accessToken = localStorage.getItem("accessToken");
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/A4_12/1/100";
			$.ajax({
				type : "GET",
				dataType : "json",
				url : url,
				contentType : "application/json;charset=utf-8",
				beforeSend:function(xhr){
					alert("数据加载中");
					xhr.setRequestHeader("Authorization", "xfind " + accessToken);
				},
				success : function(result){
					if(result.code==0) {
						var data = result.data;
						if(data.length==0) {
							alert("专业数据为空");
						} else {
							console.log(data);
						}
					} else {
						alert(result.message);
					}
				}
			});
		},
		slide:function(){
			$(".l-item").on("click", function(){
				$(".right-wrap").hide();
				$(".middle-wrap").hide();
				$(".l-item").removeClass("active");
				$(this).addClass("active");
				var html =  "<div class=\"m-item\">管理科学与工程类</div>"+
				            "<div class=\"m-item\">工商管理类</div>"+
				            "<div class=\"m-item\">行政管理类</div>"+
				            "<div class=\"m-item\">公共管理类</div>"+
				            "<div class=\"m-item\">图书档案学类</div>";
				$(".middle-wrap").html(html);
				$(".middle-wrap").slideDown();
			});

			$(document).on("click",".m-item", function(){
				$(".right-wrap").hide();
				var idArr = ",";
				$(".select-options .selected").each(function(){
					var id = $(this).attr("id");
					idArr += id + ",";
				});
				$(".m-item").removeClass("active");
				$(this).addClass("active");
				var html = "";
				for(var i = 1; i<5; i++) {
					var active = "";
					var text = "";
					if(idArr.indexOf(","+i+",")!=-1) {
						active = "active";
					}
					if(i==1) {
						text = "图书档案管理学类";
					}
					if(i==2) {
						text = "图书馆学和档案学";
					}
					if(i==3) {
						text = "信息资源管理";
					}
					if(i==4) {
						text = "信息资源管理";
					}
					html += "<div class=\"r-item "+active+"\" id=\""+i+"\">"+text+"</div>";
				}
				$(".right-wrap").html(html);				            
				$(".right-wrap").slideDown();
				
			});

			$(document).on("click",".r-item", function(){
				var num = $("#num").html();
				var id = $(this).attr("id");
				if($(this).hasClass("active")) {
					$(this).removeClass("active");
					$("#num").html(parseInt(num) - 1);
					$(".select-options .selected[id='"+id+"']").remove();
				} else if(num<3) {
					var text = $(this).html();
					$(this).addClass("active");
					var html = "<div class=\"selected\" id=\""+id+"\">"+
	                  "<span>"+text+"&nbsp;<img src=\"images/close.png\" class=\"my-close\"></span>"+
	               	  "</div>";
					$(".select-options").append(html);
					$("#num").html(parseInt(num) + 1);
				} else {
					alert("最多可选择三项");
				}
			});
			
			$(document).on("click",".select-options .selected",function(e){
				var id = $(this).attr("id");
		        $(this).remove();
				var num = $("#num").html();
				$("#num").html(parseInt(num) - 1);
				$(".right-wrap .r-item[id='"+id+"']").removeClass("active");
		    });
		}
	}
	evaluation.init();
});

