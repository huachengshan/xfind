
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
			var url = serverUrl + "/workExperiences/getDataByUserId/" + user.id;
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var expList = result.data;
					if(expList.length!=0) {
						var html = "";
						for(var i=0; i<expList.length; i++) {
							var exp = expList[i];
							var startDt = getDateStr(new Date(exp.startDt));
							var endDt = getDateStr(new Date(exp.endDt));
							var positionList = exp.position;
							var position_name = "";
							for(var i=0;i<positionList.length;i++){
								var position = positionList[i];
								position_name += position.name+",";
							} 
							position_name = position_name.substring(0,position_name.length-1);
							html+="<a class=\"myFocus\" code=\""+exp.id+"\">"+
							        "<div class=\"company\">"+
							          startDt+"-"+endDt+
							        "</div>"+
							        "<div class=\"category\">"+
							  		    exp.companyName +
							        "</div>"+
							        "<div class=\"address\">"+
							  		    position_name+
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
				wx_navigate("/pages/redirect/redirect?url="+escape("workExp.html?id=" + code));
			})
		},
		addExp:function(){
			$("#addExp-btn").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=workExp.html");
			});
		}
	}

	educationExpList.init();
});

