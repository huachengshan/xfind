
$(function(){
	var query = $.getLocationQueryData();
	var jobId = query.jobId;
	var workExpList = {
		init:function(){
			this.initData();
			this.jobDetail();
			this.sendResume();
			this.browse();
		},
		browse:function(){
			if(user) {
				//添加浏览记录
				setTimeout(function(){
					var url = serverUrl + "/positionBrowse/add";
					var param = {"userId":user.id, "positionId":jobId};
					utils.post(url, JSON.stringify(param), function(result) {
					});
				},2000);
			}
		},
		initData:function(){
			var userId = user ? user.id : "$null";
			var url = serverUrl + "/positionInfo/getDataById/"+jobId+"/"+userId;
			utils.get(url, {}, function(result){
				console.log(result);
				if(result.code==0) {
					if(result.data.length>0) {
						var job = result.data[0];
						var enterprise = job.enterprise;
						var rate = job.matchResume ? job.matchResume : "0%";
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
						$("#jobName").html(job.jobName);
						$("#salary").html(salary);
						$("#companyName").html(enterprise.companyName);
						$("#companyName").attr("companyId", enterprise.id);
						$("#matchResume").attr("progress", rate);
						var positionLabel = job.positionLabel;
						var labels = "";
						for(var i=0; i<positionLabel.length; i++) {
							labels += positionLabel[i] + "/";
						}
						$("#labels").html(labels.substring(0, labels.length-1));
						if(enterprise.companyType.name=='') {
							$("#sep").hide();
						} else {
							$("#companyType").html(enterprise.companyType.name);
						}
						$("#people").html(enterprise.companyScale.name);
						$("#city").html(job.city.name);
						$("#peopleNumber").html(job.peopleNumber);
						$("#education").html(job.education.name);
						$("#jobType").html(job.jobType.name);
						$("#publishTime").html(yearMonthAndDay(job.createdDt));
						initFuli(job.welfareLabel);
						$("#address").html(job.address);
						$("#positionDesc").html(job.positionDesc);
						$("#memo").html(job.memo);
						var isCollection = job.isCollection;
						var collectionId = job.collectionId;
						if(isCollection && isCollection=="Y") {
							$("#fav").attr("collectionId", collectionId);
							$("#fav").find("img").attr("src", "images/fav-select.png");
							$("#fav").addClass("selected");
						}
						if(job.isRequest=='Y') {
							$("#sendResume").addClass("sended");
							$("#sendResume").html("已投递");
						}

						var jobName = job.jobName;
						url = serverUrl + "/positionInfo/getPositionInfoByScreen";

						var query = {"keyword":jobName, "pageNum":"1", "pageSize":"5", "queryList":[],"userId":user.id};
						var params = {"param":JSON.stringify(query)};

						utils.request(url, params, function(result){
							if(result.code==0) {
								var list = result.data.list;
								if(list.length>0) {
									var html = "";
									for(var i=0; i<list.length; i++) {
										var likeJob = list[i];
										var likeEnterprise = likeJob.enterprise;
										if(likeJob.id == job.id) {
											continue;
										}
										var rate = likeJob.matchResume ? likeJob.matchResume : "0%";
					                    rate = rate.substring(0, rate.length-1);
					                    rate = parseFloat(rate.substring(0, rate.length-1))/100;
										var createdDt = monthAndDay(likeJob.createdDt);
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
									$("#seemLike").html(html);
								}
							} else {
								alert(result.message);
							}
						});
					}
				} else {
					alert(result.message);
				}
			});

			function initFuli(fuliList) {
				for(var i=0; i<fuliList.length; i++) {
					var fuli = fuliList[i];
					$("#fuliList").find("li[code='"+fuli.code+"']").show();
				}
			}

			//数据填充
			$(".my-progress").each(function(){
				var progress = $(this).attr("progress");
				circleProgress(this, progress);
			});

			$("#fav").on("click", function(){
				var obj = this;
				var collectionId = $(this).attr("collectionId");
				if($(this).hasClass("selected")) {
					var url = serverUrl + "/collectionPosition/delete/"+collectionId;
					var params = {"positionId":jobId, "collectionUserId":user.id};
					utils.delete(url, JSON.stringify(params), function(result){
						if(result.code==0) {
							$(obj).removeClass("selected");
							$(obj).find("img").attr("src", "images/fav.png");
							alert("取消收藏成功");
						} else {
							alert(result.message);
						}
					});
					
				} else {
					var url = serverUrl + "/collectionPosition/add";
					var params = {"positionId":jobId, "collectionUserId":user.id};
					utils.post(url, JSON.stringify(params), function(result){
						if(result.code==0) {
							$(obj).addClass("selected");
							$(obj).find("img").attr("src", "images/fav-select.png");
							alert("收藏成功");
							var userId = user ? user.id : "$null";
							var url = serverUrl + "/positionInfo/getDataById/"+jobId+"/"+userId;
							utils.get(url, {}, function(result){
								if(result.code==0) {
									if(result.data.length>0) {
										var job = result.data[0];
										$("#fav").attr("collectionId", job.collectionId || "");
									}
								}
							});

						} else {
							alert(result.message);
						}
					});
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

			$("#companyName").on("click", function(){
				var companyId = $(this).attr("companyId");
				wx_navigate("/pages/redirect/redirect?url="+escape("companyDetail.html?companyId="+companyId));
			});
		},
		sendResume:function(){
			$("#sendResume").on("click", function(){
				var text = $(this).html();
				if(text=='已投递') {
					return;
				}
				var userId = user ? user.id : "$null";
				var url = serverUrl + "/positionInfo/getDataById/"+jobId+"/"+userId;
				utils.get(url, {}, function(result){
					if(result.code==0) {
						if(result.data.length>0) {
							var job = result.data[0];
							if(job.isRequest=='Y') {
								alert("您已投过简历");
							} else {
								var jobName = $("#jobName").html();
								var companyName = $("#companyName").html();
								var companyId = $("#companyName").attr("companyId");
								var url = serverUrl + "/requestRecord/add";
								var params = JSON.stringify({"userId":user.id, "resumeSource":"request", "jobCode":jobId,
											  "jobName":jobName, "companyName":companyName, "companyCode":companyId, "responseState":0,"num":resumeId});

								utils.post(url, params, function(result){
									if(result.code==0) {
										alert("投递成功");
										$("#sendResume").addClass("sended");
										$("#sendResume").html("已投递");
									} else {
										alert(result.message);
									}
								});
							}
						}
					} else {
						alert(result.message);
					}
				});

				
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


