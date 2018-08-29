
$(function(){
	var workExpList = {
		init:function(){
			this.dropload();
			this.companyDetail();
		},
		companyDetail:function(){
			$(document).on("click", ".myFocus", function(){
				var companyId = $(this).attr("companyId");
				wx_navigate("/pages/redirect/redirect?url="+escape("companyDetail.html?companyId="+companyId));
			});
		},
        dropload:function(){
            var P = new pagination("#content",{});
            P.dropload(function(page, me){
                var url = serverUrl + "/focusEnterprise/getDataByUserId/"+user.id+"/"+page.page+"/"+page.size;
                utils.get(url, {}, function(result){
                    if(result.code==0) {
                        var favList = result.data.list;
                        var html = "";
                        if(favList.length > 0) {
                            for(var i=0; i<favList.length; i++) {
                                var enterprise = favList[i].enterprise;
                                html += "<a class=\"myFocus\" companyId=\""+enterprise.id+"\">"+
                                    "<div class=\"company\">"+
                                    enterprise.oneIndustry.name +
                                    "</div>"+
                                    "<div class=\"category\">"+
                                    enterprise.companyName +
                                    "</div>"+
                                    "<div class=\"address\">"+
                                    enterprise.address+
                                    "</div>"+
                                    "<div class=\"arrow\">"+
                                    "<img src=\"images/right-arrow.png\">"+
                                    "</div>"+
                                    "</a>   ";
                            }
                        } else {
                            // 锁定
                            me.lock();
                            // 无数据
                            me.noData();
                        }
                        $("#favList").append(html);
                        // 每次数据插入，必须重置
                        me.resetload();
                    } else {
                        alert(result.message);
                    }
                },function(xhr, type){
                    alert('系统异常，请稍后重试');
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                    // 即使加载出错，也得重置
                    me.resetload();
                });
			});


			//数据填充
			$(".my-progress").each(function(){
				var progress = $(this).attr("progress");
				circleProgress(this, progress);
			});
		}
	}
	workExpList.init();
});

function circleProgress(obj, progress) {
	var divHeight = obj.offsetHeight;
	$(obj).circleProgress({
        value: progress,
        size: divHeight - 15,
        fill: {
            gradient: ["rgb(30,127,245)", "#3cf5f0"]
        },
        startAngle:Math.PI*0.5,
        reverse:true,
        thickness:6
    });
    
    $(obj).find(".desc")[0].style.width = (divHeight - 15)+"px";
   
    var canvas = $(obj).circleProgress('widget');
    var ctx = canvas.getContext("2d");
	var width = canvas.width,height=canvas.height;
	if (window.devicePixelRatio) {
		canvas.style.width = width + "px";
		canvas.style.height = height + "px";
		canvas.height = height * window.devicePixelRatio;
		canvas.width = width * window.devicePixelRatio;
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
	}
}


