
$(function(){
    var query = $.getLocationQueryData();
    var bUserId = query.bUserId;
    var jobId = query.jobId;
    var ws;
    var context;
	var workExpList = {
		init:function(){
            // this.initAudio();
            this.initJob();
			this.initData();
            this.webSocket();
		},
        initJob:function(){
            if(jobId) {
                var userId = user ? user.id : "$null";
                var url = serverUrl + "/positionInfo/getDataById/"+jobId+"/"+userId;
                utils.get(url, {}, function(result){
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
                            var nowCity = job.city.name;
                            if(nowCity==null || nowCity=="" || nowCity=="市辖区") {
                                nowCity = job.province.name;
                            }
                            $("#pro1").attr("progress", rate);
                            $("#pro2").attr("progress", rate);
                            $("#jobName").html(job.jobName);
                            $("#salary").html(salary);
                            $("#city").html(nowCity);
                            $("#education").html(job.education.name);
                            $("#companyName").html(job.enterprise.companyName);
                            $("#jobName").attr("jobId", job.id);
                            if(job.isRequest=="Y") {
                                $("#status").html("您已投递该职位");
                                $("#sendBtn").html("已投递");
                                $("#sendBtn").addClass("sended");
                            } else{
                                $("#status").html("该简历未投递");
                                $("#sendBtn").on("click", function () {
                                    if($(this).html()=='已投递') {
                                        return;
                                    }
                                    var jobName = $("#jobName").html();
                                    var companyName = $("#companyName").html();
                                    var companyId = $("#companyName").attr("companyId");
                                    var url = serverUrl + "/requestRecord/add";
                                    var params = JSON.stringify({"userId":user.id, "resumeSource":"request", "jobCode":job.id,
                                        "jobName":jobName, "companyName":companyName, "companyCode":enterprise.id, "responseState":0,"num":resumeId});
                                    utils.post(url, params, function(result){
                                        if(result.code==0) {
                                            alert("投递成功");
                                            $("#status").html("您已投递该职位");
                                            $("#sendBtn").addClass("sended");
                                            $("#sendBtn").html("已投递");
                                        } else {
                                            alert(result.message);
                                        }
                                    });
                                });
                            }
                        }
                    }
                });
                $("#jobName").on("click", function () {
                    var jobId = $(this).attr("jobId");
                    wx_navigate("/pages/redirect/redirect?url="+escape("jobDetail.html?jobId="+jobId));
                });
            } else {
                $(".header").hide();
            }
        },
        initAudio:function(){
            navigator.getUserMedia =  navigator.getUserMedia||  navigator.webkitGetUserMedia||  navigator.mozGetUserMedia || navigator.msGetUserMedia;//请求麦克风
            if (navigator.getUserMedia) {
                navigator.getUserMedia({audio:true}, function(localMediaStream){
                    context = new AudioContext();
                    var mediaStreamSource = context.createMediaStreamSource(localMediaStream);
                    window.MediaStreamSource = mediaStreamSource;
                }, function(){
                    alert("语音配置失败");
                });
            }else {
                alert("你的浏览器不支持录音");
            }
        },
        webSocket:function(){
            // var url = serverUrl + "userMessage/delete/"+bUserId+"/"+user.id;
            // utils.delete(url,{}, function(result){
            //     console.log(result);
            // });
            if(!window.WebSocket){
                alert('This browser does not supports WebSocket');
                return;
            }
            if(!bUserId) {
                alert("没有找到聊天对象");
                return;
            }
            // 打开一个 web socket
            ws = new WebSocket("wss://api.xfindzp.com/chatServer/"+user.id);

            ws.onopen = function(evt){
                //发送文本数据
                $(".send").on("click", function(){
                    var text = $("#textarea").html();
                    if(text!=null && text.trim()!='') {
                        addContent(text, 1);
                        $("#textarea").html("");
                        $("#textarea").blur();
                        $(".emoji-container").hide();
                        // Web Socket 已连接上，使用 send() 方法发送数据
                        text = myUnescape(text);
                        var message = {"cUserId": user.id,"messageType": "text","sendType": "C","bUserId": bUserId,"messageContent": text};
                        document.body.scrollTop =  document.body.scrollHeight;

                        ws.send(JSON.stringify(message));
                        console.log("文本数据发送中...");
                    }
                });

                //图片上传
                $("#fileupload").change(function(){
                    var url = serverUrl + "/uploadFile/uploadImageToQiniu";
                    utils.upload(url, new FormData($("#uploadForm")[0]), function (result) {  
                        if(result.key) {
                            var uri = result.key;
                            var url = imageUrl + "/" + uri;
                            addContent("<img class=\"small-img\" src=\""+url+"\">", 1);
                            document.body.scrollTop =  document.body.scrollHeight;
                            var message = {"cUserId": user.id,"messageType": "image","sendType": "C","bUserId": bUserId,"messageContent": uri};
                            ws.send(JSON.stringify(message));
                            console.log("图片数据发送中...");
                        } else {
                            alert("上传失败");
                        }
                        
                    }); 
                });

                 //拍照
                $("#camera").change(function(){
                    var url = serverUrl + "/uploadFile/uploadImageToQiniu";
                    utils.upload(url, new FormData($("#cameraForm")[0]), function (result) {  
                        if(result.key) {
                            var uri = result.key;
                            var url = imageUrl + "/" + uri;
                            addContent("<img class=\"small-img\" src=\""+url+"\">", 1);
                            document.body.scrollTop =  document.body.scrollHeight;
                            var message = {"cUserId": user.id,"messageType": "image","sendType": "C","bUserId": bUserId,"messageContent": uri};
                            ws.send(JSON.stringify(message));
                            console.log("拍照图片数据发送中...");
                        } else {
                            alert("上传失败");
                        }
                        
                    }); 
                });

                //快捷消息
                $(".my-btn").on("click", function(){
                    var text = $(".msg-container .msg.active").html();
                    addContent(text, 1);
                    $(".quik-msg .close").trigger("click");
                    document.body.scrollTop =  document.body.scrollHeight;

                    var message = {"cUserId": user.id,"messageType": "text","sendType": "C","bUserId": bUserId,"messageContent": text};
                    ws.send(JSON.stringify(message));
                    console.log("快捷文本数据发送中...");
                });
                
            };

            ws.onmessage = function (evt){ 
               var received_msg = evt.data;
               var msg = JSON.parse(received_msg);
               console.log(msg);
               var sendType = msg.sendType;
               if(sendType=="C") {
                    return;
               }
               var messageType = msg.messageType;
               var text = msg.messageContent;
                if(messageType=='image') {
                    text = "<img class=\"small-img\" src=\""+ imageUrl +"/"+ msg.messageContent+"\">";
                } else if(messageType=='voice') {
                    var audioUrl = imageUrl +"/"+msg.messageContent;
                    text = "<div class=\"voice\">"+
                              "<div class=\"bg\"><div class=\"voicePlay\"></div></div>"+
                           "</div>"+
                           "<audio  controls style=\"display:none;\">"+
                                "<source src=\""+audioUrl+"\"  type=\"audio/x-wav\">"+
                           "</audio>";
                } else if(messageType=="text") {
                } else {
                    return;
                }
                addContent(text, 0);
                document.body.scrollTop =  document.body.scrollHeight;
                console.log("数据已接收...");
            };

            ws.onerror = function (evt){ 
               var received_msg = evt.data;
               console.log(received_msg);
               console.log("数据接收失败...");
            };

            ws.onclose = function(){ 
               // 关闭 websocket
               console.log("连接已关闭..."); 
            };
        },
		initData:function(){
			var isFirstLoading = true;
            var P = new pagination("#content", {});
            P.droploadUp(function (page, me) {
                var url = serverUrl  + "/userMessage/getMessageDetailsByUser";
                var query = {"type":"C", "bUserId":bUserId,"cUserId":user.id, "pageNum":page.page, "pageSize":page.size};
                var params = {"param":JSON.stringify(query)};
                utils.request(url, params, function(result){
                    console.log(result);
                    var msgList = result.data.list;
                    console.log(user);
                    if(result.data.list.length>0) {
                        for (var i =0; i<msgList.length; i++) {
                            var msg = msgList[i];
                            var text = msg.messageContent;
                            text = myEscape(text);
                            if (msg.messageType == 'image') {
                                text = "<img class=\"small-img\" src=\"" + imageUrl + "/" + msg.messageContent + "\">";
                            } else if (msg.messageType == 'voice') {
                                var audioUrl = imageUrl + "/" + msg.messageContent;
                                text = "<div class=\"voice\">" +
                                    "<div class=\"bg\"><div class=\"voicePlay\"></div></div>" +
                                    "</div>" +
                                    "<audio  controls style=\"display:none;\">" +
                                    "<source src=\"" + audioUrl + "\"  type=\"audio/x-wav\">" +
                                    "</audio>";
                            }

                            if (msg.sendType == "C") {
                                preContent(text, 1);
                            } else {
                                preContent(text, 0);
                            }
                        }
                    } else {
                        // 锁定
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                    // 每次数据插入，必须重置
                    me.resetload();
                },function(xhr, type){
                    alert('系统异常，请稍后重试');
                    // 锁定
                    me.lock();
                    // 无数据
                    me.noData();
                    // 即使加载出错，也得重置
                    me.resetload();
                });
                if(isFirstLoading){
                	document.body.scrollTop =  document.body.scrollHeight;
                	isFirstLoading = false;
                }
            });


			//数据填充
			$(".my-progress").each(function(){
				var progress = $(this).attr("progress");
				circleProgress(this, progress);
			});

        	$(".talk").on("click", function(){
        		var src = $(".talk img").attr("src");
        		if(src=='images/talk.png') {
        			// $(".talk img").attr("src", "images/key.png");
        			// $(".input1").hide();
        			// $(".input2").show();
        		} else {
        			// $(".talk img").attr("src", "images/talk.png");
        			// $(".input1").show();
        			// $(".input2").hide();
        			$("#textarea").focus();
        		}
        		
        	});

        	$(".image").on("click", function(){
        		$("#fileupload").trigger("click");
        	});

        	$(".camera").on("click", function(){
        		$("#camera").trigger("click");
        	});

        	$('.emotion').on("click", function(){
        		$(".input1").show();
        		$(".input2").hide();
        	});

        	var preHandler = function(e){
        		var className = e.target.className;
        		if(className.indexOf("content")==-1 && className.indexOf("msg")==-1){
					e.preventDefault();
				}
        	}

        	var scrollTop = 0;
        	$(".input").on("click", function(){
        		$(".zhezhao").show();
        		$(".quik-msg").show();
        		scrollTop = document.body.scrollTop;
        		$("body").addClass("body-cls");
        		document.body.style.top = -scrollTop + 'px';
        	});

        	$(".quik-msg .msg").on("click", function(){
        		$(".quik-msg .msg").removeClass("active");
        		$(this).addClass("active");
        	});

        	$(".quik-msg .close").on("click", function(){
        		$(".zhezhao").hide();
        		$(".quik-msg").hide();
        		$("body").removeClass("body-cls");
        		document.body.scrollTop = scrollTop;
        	});

        	var startY = 0;
        	var moveY = 0;
        	// $(".input2")[0].addEventListener("touchstart", function(e){
        	// 	e.preventDefault();
        	// 	startY = e.targetTouches[0].screenY;
        	// 	$(this).html("松开结束");
        	// 	$(".keydown-dailog .tips").html("手指上滑，取消发送");
        	// 	$(this).addClass("active");
        	// 	$("#tip-img").attr("src", "images/talk-tip.png");
        	// 	$(".keydown-dailog").show();
         //        var rec = new Recorder(MediaStreamSource);
         //        window.rec=rec;
         //        rec.record();
        	// });

        	// $(".input2")[0].addEventListener("touchmove", function(e){
        	// 	moveY = startY - e.targetTouches[0].screenY;
        	// 	if(moveY > 30) {
        	// 		$(this).html("松开手指，取消发送");
        	// 		$(".keydown-dailog .tips").html("松开手指，取消发送");
        	// 		$(".keydown-dailog .tips").addClass("active");
        	// 		$("#tip-img").attr("src", "images/reback.png");
        	// 	} else {
        	// 		$(this).html("松开结束");
        	// 		$(".keydown-dailog .tips").html("手指上滑，取消发送");
        	// 		$(".keydown-dailog .tips").removeClass("active");
        	// 		$("#tip-img").attr("src", "images/talk-tip.png");
        	// 	}
        	// });

        	// $(".input2")[0].addEventListener("touchend", function(e){
        	// 	if(moveY > 30) {
        	// 		$(this).html("按住说话");
        	// 		$(this).removeClass("active");
        	// 		$(".keydown-dailog").hide();
        	// 		$(".keydown-dailog .tips").removeClass("active");
         //            window.rec.stop();
        	// 	} else {
         //            window.rec.stop();
         //            window.rec.exportWAV(function(blob) {
         //                var formData = new FormData();
         //                formData.append("filename", "audio_"+Date.parse(new Date()) + ".wav");  // 文件名
         //                formData.append("file", blob);

         //                var url = serverUrl + "/uploadFile/uploadFileToQiniu";
         //                utils.upload(url, formData, function (result) {  
         //                    console.log(result);
         //                    if(result.key) {
         //                        var uri = result.key;
         //                        var url = imageUrl + "/" + uri;
         //                        // addContent("<img class=\"small-img\" src=\""+url+"\">", 1);
         //                        document.body.scrollTop =  document.body.scrollHeight;
         //                        var message = {"cUserId": user.id,"messageType": "voice","sendType": "C","bUserId": "","messageContent": uri};
         //                        ws.send(JSON.stringify(message));
         //                        console.log("音频数据发送中...");
         //                    } else {
         //                        alert("上传失败");
         //                    }
                            
         //                }); 
         //            });
                    
        	// 		$(this).html("按住说话");
        	// 		$(this).removeClass("active");
        	// 		$(".keydown-dailog").hide();
        	// 		$(".keydown-dailog .tips").removeClass("active");
        	// 	}
        	// });

        	$("#textarea").on("keyup", function(){
        		var value = $(this).html();
        		if(value.length>0) {
        			$(".send").addClass("active");
        		} else {
        			$(".send").removeClass("active");
        		}
        	});

        	$(document).on("click",".small-img", function(e){
        		var url = $(this).attr("src");
        		$(".zhezhao").show();
        		$(".img-preview").show();
        		$("#img-preview").attr("src", url);
        		$("body").on("click", function(){
        			$(".zhezhao").hide();
        			$(".img-preview").hide();
        		});
        	});

		}
	}
	workExpList.init();
});

function preContent(text, type) {
    if(type==0) {
        $(".talk-container").prepend("<div class=\"left-talk\">" +
            "<img class=\"photo\" src=\"images/photo.png\">" +
            "<span class=\"content lf\"><div class=\"lf-tip\"></div>" + text + "</span>" +
            "</div>");
    } else {
        $(".talk-container").prepend("<div class=\"right-talk\">" +
            "<span class=\"content rt\"><div class=\"rt-tip\"></div>" + text + "</span>" +
            "<img class=\"photo\" src=\"images/photo.png\">" +
            "</div>");
    }
}


function addContent(text, type) {
	if(type==0) {
		$(".talk-container").append("<div class=\"left-talk\">" +
										"<img class=\"photo\" src=\"images/photo.png\">" +
										"<span class=\"content lf\"><div class=\"lf-tip\"></div>" + text + "</span>" +
									"</div>");
	} else {
		$(".talk-container").append("<div class=\"right-talk\">" +
										"<span class=\"content rt\"><div class=\"rt-tip\"></div>" + text + "</span>" +
										"<img class=\"photo\" src=\"images/photo.png\">" +
									"</div>");
	}
}

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
 
  


