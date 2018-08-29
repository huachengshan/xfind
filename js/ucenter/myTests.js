
$(function(){
	var myTests = {
		init:function(){
			this.loadData();
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/front/myTests";
			var query = {"user_id" : user.xyUserId};
			var params = {"param" : JSON.stringify(query)};
			utils.request(url,params,function(result){
				if(result.code==0) {
					var list = result.data;
					var html = "";
					for(var i=0; i<list.length; i++) {
						var test = list[i];
						var date = new Date(test.create_time);
						var dateStr = date.getFullYear() + "年" + (date.getMonth()+1) + "月" + date.getDate() + "日";
						var image = imageUrl + test.category_image;
						var text = "未完成，点击继续";
						var url = "testing.html?testing_id=" + test.category_id;
						if(test.total_num == test.answer_num) {
							text = "已完成，查看报告";
							url = "testResult.html?testing_id=" + test.category_id;
						}
						html += "<div class='mytest_item'>"+
					                "<div class='top'>"+
					                    "<p class='title'>"+test.category_name+"</p>"+
					                    "<p class='time'>发起时间：<span>"+dateStr+"</span></p>"+
					                "</div>"+
					                "<div class='middle webkit_box webkit_horizontal'>"+
					                    "<img src='"+image+"'>"+
					                    "<p>"+test.category_description+"</p>"+
					                "</div>"+
					                "<div class='bottom' onclick=\"toDetail('"+url+"')\">"+
					                        "<p>"+text+"</p>"+
					                        "<img src='images/2.png'>"+
					                    "</div>"+
					                "</div>";
					}
					$(".mytest_list").html(html);
					
				} else {
					alert(result.message);
				}
			});
		}
	}

	myTests.init();
});

function toDetail(url) {
	wx_navigate("/pages/redirect/redirect?url="+escape(url));
}

