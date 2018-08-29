var type=1;//1 登录 2 短信登录 3 注册 4 忘记密码
$(function(){
	var loginObj = {
		init:function(){
			this.update();
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
	var oldpwd = $("#oldpwd").val();
	var newpwd = $("#newpwd").val();

	if(oldpwd==null || oldpwd=='') {
		alert("请输入您的旧密码");
		return false;
	}

	if(newpwd==null || newpwd=='') {
		alert("请输入您要设置的新密码");
		return false;
	}
	if(newpwd==oldpwd){
		alert("您输入的新密码与旧密码一致");
		return false;
	}
	var reg=/([a-z]|[A-Z]|\d){6,}$/;
   	var result=reg.test(newpwd);
	if(!result) {
		alert("请设置6位以上英文或字母的密码");
		return false;
	}

	//执行ajax请求
	var url = serverUrl + "/auth/update/password";
	var params = {"userId":user.id, "oldPwd":oldpwd,"newPwd":newpwd,"confirmPwd":newpwd};
	utils.request(url, params, function(result){
		if(result.code==0) {
			alert("修改成功");
			setTimeout(function(){
				// location.href = "accountSetting.html";
				wx.miniProgram.navigateBack({
				    delta:1
				});
			}, 2000);
		} else {
			if(result.message=='密码不正确') {
				alert('您输入的旧密码不正确');
			} else {
				alert(result.message);
			}
		}
	});

}