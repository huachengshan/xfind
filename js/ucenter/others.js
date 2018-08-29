var query = $.getLocationQueryData();
var id = query.id;

$(function(){
	var basicInfo;
	var workExp = {
		init:function(){
			this.loadData();
			this.save();
		},
		loadData:function(){
			if(id) {
				//执行ajax请求
				var url = serverUrl + "/others/getDataById/" + id;
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data;
						if(data.length!=0) {
							basicInfo = data[0];
							$("#title").val(basicInfo.title);
							$("#description").val(basicInfo.description);
						}
					} else {
						alert(result.message);
					}
					
				});
			}
		},
		save:function(){
			$("#addExp-btn").on("click", function(){
				var title = $("#title").val();
				var description = $("#description").val();
				if(title=='') {
					alert("请输入主题");
					return;
				}
				if(description=='') {
					alert("请输入相关描述");
					return;
				}

				var params = {"id":(id ? id : ""), "userId":user.id, "num":resumeId, "title":title,"description":description};

				var url = serverUrl + "/others/edit";//执行更新
				if(!id) {
					
					url = serverUrl + "/others/add";//执行新增
					
				} 
				utils.post(url, JSON.stringify(params), function(result){
					if(result.code==0) {
						alert("保存成功");
						setTimeout(function(){
							// location.href = "othersList.html";
							wx.miniProgram.navigateBack({
							    delta:1
							});
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

