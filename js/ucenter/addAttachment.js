
$(function(){
	var workExp = {
		init:function(){
			this.save();
		},
		save:function(){
			
			$("#save-btn").on("click", function(){
				var attachmentName = $("#attachmentName").val();
				var description = $("#description").val();
				if(attachmentName=='') {
					alert("请输入附件名称");
					return;
				}
				if(description=='') {
					alert("请输入附件描述");
					return;
				}

        		var url = serverUrl + "/uploadFile/uploadImageToQiniu";
        		utils.upload(url, new FormData($("#uploadForm")[0]), function (result) {  
			    	var uri = result.key;
			    	var params = {"attachmentName":attachmentName, "description":description,"attachmentUrl":uri,"userId":user.id,"num":resumeId};
					var url = serverUrl + "/annexs/add";
					utils.post(url, JSON.stringify(params), function(result){
						if(result.code==0) {
							alert("添加成功");
							setTimeout(function(){
								location.href = location.href;
							},2000);
						} else {
							alert(result.message);
						}
						
					},function(){
						alert("系统异常，请稍后重试");
					});
				    
				}); 
			});
		}
	}
	workExp.init();
});

