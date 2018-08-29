
$(function(){
	var isnew = false;
	var basicInfo;
    var companyId = null;
	var workExp = {
		init:function() {
			this.initData();
            this.save();
            this.addshield();
            this.saveShield();
            this.inputName();
            this.deleteShield();
        },
        deleteShield:function(){
            $(document).on("click", ".delete", function(){
                $(this).parent().remove();

                var shieldingEnterprise = "";
                $(".no-hope-item .text").each(function(){
                    shieldingEnterprise += $(this).html()+",";
                });
                shieldingEnterprise = shieldingEnterprise.substring(0, shieldingEnterprise.length-1);

                var url = serverUrl + "/customer/edit";//修改
                var params = {"id":basicInfo.id, "userId":user.id,"shieldingEnterprise":shieldingEnterprise};
                utils.post(url, JSON.stringify(params), function(result){
                        if(result.code==0) {
                            alert("删除成功");
                        } else {
                            alert(result.message);
                        }
                    });
            });
        },
        inputName:function(){
            $("#shieldName").on("keyup", function(){
                companyId = null;
                var text = $(this).val();
                if(text.trim()!="") {
                    var url = serverUrl + "/enterprise/getAllDataBySearch";
                    var params = {"searchValue":text ,"pageNum":1, "pageSize":10};
                    var param = {"param" : JSON.stringify(params)}
                    console.log(param);
                    utils.request(url, param, function(result){
                        // console.log(result);
                        if(result.code==0) {
                            var list = result.data.list;
                            var html = "";
                            for(var i=0; i<list.length; i++) {
                                var enterprise = list[i];
                                html += "<a class=\"enterpriseItem\" companyId=\""+enterprise.id+"\">"+enterprise.companyName+"</a>";
                            }
                            $("#enterpriseList").html(html);
                        }
                    });
                }
            });

            
            $(document).on("click", ".enterpriseItem", function(){
                $("#shieldName").val($(this).html());
                $("#enterpriseList").html("");
                companyId = $(this).attr("companyId");
            });
        },
        saveShield:function(){
            $("#shieldBtn").on("click", function(){
                if(companyId==null) {
                    alert("该企业不存在或没有注册");
                    return;
                }
                var shieldName = $("#shieldName").val();
                if(shieldName) {
                    var shieldingEnterprise = "";
                    $(".no-hope-item .text").each(function(){
                        shieldingEnterprise += $(this).html()+",";
                    });
                    if((","+shieldingEnterprise).indexOf(shieldName)!=-1) {
                        alert("该企业已添加，请勿重复添加");
                        return false;
                    }
                    shieldingEnterprise += shieldName;
                    var url = serverUrl + "/customer/edit";//修改
                    if(isnew) {
                        url = serverUrl + "/customer/add";//执行新增
                    }
                    var params = {"id":isnew?"":basicInfo.id, "userId":user.id,"shieldingEnterprise":shieldingEnterprise};
                    utils.post(url, JSON.stringify(params), function(result){
                        if(result.code==0) {
                            isnew = false;
                            alert("添加成功");
                            setTimeout(function(){
                                $("#mainPage").show();
                                $("#page").hide();
                                $("#shieldName").val("");
                                $(".no-hope").append("<div class=\"no-hope-item\"><span class=\"text\">"+shieldName+"</span><span class=\"delete\">删除</span></div>");
                            },1000);
                        } else {
                            alert(result.message);
                        }
                    });
                } else {
                    alert("输入需要屏蔽的企业名称");
                }
            });
        },
        addshield:function(){
            $("#resumeState").on("change", function(e){
                var resumeState = $(this).val();
                if(resumeState=='open') {
                    $(".shield").show();
                } else {
                    $(".shield").hide();
                }
            });
            $("#addshield").on("click", function(){
                $("#mainPage").hide();
                $("#page").show();
            });
        },
		initData:function(){
            //执行ajax请求
            var url = serverUrl + "/customer/getDataByUserId/" + user.id;
            utils.get(url, {}, function(result) {
                if (result.code == 0) {
                    var data = result.data;
                    if (data.length != 0) {
                    	isnew = false;
                    	basicInfo = data[0];
						$("#resumeName").val(data[0].resumeName);
						$("#resumeState").val(data[0].resumeState);
                        if(basicInfo.shieldingEnterprise) {
                            var shildingList = basicInfo.shieldingEnterprise.split(",");
                            console.log(shildingList);
                            var html = "";
                            for(var i=0; i<shildingList.length; i++) {
                                if(shildingList[i]!=null && shildingList[i]!="") {
                                    html += "<div class=\"no-hope-item\"><span class=\"text\">"+shildingList[i]+"</span><span class=\"delete\">删除</span></div>";
                                }
                            }
                            $(".no-hope").html(html);
                        }
                        if(data[0].resumeState=='open') {
                            $(".shield").show();
                        }
                    }
                } else {
                	isnew = true;
				}
            });
		},
		save:function(){
			$("#save").on("click", function () {
                var name = $("#resumeName").val();
                var resumeState = $("#resumeState").val();
                var url = serverUrl + "/customer/edit";//修改
                if(isnew) {
                    url = serverUrl + "/customer/add";//执行新增
                }
                var params = {"id":isnew?"":basicInfo.id, "userId":user.id,"resumeName":name,"resumeState": resumeState};
                utils.post(url, JSON.stringify(params), function(result){
                    if(result.code==0) {
                        alert("保存成功");
                        setTimeout(function(){
                            // location.href = "resume.html"
                            wx_reLaunch("/pages/redirect/redirect?url=resume.html");
                        },1000);
                    } else {
                        alert(result.message);
                    }
                });
            });

		}
	}
	workExp.init();
});

