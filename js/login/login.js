var type=1;//1 登录 2 短信登录 3 注册 4 忘记密码
$(function(){
	var canClick = true;
	var interval;
	var loginObj = {
		init:function(){
			this.register();
			this.forget();
			this.login();
			this.mobileLogin();
			this.btnClick();
			this.sendMsg();
			this.inputFocus();
			this.xieyi();
		},
		xieyi:function(){
			$("#xieyi").on("click", function(){
				$("body").append("<div class=\"zhezhao\"></div>");
				$(".xieyi").show();
			});
			$(".xieyi-close").on("click", function(){
				$(".zhezhao").remove();
				$(".xieyi").hide();
			});
		},
		inputFocus: function () {
			var client_h = document.documentElement.clientHeight;
			$(window).on("resize",function(){
				var body_h =  document.body.scrollHeight;
				if(body_h < client_h){
					$(".operate").each(function(){
						if(this.style.display=='block' || this.style.display=='') {
							$(this).addClass("flag-hide");
						}
					});
				}else{
					$(".operate").removeClass("flag-hide");
				}
			});

        },
		register:function(){
			$(".register").on("click",function(){
				$("#account").val("");
				$("#password").val("");
				$("#mobile").val("");
				$("#vcode").val("");
				//展示与隐藏
				$(".title").html("注册迅聘账户");
				$(".login").show();
				$(".register").hide();
				$(".input-label").show();
				$(".forget").hide();
				$("#mobile").show();
				$("#account").hide();
				$("#password").show();
				$(".btn").html("注册");
				$(".reg-xieyi").show();
				$(".mobile-login").hide();
				$(".password-login").hide();
				document.title = "注册";

				canClick = true;
				$("#vcode_btn").val("获取验证码");
				if(interval){clearInterval(interval);}
				type = 3;
			});
		},
		forget:function(){
			$(".forgetpwd").on("click",function(){
				$("#account").val("");
				$("#password").val("");
				$("#mobile").val("");
				$("#vcode").val("");
				//展示与隐藏
				$(".title").html("忘记密码");
				$(".login").show();
				$(".register").hide();
				$(".input-label").show();
				$(".forget").hide();
				$("#mobile").show();
				$("#account").hide();
				$("#password").show();
				$(".btn").html("修改");
				$(".reg-xieyi").hide();
				$(".mobile-login").hide();
				$(".password-login").hide();
				document.title = "忘记密码";
				type = 4;
			});
		},
		login:function(){
			$(".login, .password-login").on("click",function(){
				$("#account").val("");
				$("#password").val("");
				$("#mobile").val("");
				$("#vcode").val("");
				//展示与隐藏
				$(".title").html("登录迅聘");
				$(".login").hide();
				$(".register").show();
				$(".input-label").hide();
				$(".forget").show();
				$("#mobile").hide();
				$("#account").show();
				$("#password").show();
				$(".btn").html("登录");
				$(".reg-xieyi").hide();
				document.title = "登录";
				$(".mobile-login").show();
				$(".password-login").hide();

				canClick = true;
				$("#vcode_btn").val("获取验证码");
				if(interval){clearInterval(interval);}
				type = 1;
			});
		},
		mobileLogin:function(){
			$(".mobile-login").on("click",function(){
				$("#account").val("");
				$("#password").val("");
				$("#mobile").val("");
				$("#vcode").val("");
				//展示与隐藏
				$(".title").html("登录迅聘");
				$(".login").hide();
				$(".register").show();
				$(".input-label").show();
				$(".forget").show();
				$("#mobile").show();
				$("#account").hide();
				$("#password").hide();
				$(".btn").html("登录");
				$(".reg-xieyi").hide();
				document.title = "登录";
				$(".mobile-login").hide();
				$(".password-login").show();

				canClick = true;
				$("#vcode_btn").val("获取验证码");
				if(interval){clearInterval(interval);}
				type = 2;
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
						interval = setInterval(function(){
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
		btnClick:function(){
			$(".btn").on("click", function(){
				if(type==1) {
					doLogin();
				} else if(type==2) {
					doMobileLogin();
				} else if(type==3) {
					doRegister();
				} else if(type==4) {
					doForget();
				}
			});
		}
	}
    loginObj.init();
});

function doLogin() {
	var account = $("#account").val();
	var password = $("#password").val();

	if(account==null || account=='') {
		alert("请输入您的手机号或邮箱账号");
		return false;
	}

	if(password==null || password=='') {
		alert("请输入您的密码");
		return false;
	}

	//执行ajax请求
	var url = serverUrl + "/auth/login/password";
	var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
	var emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
	if(!reg.test(account) && !emailReg.test(account)) {
		alert("用户名或密码不正确");
		return false;
	}
	var params;
    if(reg.test(account)) {
        params = {"phone":account, "password":password};
    } else {
		params = {"email":account, "password":password};
    }
	$.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : JSON.stringify(params),
		contentType : "application/json;charset=utf-8",
		success : function(result){
			console.log(result);
			if(result.code==0) {
				alert("登录成功");
				localStorage.setItem("accessToken", result.data.token);
				localStorage.setItem("user", JSON.stringify(result.data.user));
				setTimeout(function(){
					wx_reLaunch("/pages/redirect/redirect?url=index.html");
				},1000);
			} else {
				alert(result.message);
			}
		},
		error:function(error){
			alert(error.readyState);
		}
	});

}

function doMobileLogin() {
	var mobile = $("#mobile").val();
	var vcode = $("#vcode").val();

	if(mobile==null || mobile=='') {
		alert("请输入您的手机号");
		return false;
	}

	if(vcode==null || vcode=='') {
		alert("请输入您的验证码");
		return false;
	}

	//执行ajax请求
	var url = serverUrl + "/auth/login/code";
	var params = {"phone":mobile, "code":vcode};
	console.log(params);
	$.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : JSON.stringify(params),
		contentType : "application/json;charset=utf-8",
		success : function(result){
			console.log(result);
			if(result.code==0) {
				alert("登录成功");
				localStorage.setItem("accessToken", result.data.token);
				localStorage.setItem("user", JSON.stringify(result.data.user));
				setTimeout(function(){
					wx_navigate("/pages/redirect/redirect?url=index.html");
				},1000);
			} else {
				if(result.message=='手机号不正确'){
					alert('手机号不正确或未注册');
				} else if(result.message=='用户名或者密码错误'){
					alert('手机号或验证码不正确');
				} else {
					alert(result.message);
				}
			}
		}
	});

}

function doRegister() {
	var mobile = $("#mobile").val();
	var vcode = $("#vcode").val();
	var password = $("#password").val();

	if(mobile==null || mobile=='') {
		alert("请输入您的手机号");
		return false;
	}

	var reg = /^1[3|4|5|7|8|9][0-9]{9}$/;
    if(!reg.test(mobile)) {
        alert("手机号不正确");
        return false;
    }

	if(vcode==null || vcode=='') {
		alert("请输入您的验证码");
		return false;
	}

	if(password==null || password=='') {
		alert("请输入您的密码");
		return false;
	}

	//执行ajax请求
	var url = serverUrl + "/auth/register";
	var params = {"code":vcode,"phone":mobile,"type":2, "password":password};
	$.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : JSON.stringify(params),
		contentType : "application/json;charset=utf-8",
		success : function(result){
			if(result.code==0) {
				alert("注册成功");
				setTimeout(function(){
					location.href = "login.html";
				},1000);
			} else {
				alert(result.message);
			}
		}
	});

}


function doForget() {
	var mobile = $("#mobile").val();
	var vcode = $("#vcode").val();
	var password = $("#password").val();

	if(mobile==null || mobile=='') {
		alert("请输入您的手机号");
		return false;
	}

	if(vcode==null || vcode=='') {
		alert("请输入您的验证码");
		return false;
	}

	if(password==null || password=='') {
		alert("请输入您的密码");
		return false;
	}

	//执行ajax请求
	var url = serverUrl + "/auth/phone/forgotPwd";
	var params = {"code":vcode,"phone":mobile, "password":password};
	console.log(params);
	$.ajax({
		type : "POST",
		dataType : "json",
		url : url,
		data : params,
		success : function(result){
			if(result.code==0) {
				alert("修改成功");
				setTimeout(function(){
					location.href = "login.html";
				},1000);
			} else {
				alert(result.message);
			}
		}
	});

}