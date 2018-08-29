
$(function(){
	var query = $.getLocationQueryData();
	var companyId = query.companyId;
	var workExpList = {
		init:function(){
			this.initData()
			this.loadAllJob();
			this.jobDetail();
			this.focus();
		},
		initData:function(){
			var userId = user ? user.id : "$null";
			var url = serverUrl + "/enterprise/getDataById/"+companyId+"/"+userId;
			utils.get(url, {}, function(result){
				if(result.code==0) {
					if(result.data.length>0) {
						var enterprise = result.data[0];
						console.log(enterprise);
						$("#companyName").html(enterprise.companyName);
						$("#companyType").html(enterprise.companyType.name);
						$("#logo").attr("src", imageUrl + "/" + enterprise.companyLogo);
						$("#scale").html(enterprise.companyScale.name);
						$("#labels").html(enterprise.oneIndustry.name);
						$("#address").html(enterprise.address);
						$("#introduce").html(enterprise.introduction);
						var isFocus = enterprise.isFocus;
						if(isFocus=="Y") {
							$("#focus").html("取消关注");
							$("#focus").attr("focusId", enterprise.focusId);
						}
						var pics = enterprise.pics;
						var html = "";
						for(var i=0; i<pics.length; i++) {
							var pic = pics[i];
							var imgUrl = imageUrl + "/" + pic.src;
							html += "<img class=\"swiper-slide\" src=\""+imgUrl+"\">";
						}
						$("#swiperImg").html(html);
					}
				} else {
					alert(result.message);
				}
			});

			var swiper = new Swiper('.swiper-container',{
				slidesPerView: 2,
				spaceBetween: 10
			});
		},
		loadAllJob:function(){
			var url = serverUrl + "/positionInfo/getDataByType";
			var params = {param : JSON.stringify({"type":"enterprise", "code":companyId,"isStop":"N","pageNum":1,"pageSize":100,"userId":user.id})};
			utils.request(url, params, function(result){
				console.log(result);
				if(result.code==0) {
					var list = result.data.list;
					var html = "";
					for(var i=0; i<list.length; i++) {
						var likeJob = list[i];
						var likeEnterprise = likeJob.enterprise;
						var createdDt = monthAndDay(likeJob.createdDt);
						var rate = likeJob.matchResume ? likeJob.matchResume : "0%";
	                    rate = rate.substring(0, rate.length-1);
	                    rate = parseFloat(rate.substring(0, rate.length-1))/100;
	                    var salary = likeJob.salary.name;
						if(salary==null || salary=="") {
							var min = likeJob.salary.min+"";
							var max = likeJob.salary.max+"";
							if(min.indexOf("K")==-1 && min.length>=4) {
								min = min.substring(0, min.length-3)+"K";
							}
							if(max.indexOf("K")==-1 && max.length>=4) {
								max = max.substring(0, max.length-3)+"K";
							}
							salary = min+"-"+max;
						}
						var nowCity = likeJob.city.name;
			            if(nowCity==null || nowCity=="" || nowCity=="市辖区") {
			                nowCity = likeJob.province.name;
			            }
						html += "<a class=\"myFocus\" jobId=\""+likeJob.id+"\">"+
							        "<div class=\"company\">"+
							          likeJob.jobName+
							        "</div>"+
							        "<div class=\"category\">"+
							  		    salary+"/月<span class=\"tags\">"+nowCity+"/"+likeJob.education.name+"/"+createdDt+"</span>"+
							        "</div>"+
							        "<div class=\"address\">"+
							  		    likeEnterprise.companyName+
							        "</div>"+
							        "<div class=\"progress-container\">"+
							          "<div class=\"my-progress lf\" progress=\""+rate+"\"><div class=\"desc\">性格匹配</div></div>"+
							          "<!--div class=\"my-progress rt\" progress=\"0.8\"><div class=\"desc\">简历匹配</div></div-->"+
							        "</div>"+
							      "</a>  ";
					}
					$("#jobList").html(html);

					//数据填充
					$(".my-progress").each(function(){
						var progress = $(this).attr("progress");
						circleProgress(this, progress);
					});
				} else {
					alert(result.message);
				}
			});
		},
		jobDetail:function(){
			$(document).on("click", ".myFocus", function(){
				var jobId = $(this).attr("jobId");
				if(jobId){
					wx_navigate("/pages/redirect/redirect?url="+escape("jobDetail.html?jobId="+jobId));
				}
			});
		},
		focus:function(){
			$("#focus").on("click", function(){
				var text = $(this).html();
				var focusId = $(this).attr("focusId");
				if(text=='取消关注') {
					var url = serverUrl + "/focusEnterprise/delete/"+focusId;
					utils.delete(url, {}, function(result){
						if(result.code==0) {
							$("#focus").html("关注公司");
							alert("取消关注成功");
						} else {
							alert(result.message);
						}
					});
				} else {
					var url = serverUrl + "/focusEnterprise/add";
					var params = {"enterpriseId":companyId, "focusUserId":user.id};
					utils.post(url, JSON.stringify(params), function(result){
						if(result.code==0) {
							alert("关注成功");
							$("#focus").html("取消关注");
							var userId = user ? user.id : "$null";
							var url = serverUrl + "/enterprise/getDataById/"+companyId+"/"+userId;
							utils.get(url, {}, function(result){
								if(result.code==0) {
									if(result.data.length>0) {
										var enterprise = result.data[0];
										$("#focus").attr("focusId", enterprise.focusId || "");
									}
								}
							});

						} else {
							alert(result.message);
						}
					});
				}

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


