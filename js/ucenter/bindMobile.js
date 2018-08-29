var type=1;//1 登录 2 短信登录 3 注册 4 忘记密码
var query = $.getLocationQueryData();
var urlFrom = query.from;	
$(function(){
	var canClick = true;
	var loginObj = {
		init:function(){
			this.sendMsg();
			this.update();
		},
		sendMsg:function(){
			$("#vcode_btn").on("click", function(){
				if(canClick==false) {
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
					if(result.code==0) {
						var time = 90;
						var interval = setInterval(function(){
							console.log("--"+time);
							if(time==0) {
								$("#vcode_btn").val("获取验证码");
								clearInterval(interval);
								canClick = true;
							} else {
								canClick = false;
								$("#vcode_btn").val(time);
								time--;
							}
						},1000);
					} else {
						alert(result.message);
					}
				});
			});
		},
		update:function(){
			$(".btn").on("click",function(){
				doUpdate();
			});
		}
	}
    loginObj.init();
});

function doUpdate() {
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
	var url = serverUrl + "/adminUser/editUserInfo";
	var params = {"id":user.id, "phone":mobile};
	utils.post(url, JSON.stringify(params), function(result){
		if(result.code==0) {
			alert("修改成功");
			var url = serverUrl + "/adminUser/getUserInfo/"+user.id;
			utils.get(url, {}, function(result){
				if(result.code==0) {
					localStorage.setItem("user", JSON.stringify(result.data));
				}
			});
			setTimeout(function(){
				// location.href = urlFrom || "accountSetting.html";
				wx.miniProgram.navigateBack({
				    delta:1
				});
			}, 2000);
		} else {
			alert(result.message);
		}
	});

}