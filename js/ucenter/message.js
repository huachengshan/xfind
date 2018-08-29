var itemIndex = 1;
var dropload;
$(function(){
	var jobId;
    var tab1LoadEnd = false;
    var tab2LoadEnd = false;
    var tab3LoadEnd = false;
    var page1 = {page:0,size:10};
    var page2 = {page:0,size:10};
    var page3 = {page:0,size:10};
	var workExpList = {
		init:function(){
			this.initUnRead();
			this.initData();
			this.showWhoseeme();
			this.showChat();
			this.showMessage();
			this.messageDetail();
			this.companyDetail();
			this.dropload();
		},
		dropload:function(){
			console.log(user.id);
			var P = new pagination("#content",{});
            dropload = P.dropload(function (p, me) {
				if(itemIndex==1) {
					page1.page++;
                    postChat(page1, me);
				} else if(itemIndex==2) {
                    page2.page++;
                    postMessage(page2, me);
				} else {
                    page3.page++;
                    postSee(page3, me);
				}
            });
		},
		initUnRead:function () {
			var url = serverUrl + "/systemMessage/getUnreadMessageByUser/"+user.id;
			utils.get(url, {}, function (result) {
				var unread = -1;
				if(result.code==0) {
					unread = result.data.unreadMessageCount;
                    $("#message").find("span").html(unread);
                }
            });
        },
		companyDetail:function(){
			$(document).on("click touchstart", ".see", function(){
				var companyId = $(this).attr("companyId");
				wx_navigate("/pages/redirect/redirect?url="+escape("companyDetail.html?companyId="+companyId));
			});
		},
        showChat:function(){
			$("#chat").on("click", function(){
				itemIndex = 1;
				$("#chat-list").show();
				$("#message-list").hide();
				$("#see-list").hide();
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
		},
		initData:function(){
			$(".tab .tab-item").on("click", function(){
				$(".tab .tab-item").removeClass("active");
				$(this).addClass("active");
			});

			$(document).on("click touchstart", ".chat", function(){
				var bUserId = $(this).attr("bUserId");
				var jobId = $(this).attr("jobId");
				wx_navigate("/pages/redirect/redirect?url="+escape("chat.html?bUserId=" + bUserId+"&jobId="+jobId));
			});
		},
		showWhoseeme:function(){
			$("#see").on("click", function(){
				itemIndex = 3;
				$("#chat-list").hide();
				$("#message-list").hide();
				$("#see-list").show();
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
		},
        showMessage:function(){
			$("#message").on("click", function(){
				itemIndex = 2;
				$("#chat-list").hide();
				$("#message-list").show();
				$("#see-list").hide();
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
		},
		messageDetail:function() {
			$(document).on("click touchstart", ".action", function(){
				var msgId = $(this).attr("msgId");
				var type = $(this).attr("type");
				var targetId = $(this).attr("targetId");
				var url = serverUrl + "/systemMessage/getDataById/"+msgId;
				utils.get(url, {}, function(result){
					if(type=='ResumeBrowse') {
						wx_navigate("/pages/redirect/redirect?url="+escape("companyDetail.html?companyId="+targetId));
					} else {
						wx_navigate("/pages/redirect/redirect?url="+escape("resume.html"));
					}
				});
			});
		}
	}
	workExpList.init();
});

function postChat(page, me) {
	var url = serverUrl + "/userMessage/getDataByType";
	var query = {"pageNum": page.page,"pageSize": page.size,"sendType":"C","code":user.id};
	var params = {"param" : JSON.stringify(query)};
	utils.request(url, params, function(result){
		var list = result.data.list;
		if(list.length>0) {
			var html = "";
			console.log(list);
			for(var i=0;i<list.length;i++) {
				var msg = list[i];
				var lastMsg = msg.lastMessage;
				var company = msg.positionInfo.enterprise;
				var date = getDateStr(new Date(msg.updatedDt));
				var num = msg.cUnreadMessageCount==0?"已读":msg.cUnreadMessageCount+"未读";
				var active = msg.cUnreadMessageCount==0?"":"active";
				html += "<a class=\"myFocus chat\" bUserId=\""+msg.bUserId+"\" jobId=\""+msg.positionInfo.id+"\">"+
					      "<div class=\"photo\">"+
					        "<img src=\"images/photo.png\">"+
					      "</div>"+
					      "<div class=\"company-container\">"+
					        "<div class=\"company\">"+
					          company.companyName+
					        "</div>"+
					        "<div class=\"category\">"+
					  		    "<span class=\"tags\">"+lastMsg.messageContent+"</span>"+
					        "</div>"+
					      "</div>"+
					      "<div class=\"status\">"+
					        "<div class=\"msg-time\">"+date+"</div>"+
					        "<div class=\"msg-status "+active+"\">"+num+"</div>"+
					      "</div>"+
					    "</a> ";
			}
			$("#chat-list").append(html);
		} else {
			// 数据加载完
			if(itemIndex==1) {
                tab1LoadEnd = true;
			} else if(itemIndex==2) {
                tab2LoadEnd = true;
			} else {
                tab3LoadEnd = true;
			}
            // 锁定
            me.lock();
            // 无数据
            me.noData();
		}
		// 每次数据加载完，必须重置
        me.resetload();
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


function postMessage(page, me){
	var url = serverUrl + "/systemMessage/getDataByType";
	var query = {"type":"receiveUser","code":user.id,"pageNum":page.page,"pageSize":page.size};
	var params = {"param":JSON.stringify(query)};
	utils.request(url, params, function(result){
		console.log(result);
		var list = result.data.list;
		if(list.length>0) {
			var html = "";
			// console.log(list);
			for(var i=0; i<list.length; i++) {
				var message = list[i];
				var title = message.messageTitle;
				var target = message.messageTarget;
				var readText = message.isRead=="Y" ? "已读" : "未读";
				var readClass = message.isRead=="Y" ? "" : "active";;

				html += "<div class=\"message\">"+
				          "<div class=\"content\">"+
				            message.messageContent+
				          "</div>"+
				          "<a class=\"action\" type=\""+target.type+"\" targetId=\""+target.id+"\" msgId=\""+message.id+"\">"+
				            "<div class=\"action-name\" >"+title+"</div>"+
                    		"<div class=\"action-status "+readClass+"\" >"+readText+"</div>"+
				            "<img src=\"images/right-arrow.png\">"+
				          "</a>"+
				        "</div>";
			}
			$("#message-list").append(html);
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

function postSee(page, me) {
	var url = serverUrl + "/resumeBrowse/getDataByType";
	var query = {"pageNum": page.page,"pageSize": page.size,"type":"user","code":user.id};
	var params = {"param" : JSON.stringify(query)}
	utils.request(url, params, function(result){
		var list = result.data.list;
		if(list.length>0) {
			var html = "";
			for(var i=0; i<list.length; i++) {
				var see = list[i];
				var enterprise = see.enterpriseInfo;
				html += "<a class=\"see\" companyId=\""+enterprise.id+"\">"+
							enterprise.companyName +
							 "</a>";
			}
			$("#see-list").append(html);
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


