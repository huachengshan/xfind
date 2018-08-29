
$(function(){
	var workExpList = {
		init:function(){
			this.dropload();
			this.jobDetail();
		},
		jobDetail:function(){
			$(document).on("click", ".myFocus", function(){
				var jobId = $(this).attr("jobId");
				wx_navigate("/pages/redirect/redirect?url="+escape("jobDetail.html?jobId="+jobId));
			});
		},
        dropload:function(){
            var P = new pagination("#content",{});
            P.dropload(function(page, me){
                var url = serverUrl + "/collectionPosition/getDataByUserId/"+user.id+"/"+page.page+"/"+page.size;
                utils.get(url, {}, function(result){
                    if(result.code==0) {
                        var favList = result.data.list;
                        var html = "";
                        if(favList.length > 0) {
                            for(var i=0; i<favList.length; i++) {
                                var fav = favList[i];
                                var job = fav.positionInfo;
                                var enterprise = job.enterprise;
                                var createdDt = monthAndDay(job.createdDt);
                                var rate = fav.matchResume ? fav.matchResume : "0%";
                                rate = rate.substring(0, rate.length-1);
                                rate = parseFloat(rate.substring(0, rate.length-1))/100;
                                var salary = job.salary.name;
                                if(salary==null || salary=="") {
                                    var min = job.salary.min+"";
                                    var max = job.salary.max+"";
                                    if(min.indexOf("K")==-1 && min.length>=4) {
                                        min = min.substring(0, min.length-3)+"K";
                                    }
                                    if(max.indexOf("K")==-1 && max.length>=4) {
                                        max = max.substring(0, max.length-3)+"K";
                                    }
                                    salary = min+"-"+max;
                                }
                                var nowCity = job.city.name;
                                if(nowCity==null || nowCity=="" || nowCity=="市辖区") {
                                    nowCity = job.province.name;
                                }
                                html += "<a class=\"myFocus\" jobId=\""+job.id+"\">"+
                                    "<div class=\"company\">"+
                                    job.jobName+
                                    "</div>"+
                                    "<div class=\"category\">"+
                                    salary+"/月<span class=\"tags\">"+nowCity+"/"+job.education.name+"/"+createdDt+"</span>"+
                                    "</div>"+
                                    "<div class=\"address\">"+
                                    enterprise.companyName+
                                    "</div>"+
                                    "<div class=\"progress-container\">"+
                                    "<!--div class=\"my-progress lf\" progress=\""+rate+"\"><div class=\"desc\">性格匹配</div></div-->"+
                                    "<div class=\"my-progress rt\" progress=\""+rate+"\"><div class=\"desc\">简历匹配</div></div>"+
                                    "</div>"+
                                    "<div class=\"arrow\">"+
                                    "<img src=\"images/right-arrow.png\">"+
                                    "</div>"+
                                    "</a> ";
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


