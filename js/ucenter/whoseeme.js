
$(function(){
	var whoseeme = {
		init:function(){
			this.show();
			this.loadData();
			this.companyDetail();
		},
		companyDetail:function(){
			$(document).on("click", ".company", function(){
				var companyId = $(this).attr("companyId");
				wx_navigate("/pages/redirect/redirect?url="+escape("companyDetail.html?companyId="+companyId));
			})
		},
		show:function(){
			$('.mainPage').css("left", 0);
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/resumeBrowse/getDataByUserId/" + user.id;
			utils.get(url,{},function(result){
				if(result.code==0) {
					var data = result.data;
					console.log(result);
					if(data.length>0) {
						var html = "";
						for(var i=0; i<data.length; i++) {
							var companyId = data[i].enterpriseId;
							var company = data[i].enterpriseInfo;
							html += "<a class=\"company\" companyId=\""+companyId+"\">"+
            							company.companyName +
         							 "</a>";
						}
						$("#company").html(html);
					} else {
						$("#company").hide();
						$(".no-data").show();
					}
				} else {
					alert(result.message);
				}
			});
		}
	}

	whoseeme.init();
});

