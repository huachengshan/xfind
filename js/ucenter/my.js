
$(function(){
	var my = {
		init:function(){
			this.initPhoto();
			this.accountSetting();
			this.myFav();
			this.myFocus();
			this.mySend();
			this.myTests();
		},
		initPhoto:function () {
			var resumeId = localStorage.getItem("resumeId");
			if(resumeId) {
                var url = serverUrl + "/customer/getDataByUserId/" + user.id;
                utils.get(url, {}, function(result) {
                    console.log(result);
                    if (result.code == 0) {
                        var data = result.data;
                        if (data.length != 0) {
							$("#photo").attr("src", imageUrl + "/" + data[0].avatar);
							$("#username").html(data[0].realName);
                        } else {
                            $("#username").html("");
						}
                    }
                });
            } else {
				$("#username").html("");
			}
			$("#photo").on("click", function () {
				wx_navigate("/pages/redirect/redirect?url=resume.html");
            });
        },
		myTests:function(){
			$("#myTests").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=myTests.html");
			});
		},
		mySend:function(){
			$("#mySend").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=mySend.html");
			});
		},
		myFav:function(){
			$("#myFav").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=myFav.html");
			});
		},
		myFocus:function(){
			$("#myFocus").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=myFocus.html");
			});
		},
		accountSetting : function() {
			$("#accountSetting").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=accountSetting.html");
			});
		}
	}

	my.init();
});

