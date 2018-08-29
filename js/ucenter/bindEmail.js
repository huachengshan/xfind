var type=1;//1 登录 2 短信登录 3 注册 4 忘记密码
var query = $.getLocationQueryData();
var urlFrom = query.from;
$(function(){
	var loginObj = {
		init:function(){
			this.update();
			this.sendMsg();
		},
		sendMsg:function(){
			$("#vcode_btn").on("click", function(){
				var email = $("#email").val();
				if(email==null || email=='') {
					alert("请输入您的邮箱地址");
					return false;
				}

				//验证邮箱地址
			    var reg = /[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+/i;
			    if(!reg.test(email)) {
			        alert("邮箱格式不正确");
			        return false;
			    }
				$.post(serverUrl + "/email/sendVerificationCodeForRegisterEmail",{email:email}, function(result){
					if(result.code==0) {
						alert("验证码已经发送到您的邮箱，请注意查收");
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
	var email = $("#email").val();
	var vcode = $("#vcode").val();

	if(email==null || email=='') {
		alert("请输入您的邮箱地址");
		return false;
	}

	//验证邮箱地址
    var reg = /[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+/i;
    if(!reg.test(email)) {
        alert("邮箱格式不正确");
        return false;
    }

	// if(vcode==null || vcode=='') {
	// 	alert("请输入验证码");
	// 	return false;
	// }

	//执行ajax请求
	var url = serverUrl + "/adminUser/editUserInfo";
	var params = {"id":user.id, "email":email};
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
				// if(urlFrom) {
				// 	wx_navigate("/pages/redirect/redirect?url="+escape(urlFrom));
				// }
				// wx_navigate("/pages/redirect/redirect?url=accountSetting.html");
				wx.miniProgram.navigateBack({
				    delta:1
				});
			}, 2000);
		} else {
			alert(result.message);
		}
	});

}