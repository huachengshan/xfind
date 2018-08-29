var dropload;
$(function(){
	var workExpList = {
		init:function(){
			this.initData();
			this.initSlide();
			this.inputSearch();
			this.conditionSearch();
            this.jobDetail();
		},
        jobDetail:function(){
            $(document).on("click", ".myFocus", function(){
                var jobId = $(this).attr("jobId");
                wx_navigate("/pages/redirect/redirect?url="+escape("jobDetail.html?jobId="+jobId));
            });
        },
		conditionSearch:function(){
			$(".sort_item").on("click", function(){
				$(".sort_item").removeClass("active");
				$(this).addClass("active");
				var flag = $(this).parent().attr("flag");
				$(".sort ul li[slide='"+flag+"']").trigger("click");
                $("#job-list").html("");
                $('.dropload-down').remove();
                var P = new pagination("#content", {});
                P.dropload(function (p, me) {
                    search(p, me);
                });
			});
		},
		inputSearch:function(){

		},
		initData:function(){
			var P = new pagination("#content", {});
			P.dropload(function (p, me) {
                search(p, me);
            });
		},
		initSlide:function(){
			$('.zhezhao').on('touchmove', function(event) {
                event.preventDefault();
            });
			$(".sort ul li").on("click",function(){
				var $img = $(this).find("img");
				var slide = $(this).attr("slide");
				if($img.attr("src")=='images/select.png') {
					$(".sort ul li").each(function(){
						var img = $(this).find("img");
						if(img.attr("src")=='images/up.png') {
							$(this).click();
						}
					});
					$img.attr("src","images/up.png");
					$("."+slide).slideDown();
					$(".zhezhao").show();
				} else {
					$img.attr("src","images/select.png");
					$("."+slide).slideUp(0);
					$(".zhezhao").hide();
				}
			});
		}
	}
	workExpList.init();
});

function search(page, me) {
    var keyword = $("#keyword").val();
    var sortKey = $(".sort_item.active").attr("sortKey");
    var sortType = $(".sort_item.active").attr("sortType");
    console.log(sortKey);
    console.log(sortType);
    //执行ajax请求
    url = serverUrl + "/positionInfo/getPositionInfoByScreen";
    var query = {"keyword":keyword, "sortKey":sortKey, "sortType":sortType, "pageNum":page.page, "pageSize":page.size, "queryList":[],"userId":user.id};
    var params = {"param":JSON.stringify(query)};
    utils.request(url,params, function(result){
        if(result.code==0) {
            var data = result.data;
            console.log(data);
            var html = "";
            if(data.list.length>0) {
                for (var i = 0; i < data.list.length; i++) {
                    var job = data.list[i];
                    var createdDt = job.createdDt;
                    var date = monthAndDay(createdDt);
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
                    var nowCity = job.city.name;
                    if(nowCity==null || nowCity=="" || nowCity=="市辖区") {
                        nowCity = job.province.name;
                    }
                    html += "<a class=\"myFocus\" jobId=\""+job.id+"\">" +
                        "<div class=\"company\">" +
                        job.jobName +
                        "</div>" +
                        "<div class=\"category\">" +
                        salary + "/月<span class=\"tags\">" + nowCity + "/" + job.education.name + "/" + date + "</span>" +
                        "</div>" +
                        "<div class=\"address\">" +
                        job.enterprise.companyName +
                        "</div>" +
                        "<div class=\"progress-container\">" +
                        "<!--div class=\"my-progress lf\" progress=\""+rate+"\"><div class=\"desc\">性格匹配</div></div-->" +
                        "<div class=\"my-progress rt\" progress=\""+rate+"\"><div class=\"desc\">简历匹配</div></div>" +
                        "</div>" +
                        "</a>";
                }
            } else {
                // 锁定
                me.lock();
                // 无数据
                me.noData();
            }
            $("#job-list").append(html);
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

    //数据填充
    $(".my-progress").each(function(){
        var loaded = $(this).attr("loaded");
        if(!loaded) {
            var progress = $(this).attr("progress");
            circleProgress(this, progress);
        }
        $(this).attr("loaded", true);
    });
}

function circleProgress(obj, progress) {
	var divHeight = obj.offsetHeight;
	var rootSize = (getComputedStyle(window.document.documentElement)['font-size']);
	rootSize = rootSize.substring(0, rootSize.indexOf("px"));
	$(obj).circleProgress({
        value: progress,
        size: divHeight - rootSize * 0.8,
        fill: {
            gradient: ["rgb(30,127,245)", "#3cf5f0"]
        },
        startAngle:Math.PI*0.5,
        reverse:true,
        thickness:6
    });
    
    $(obj).find(".desc")[0].style.width = (divHeight - rootSize * 0.8)+"px";
   
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

function submit() {
    $("#job-list").html("");
    $('.dropload-down').remove();
    var P = new pagination("#content", {});
    P.dropload(function (p, me) {
        search(p, me);
    });
    $("#keyword").blur();
}


