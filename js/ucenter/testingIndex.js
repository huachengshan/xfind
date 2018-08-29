
$(function(){
	var query = $.getLocationQueryData();
	var tt = query.tt;
	if(tt) {
		
		history.go(-1);
		var url = location.href.split("?")[0];
		location.href=url;
		
	}
	var testingIndex = {
		init:function(){
			this.loadData();
		},
		loadData:function(){
			// var url = serverUrl + "/front/cleartestAll";
			// var query = {"user_id" : user.xyUserId};
			// var params = {"param" : JSON.stringify(query)};
			// utils.request(url,params,function(result){
			// 	console.log(result);
			// });

			//执行ajax请求
			var url = serverUrl + "/front/index";
			var query = {"user_id" : user.xyUserId};
			var params = {"param" : JSON.stringify(query)};
			utils.request(url,params,function(result){
				if(result.code==0) {
					var data = result.data;
					var categoryList = data.categoryList;
					var scrollImageList = data.scrollImageList;
					//滚动图片
					var html = "";
					for(var i=0; i<scrollImageList.length; i++) {
						var scrollImage = scrollImageList[i];
						html += "<div class=\"swiper-slide\">"+
		                            "<img src='"+imageUrl + scrollImage.image+"' >"+
		                        "</div>";
					}
					$("#scrollImageList").html(html);
					var mySwiper = new Swiper('.swiper-container', {
				        loop: true,
				        autoplay:2000,
				        // 如果需要分页器
				        pagination: '.swiper-pagination'
				    });

				    //测评列表
				    var testHtml = "";
				    for(var i=0; i<categoryList.length; i++) {
				    	var category = categoryList[i];
				    	testHtml += "<div class='test_item' onclick=\"doTest("+category.id+", '"+category.name+"' ,'"+category.description+"', "+category.total_num+", "+category.answer_num+");\">"+
			                            "<p class='title'>"+category.name+"</p>"+
			                            "<div class='img_box'>"+
			                                "<img src=\""+imageUrl+category.image+"\">"+
			                                "<p class='state'><span class='state_txt'>"+category.title+"</span><span class='state_txt'>共"+category.total_num+"题</span><span class='state_txt'>已完成"+category.answer_num+"题</span></p>"+
			                            "</div>"+
			                        "</div>";
				    }
				    $("#testList").html(testHtml);
					
				} else {
					alert(result.message);
				}
			});
		}
	}

	testingIndex.init();
});

function doTest(testing_id, title, content, total_num, answer_num) {
		//执行ajax请求
		var url = serverUrl + "/front/ajax_testing";
		var query = {"user_id" : user.xyUserId, "testing_id":testing_id};
		var params = {"param" : JSON.stringify(query)};
		utils.request(url,params,function(result){
			if(result.code==0) {
				var data = result.data;
				if(data=='is last question') {
                    wx_navigate("/pages/redirect/redirect?url="+escape("testResult.html?testing_id="+testing_id));
					return;
				} else {
					if(total_num==0) {
			            alert("该测评还没有题目");
			            return;
			        }
			        if(total_num==answer_num) {
			        	var uri = escape("testResult.html?testing_id="+testing_id);
			            wx_navigate("/pages/redirect/redirect?url="+uri);
			            return;
			        }

			        commonDialog.open(title, content,"马上测试","拒绝", function () {
			            wx_navigate("/pages/redirect/redirect?url="+escape("testing.html?testing_id="+testing_id));
			        });
				}
			}
		});
		
}

