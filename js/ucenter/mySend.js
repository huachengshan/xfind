var itemIndex = 1;
var dropload;
$(function(){
    var tab1LoadEnd = false;
    var tab2LoadEnd = false;
    var tab3LoadEnd = false;
    var tab4LoadEnd = false;
    var page1 = {page:0,size:10};
    var page2 = {page:0,size:10};
    var page3 = {page:0,size:10};
    var page4 = {page:0,size:10};
	var workExpList = {
		init:function(){
            this.initData();
            this.dropload();
			this.jobDetail();
			this.show();
		},
		dropload:function () {
			var P = new pagination("#content",{});
            dropload = P.dropload(function (p, me) {
				if(itemIndex==1) {
					page1.page++;
                    postData("#all-list", "#all-tab", "all", page1, me);
				} else if(itemIndex==2) {
                    page2.page++;
                    postData("#readed-list", "#readed-tab", "1", page2, me);
				} else if(itemIndex==3) {
                    page3.page++;
                    postData("#interest-list", "#interest-tab", "2", page3, me);
				} else {
                    page4.page++;
                    postData("#no-interest-list", "#no-interest-tab", "-1", page4, me);
				}
            });
        },
		show:function(){
			$("#all-tab").on("click", function(){
				$(".tab-item").removeClass("active");
				$(this).addClass("active");
				$("#all-list").show();
				$("#readed-list").hide();
				$("#interest-list").hide();
				$("#no-interest-list").hide();
				itemIndex = 1;
                // 如果数据没有加载完
                if(!tab1LoadEnd){
                    // 解锁
                    dropload.unlock();
                    dropload.noData(false);
                }else{
                    // 锁定
                    dropload.lock('down');
                    dropload.noData();
                }
                // 重置
                dropload.resetload();
			});

			$("#readed-tab").on("click", function(){
				$(".tab-item").removeClass("active");
				$(this).addClass("active");
				$("#all-list").hide();
				$("#readed-list").show();
				$("#interest-list").hide();
				$("#no-interest-list").hide();
                itemIndex = 2;
                // 如果数据没有加载完
                if(!tab2LoadEnd){
                    // 解锁
                    dropload.unlock();
                    dropload.noData(false);
                }else{
                    // 锁定
                    dropload.lock('down');
                    dropload.noData();
                }
                // 重置
                dropload.resetload();
			});

			$("#interest-tab").on("click", function(){
				$(".tab-item").removeClass("active");
				$(this).addClass("active");
				$("#all-list").hide();
				$("#readed-list").hide();
				$("#interest-list").show();
				$("#no-interest-list").hide();
                itemIndex = 3;
                // 如果数据没有加载完
                if(!tab3LoadEnd){
                    // 解锁
                    dropload.unlock();
                    dropload.noData(false);
                }else{
                    // 锁定
                    dropload.lock('down');
                    dropload.noData();
                }
                // 重置
                dropload.resetload();
			});

			$("#no-interest-tab").on("click", function(){
				$(".tab-item").removeClass("active");
				$(this).addClass("active");
				$("#all-list").hide();
				$("#readed-list").hide();
				$("#interest-list").hide();
				$("#no-interest-list").show();
                itemIndex = 4;
                // 如果数据没有加载完
                if(!tab4LoadEnd){
                    // 解锁
                    dropload.unlock();
                    dropload.noData(false);
                }else{
                    // 锁定
                    dropload.lock('down');
                    dropload.noData();
                }
                // 重置
                dropload.resetload();
			});
		},
		initData:function(){
            var url = serverUrl + "/requestRecord/getResponseStateCount";
            var query = {"state":"viewed", "userId":user.id};
            var params = {"param": JSON.stringify(query)};
            utils.request(url, params, function (result) {
				if(result.code==0) {
					console.log(result);
					$("#readed-tab").find("span").html(result.data[0].count);
				}
            });

            query = {"state":"interested", "userId":user.id};
            params = {"param": JSON.stringify(query)};
            utils.request(url, params, function (result) {
				if(result.code==0) {
					$("#interest-tab").find("span").html(result.data[0].count);
				}
            });

            query = {"state":"not_interested", "userId":user.id};
            params = {"param": JSON.stringify(query)};
            utils.request(url, params, function (result) {
				if(result.code==0) {
					$("#no-interest-tab").find("span").html(result.data[0].count);
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
		}
	}
	workExpList.init();
});

function postData(ele, tab, responseState, page, me) {
	//执行ajax请求
	var url = serverUrl + "/requestRecord/getDataByUserId";
	var query = {"userId" : user.id, "responseState":responseState, "resumeSource":"request", "pageNum":page.page, "pageSize":page.size};
	var params = {"param" : JSON.stringify(query)};
	utils.request(url, params, function(result){
		if(result.code==0) {
			var list = result.data.list;
			console.log(list);
			var total = result.data.total;
			$(tab).find("span").html(total);
			if(list.length > 0) {
				var html = "";
				for(var i=0; i<list.length; i++) {
					var send = list[i];
					var job;
					var userId = user ? user.id : "$null";
					var url = serverUrl + "/positionInfo/getDataById/"+send.jobCode+"/"+userId;
					utils.get(url, {}, function(result){

						if(result.code==0) {
							if(result.data.length>0) {
								job = result.data[0];
							}
						} else {
							alert(result.message);
						}
					});
					var rate = job.matchResume ? job.matchResume : "0%";
					rate = rate.substring(0, rate.length-1);
					rate = parseFloat(rate.substring(0, rate.length-1))/100;
					var createdDt = monthAndDay(job.createdDt);
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
					html += "<a class=\"myFocus\" jobId=\""+send.jobCode+"\">"+
						        "<div class=\"company\">"+
						          send.jobName+
						        "</div>"+
						        "<div class=\"category\">"+
						  		    salary+"/月<span class=\"tags\">"+nowCity+"/"+job.education.name+"/"+createdDt+"</span>"+
						        "</div>"+
						        "<div class=\"address\">"+
						  		    send.companyName+
						        "</div>"+
						        "<div class=\"progress-container\">"+
						          "<!--div class=\"my-progress lf\" progress=\""+rate+"\"><div class=\"desc\">性格匹配</div></div-->"+
						          "<div class=\"my-progress rt\" progress=\""+rate+"\"><div class=\"desc\">简历匹配</div></div>"+
						        "</div>"+
						      "</a>  ";
				}
				$(ele).append(html);
			} else {
                // 数据加载完
				if(itemIndex==1) {
                    tab1LoadEnd = true;
				} else if(itemIndex==2) {
                    tab2LoadEnd = true;
				} else if(itemIndex==3) {
                    tab3LoadEnd = true;
				} else {
                    tab4LoadEnd = true;
				}
                // 锁定
                me.lock();
                // 无数据
                me.noData();
			}
            // 每次数据加载完，必须重置
            me.resetload();
		} else {
			alert(result.message);
            // 锁定
            me.lock();
            // 无数据
            me.noData();
		}

        //数据填充
        $(".my-progress").each(function(){
            var loaded = $(this).attr("loaded");
            if(!loaded) {
                var progress = $(this).attr("progress");
                circleProgress(this, progress);
            }
            $(this).attr("loaded", true);
        });
	},function () {
        alert('系统异常，请稍后重试');
        // 锁定
        me.lock();
        // 无数据
        me.noData();
        // 即使加载出错，也得重置
        me.resetload();
    });
}

function circleProgress(obj, progress) {
	var divHeight = obj.offsetHeight || $(obj).height();
	divHeight = divHeight ? parseInt(divHeight) : 0;
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


