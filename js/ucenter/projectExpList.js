
$(function(){
	var query = $.getLocationQueryData();
	var tt = query.tt;
	if(tt) {
		history.go(-1);
		var url = location.href.split("?")[0];
		location.href=url;
	}
	var educationExpList = {
		init:function(){
			this.loadData();
			this.editExp();
			this.addExp();
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/projectExperiences/getDataByUserId/" + user.id;
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var expList = result.data;
					if(expList.length!=0) {
						var html = "";
						for(var i=0; i<expList.length; i++) {
							var exp = expList[i];
							var startDt = getDateStr(new Date(exp.startDt));
							var endDt = getDateStr(new Date(exp.endDt));
							html+="<a class=\"myFocus\" code=\""+exp.id+"\">"+
							        "<div class=\"company\">"+
							          startDt+"-"+endDt+
							        "</div>"+
							        "<div class=\"category\">"+
							  		    exp.projectName +
							        "</div>"+
							        "<div class=\"address\">"+
							  		    exp.companyName+
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
				wx_navigate("/pages/redirect/redirect?url="+escape("projectExp.html?id=" + code));
			})
		},
		addExp:function(){
			$("#addExp-btn").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=projectExp.html");
			});
		}
	}

	educationExpList.init();
});

