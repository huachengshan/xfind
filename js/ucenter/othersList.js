
$(function(){
	var educationExpList = {
		init:function(){
			this.loadData();
			this.editExp();
			this.addExp();
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/others/getDataByUserId/" + user.id;
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var expList = result.data;
					if(expList.length!=0) {
						var html = "";
						for(var i=0; i<expList.length; i++) {
							var exp = expList[i];
							html+="<a class=\"myFocus\" code=\""+exp.id+"\" style=\"padding:0 .5rem;height:1.2rem;line-height:1.2rem;\">"+
							        "<div class=\"category\">"+
							  		    exp.title +
							        "</div>"+
							        "<div class=\"arrow\">"+
							  			"<img src=\"images/right-arrow.png\">"+
							        "</div>"+
							    "</a>";
						}
						$("#expList").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		editExp:function(){
			$(document).on("click", ".myFocus", function(){
				var code = $(this).attr("code");
				wx_navigate("/pages/redirect/redirect?url="+escape("others.html?id=" + code));
			})
		},
		addExp:function(){
			$("#addExp-btn").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=others.html");
			});
		}
	}

	educationExpList.init();
});

