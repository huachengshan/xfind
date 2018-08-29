var query = $.getLocationQueryData();
var testing_id = query.testing_id;
$(function(){
	var testingResult = {
		init:function(){
			this.loadData();
		},
		loadData:function(){
			// setTimeout(function(){
			//执行ajax请求
			var url = serverUrl + "/front/testResult";
			var query = {"user_id" : user.xyUserId, "testing_id":testing_id};
			var params = {"param" : JSON.stringify(query)};
			$.ajax({
                type : "post",
                dataType : "json",
                url : url,
                data : params,
                async : false,
                contentType:"application/x-www-form-urlencoded",
                beforeSend:function(xhr){
                    if(accessToken){
                       xhr.setRequestHeader("Authorization", "xfind " + accessToken);
                    }
                },
                success : function(result){
				if(result.code==0) {
					console.log(result);
					var category = result.data.category;
					var questionStatisticList = result.data.questionStatisticList;
					var totalPercent = parseInt(result.data.totalPercent * 100) + "%";
					var date = new Date(result.data.categoryStatistic.create_time);
					$("#time").html(dateFtt(date, "yyyy-MM-dd hh:mm:ss"));
					// alert("length"+questionStatisticList.length);
					$("#categoryName").html(category.name);
					var html = "";
					var html2 = "";
					for(var i=0; i<questionStatisticList.length; i++) {
						var questionStatistic = questionStatisticList[i];
						var percent = parseInt(questionStatistic.percent * 100) + "%";
						html += "<div class='progress_box_1'>"+
					                "<span class='title' style=\"display: block;width:100%;margin-left: 10px;\">"+questionStatistic.questionStatistic.category_name+"</span>"+
					                "<div class='progress_box'>"+
					                    "<div class='progress'>"+
					                        "<div class='progress_inner' style=\"width:"+percent+"\">"+
					                            "<div class='progress_arrow'>"+
					                                "<img src=\"images/15.png\">"+
					                                "<p class='per_text'><span>打败</span>"+percent+" </p>"+
					                            "</div>"+
					                        "</div>"+
					                    "</div>"+
					                "</div>"+
					            "</div>";

					    html2 += "<p>"+questionStatistic.questionStatistic.category_description+"</p><br/>";
					}
					$(".part4").html(html);
					$("#content").html(html2);
					if(category.id==4) {
						var html = "<div class='progress_box_1'>"+
					                    "<span class='title' style=\"display: block;width:100%;margin-left: 10px;\">总体的【择业成熟度】<br/></span>"+
					                    "<div class='progress_box'>"+
					                        "<div class='progress'>"+
					                            "<div class='progress_inner' style=\"width:"+totalPercent+"\">"+
					                                "<div class='progress_arrow'>"+
					                                    "<img src=\"images/15.png\">"+
					                                    "<p class='per_text'><span>打败</span>"+totalPercent+" </p>"+
					                                "</div>"+
					                            "</div>"+
					                        "</div>"+
					                    "</div>"+
					                "</div>";
					    $(".part4").append(html);
					    $("#title").html("这几大概念分别是");
					} else if(category.id==2) {
						$("#title").html("各项性格特质对应的行为心理表现");
					} else if(category.id==3) {
						$("#title").html("以下是一些简单但重要的建议");
						$("#introduce").show();
					}
					

				} else {
					alert(result.message);
				}
				},
                error:function(data, type, error){
                	
                }
            });
		// },200);
			// utils.request(url,params,
			// });


			//tab标签切换
			$('.tab_list').on('click', '.tab_item', function(){
		        $(this).siblings().removeClass('active');
		        $(this).addClass('active');

		        var index = this.getAttribute('index');

		        $('.result_img').removeClass('show');

		        $('.result_img_' + index).addClass('show');
		    });
		}
	}

	testingResult.init();
});

