
$(function(){
	var accountSetting = {
		init:function(){
			this.logout();
			this.editPhone();
			this.editPwd();
			this.editEmail();
			this.loadData();
			this.changeAccount();
		},
		changeAccount:function () {
			$("#account").on("click", function () {
				wx_navigate("/pages/redirect/redirect?url=changeLogin.html");
            });
        },
		editEmail:function(){
			$("#my-email").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=bindEmail.html");
			});
		},
		editPhone:function(){
			$("#my-mobile").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=bindMobile.html");
			});
		},
		editPwd:function(){
			$("#my-pwd").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=updatePassword.html");
			});
		},
		loadData:function(){
			$("#phone, #mobile").html(user.phone);
			$("#email").html(user.email);
		},
		logout:function(){
			$(".btn").on("click", function(){
				localStorage.removeItem("accessToken");
				localStorage.removeItem("user");
				localStorage.removeItem("resumeId");
				setTimeout(function(){
					location.href = "index.html";
				}, 1000);
			});
		}
	}

	accountSetting.init();
});

