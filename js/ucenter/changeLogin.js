
$(function(){
    var canClick = true;
	var loginObj = {
		init:function(){
			this.initData();
			this.sendMsg();
			this.change();
		},
		initData:function () {
			var url = serverUrl + "/adminUser/getUserInfo/"+user.id;
			utils.get(url, {}, function (result) {
				$("#current").html(result.data.phone);
            });
        },
        sendMsg:function(){
            $("#vcode_btn").on("click", function(){
                if(canClick == false) {
                    return;
                }
                var mobile = $("#mobile").val();
                if(mobile==null || mobile=='') {
                    alert("请输入您的手机号");
                    return false;
                }

                var reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
                if(!reg.test(mobile)) {
                    alert("手机号不正确");
                    return false;
                }
                $.post(serverUrl + "/sms/send",{phone:mobile}, function(result){
                    console.log(result);
                    if(result.code==0) {
                        var time = 90;
                        var interval = setInterval(function(){
                            if(time==0) {
                                canClick = true;
                                $("#vcode_btn").val("获取验证码");
                                clearInterval(interval);
                            } else {
                                canClick = false;
                                $("#vcode_btn").val(time+"s");
                                time--;
                            }
                        },1000);
                    } else {
                        alert(result.message);
                    }
                });
            });
        },
		change:function(){
			$("#changeBtn").on("click",function(){
				doChange();
			});
		}
	}
    loginObj.init();
});

function doChange() {
	var mobile = $("#mobile").val();
	var vcode = $("#vcode").val();

	if(mobile==null || mobile=='') {
		alert("请输入您的手机号");
		return false;
	}


	if(vcode==null || vcode=='') {
		alert("请输入验证码");
		return false;
	}

    //执行ajax请求
    var url = serverUrl + "/auth/login/code";
    var params = {"phone":mobile, "code":vcode};
    $.ajax({
        type : "POST",
        dataType : "json",
        url : url,
        data : JSON.stringify(params),
        contentType : "application/json;charset=utf-8",
        success : function(result){
            console.log(result);
            if(result.code==0) {
                alert("切换成功");
                localStorage.setItem("accessToken", result.data.token);
                localStorage.setItem("user", JSON.stringify(result.data.user));
                setTimeout(function(){
                    wx_reLaunch("/pages/redirect/redirect?url=index.html");
                },1000);
            } else {
                alert("验证码不正确");
            }
        }
    });

}