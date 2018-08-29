
$(function(){
	var isnew = false;
	var basicInfo;
	var resume = {
		init:function(){
			this.loadResume();
			this.resumeName();
			this.uploadPhoto();
			this.basicInfo();
			this.jobIntention();
			this.educationExpList();
			this.workExpList();
			this.projectExpList();
			this.skillExpList();
			this.refresh();
			this.preview();
			this.others();
			this.attachment();
			this.resumeSet();
		},
		resumeSet:function(){
			$("#resumeSet").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=jianliSet.html");
			});
		},
		resumeName:function(){
			$("#resumeName").on("click", function() {
                wx_navigate("/pages/redirect/redirect?url=jianliSet.html&refresh=true");
			});

			// $("#name-btn").on("click", function(){
			// 	var name = $("#name").val();
			// 	if(!name) {
			// 		alert("请输入简历名称");
			// 	}
			// 	$("#resumeName").val(name);
			// 	var params = {"id":isnew?"":basicInfo.id, "userId":user.id,"resumeName":name,"resumeState": isnew ? "open" : null};
            //
			// 	var url = serverUrl + "/customer/edit";//修改
			// 	if(isnew) {
			// 		url = serverUrl + "/customer/add";//执行新增
			// 	}
			// 	utils.post(url, JSON.stringify(params), function(result){
			// 		if(result.code==0) {
			// 			alert("保存成功");
			// 			setTimeout(function(){
			// 				$("#mainPage").show();
			// 				$("#namePage").hide();
			// 			},1000);
			// 		} else {
			// 			alert(result.message);
			// 		}
			// 	});
			// });
		},
		attachment:function(){
			$("#attachment").on("click", function(){
				if(isnew) {
					alert("请先完善基本信息");
			 	} else {
					wx_navigate("/pages/redirect/redirect?url=attachment.html");
				}
			});
		},
		others:function(){
			$("#others").on("click", function(){
				if(isnew) {
					alert("请先完善基本信息");
			 	} else {
					wx_navigate("/pages/redirect/redirect?url=othersList.html&refresh=true");
				}
			});
		},
		preview:function(){
			$("#preview").on("click", function(){
				if(isnew) {
					alert("请先完善基本信息");
			 	} else {
					wx_navigate("/pages/redirect/redirect?url=jianliPreview.html");
				}
			});
		},
		refresh:function(){
			$("#refresh").on("click", function(){
				location.href = location.href;
			});
		},
		loadResume:function(){
			//执行ajax请求
			var url = serverUrl + "/resume/getDataByUserId/" + user.id;
			utils.get(url,{},function(result){
				if(result.code==0) {
					var data = result.data;
					console.log(data);
					if(data.length==0 || data.customer.length==0) {
						$("#username").hide();
						$("#upload-photo").show();
						$("#percent").html("0%");
						$("#basicInfo").html("待完善");
						$("#basicInfo").addClass("active");
						$("#qzyx").html("待完善");
						$("#qzyx").addClass("active");
						$("#jyjl").html("待完善");
						$("#jyjl").addClass("active");
						$("#gzjl").html("待完善");
						$("#gzjl").addClass("active");
						$("#xmjy").html("待完善");
						$("#xmjy").addClass("active");
						$("#jnpx").html("待完善");
						$("#jnpx").addClass("active");
						$("#qt").html("待完善");
						$("#qt").addClass("active");
						$("#fj").html("待完善");
						$("#fj").addClass("active");
						isnew = true;
					} else {
						var percent = 0;
						$("#username").show();
						$("#username").html(data.customer[0].realName);
						$("#upload-photo").hide();
						$("#resumeName").val(data.customer[0].resumeName);
						$("#name").val(data.customer[0].resumeName);
						if(data.customer[0].avatar) {
							$("#photo").attr("src", imageUrl + "/" + data.customer[0].avatar);
						}
						$("#btn-gro").show();
						if(data.customer.length==0) {
							$("#basicInfo").html("待完善");
							$("#basicInfo").addClass("active");
						} else {
							$("#basicInfo").html("完善");
							percent += 10;
						}
						if(data.jobIntentions.length==0) {
							$("#qzyx").html("待完善");
							$("#qzyx").addClass("active");
						} else {
							$("#qzyx").html("完善");
							percent += 10;
						}
						if(data.education.length==0) {
							$("#jyjl").html("待完善");
							$("#jyjl").addClass("active");
						} else {
							$("#jyjl").html("完善");
							percent += 10;
						}
						if(data.work.length==0) {
							$("#gzjl").html("待完善");
							$("#gzjl").addClass("active");
						} else {
							$("#gzjl").html("完善");
							percent += 10;
						}
						if(data.project.length==0) {
							$("#xmjy").html("待完善");
							$("#xmjy").addClass("active");
						} else {
							$("#xmjy").html("完善");
							percent += 10;
						}
						if(data.training.length==0) {
							$("#jnpx").html("待完善");
							$("#jnpx").addClass("active");
						} else {
							$("#jnpx").html("完善");
							percent += 10;
						}
						if(data.others.length==0) {
							$("#qt").html("待完善");
							$("#qt").addClass("active");
						} else {
							$("#qt").html("完善");
							percent += 10;
						}
						if(data.annexs.length==0) {
							$("#fj").html("待完善");
							$("#fj").addClass("active");
						} else {
							$("#fj").html("完善");
							percent += 10;
						}
						$("#percent").html(percent+"%");
						localStorage.setItem("resumeId", data.customer[0].num);
						basicInfo = data.customer[0];
					}
				} else {
					alert(result.message);
				}
				
			});

		},
		uploadPhoto:function(){
			$("#photo").on("click", function(){
				if(isnew) {
					alert("请先完善基本信息");
			 	} else {
					$("#fileupload").trigger("click");
				}
			});

			//图片上传
        	$("#fileupload").change(function(){
        		var url = serverUrl + "/uploadFile/uploadImageToQiniu";
        		utils.upload(url, new FormData($("#uploadForm")[0]), function (result) {  
			    	var uri = result.key;
			    	var url = imageUrl + "/" + uri;
			    	$("#photo").attr("src", url);
			    	//执行更新头像
					var url = serverUrl + "/customer/edit";
					var params = JSON.stringify({"avatar" : uri, "id":basicInfo.id, "userId":basicInfo.userId});
					utils.post(url, params, function(result){
						if(result.code==0) {
							alert("修改头像成功");
						} else {
							alert(result.message);
						}
					});
				    
				}); 
        	});
		},
		basicInfo:function(){
			$("#basicInfoEdit").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=userInfo.html");
			});
		},
		jobIntention:function(){
			$("#jobIntention").on("click", function(){
				if(isnew) {
					alert("请先完善基本信息");
			 	} else {
					wx_navigate("/pages/redirect/redirect?url=jobIntention.html");
			 	}
			});
		},
		educationExpList:function(){
			$("#educationExpList").on("click", function(){
				if(isnew) {
					alert("请先完善基本信息");
			 	} else {
					wx_navigate("/pages/redirect/redirect?url=educationExpList.html&refresh=true");
				}
			});
		},
		workExpList:function(){
			$("#workExpList").on("click", function(){
				if(isnew) {
					alert("请先完善基本信息");
			 	} else {
					wx_navigate("/pages/redirect/redirect?url=workExpList.html&refresh=true");
				}
			});
		},
		projectExpList:function(){
			$("#projectExpList").on("click", function(){
				if(isnew) {
					alert("请先完善基本信息");
			 	} else {
					wx_navigate("/pages/redirect/redirect?url=projectExpList.html&refresh=true");
				}
			});
		},
		skillExpList:function(){
			$("#skillExpList").on("click", function(){
				if(isnew) {
					alert("请先完善基本信息");
			 	} else {
					wx_navigate("/pages/redirect/redirect?url=skillExpList.html&refresh=true");
				}
			});
		}
	}

	resume.init();
});

