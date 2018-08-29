var query = $.getLocationQueryData();
var id = query.id;

$(function(){
	var basicInfo;
	var dateStr = getCurrentDateStr();
	var workExp = {
		init:function(){
			this.loadData();
			this.date();
			this.save();
		},
		loadData:function(){
			if(id) {
				//执行ajax请求
				var url = serverUrl + "/projectExperiences/getDataById/" + id;
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data;
						if(data.length!=0) {
							basicInfo = data[0];
							$("#companyName").val(basicInfo.companyName);
							$("#projectName").val(basicInfo.projectName);
							
							var startDt = dateFtt(new Date(basicInfo.startDt), "yyyy-MM-dd");
							$("#beginTime_text").html(startDt);
							$("#beginTime").val(startDt);

							var endDt = dateFtt(new Date(basicInfo.endDt), "yyyy-MM-dd");
							$("#endTime_text").html(endDt);
							$("#endTime").val(endDt);

							$("#description").val(basicInfo.description);
						}
					} else {
						alert(result.message);
					}
					
				});
			}  else {
				$("#beginTime").val(dateStr);
				$("#endTime").val(dateStr);
			}
		},
		date:function(){
			$("#beginTime").on("change", function(){
				if($("#beginTime").val()){
					$("#beginTime_text").html($("#beginTime").val());
				}
			});
			$("#beginTime").on("focus", function(){
				if($("#beginTime").val()){
					$("#beginTime_text").html($("#beginTime").val());
				}
			});
			$("#endTime").on("change", function(){
				if($("#endTime").val()){
					$("#endTime_text").html($("#endTime").val());
				}
			});
			$("#endTime").on("focus", function(){
				if($("#endTime").val()){
					$("#endTime_text").html($("#endTime").val());
				}
			});
		},
		save:function(){
			$("#addExp-btn").on("click", function(){
				var companyName = $("#companyName").val();
				var projectName = $("#projectName").val();
				var description = $("#description").val();
				var startDt = $("#beginTime_text").html();
				var endDt = $("#endTime_text").html();
				if(endDt=="至今") {
					endDt = dateStr;
				}
				if(companyName=='') {
					alert("请输入公司名称");
					return;
				}
				if(projectName=='') {
					alert("请输入项目名称");
					return;
				}
				if(startDt=='' || endDt=='') {
					alert("请输入开始时间和结束时间");
					return;
				}

				var params = {"id":(id ? id : ""), "userId":user.id, "num":resumeId, "companyName":companyName,"description":description,
							  "projectName":projectName, "startDt":startDt, "endDt":endDt};


				var url = serverUrl + "/projectExperiences/edit";//执行更新
				if(!id) {
					url = serverUrl + "/projectExperiences/add";//执行新增
				} 
				utils.post(url, JSON.stringify(params), function(result){
					if(result.code==0) {
						alert("保存成功");
						setTimeout(function(){
							// location.href = "projectExpList.html";
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

