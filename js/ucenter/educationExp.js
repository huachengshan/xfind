var query = $.getLocationQueryData();
var id = query.id;
$(function(){
	var basicInfo;
	var dateStr = getCurrentDateStr();
	var workExp = {
		init:function(){
			this.loadData();
			this.loadDegree();
			this.loadMajors();
			this.date();
			this.save();
		},
		loadData:function(){
			if(id) {
				//执行ajax请求
				var url = serverUrl + "/educationExperiences/getDataById/" + id;
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data;
						if(data.length!=0) {
							basicInfo = data[0];
							$("#schoolName").val(basicInfo.schoolName);
							if(basicInfo.fullTime=='Y') {
								document.getElementById("fullTime").checked = true;
							}
							if(basicInfo.majors) {
								$("#majors").html(basicInfo.majors.name);
								$("#majors_code").val(basicInfo.majors.code);
							}
							
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
			} else {
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
		loadDegree:function(){
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/B_003/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("专业数据为空");
					} else {
						var html = "<option>请选择您的最高学历</option>";
						for(var i=0; i<data.list.length; i++) {
							var degree = data.list[i];
							var selected = "";
							if(basicInfo && basicInfo.degree && basicInfo.degree.code==degree.conditionCode) {
								selected = "selected";
							}
							html += "<option value=\""+degree.conditionCode+"\" "+selected+">"+degree.conditionName+"</option>";
						}
						$("#degree").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		loadMajors:function(){
			$("#majors-btn").on("click", function(){
				$("#page2").load("speciality.html?tt="+Math.random(), function(){
					$("#mainPage").hide();
					$("#page2").show();
				});
			});
		},
		save:function(){
			$("#addExp-btn").on("click", function(){
				var schoolName = $("#schoolName").val();
				var degree = $("#degree").val();
				var degree_name = $("#degree option:selected").text();
				var majors = $("#majors").html();
				var majors_code = $("#majors_code").val();
				var description = $("#description").val();
				var startDt = $("#beginTime_text").html();
				var endDt = $("#endTime_text").html();
				var checked = document.getElementById("fullTime").checked;
				var fullTime = checked ? "Y" : "N";
				if(endDt=="至今") {
					endDt = dateStr;
				}
				if(schoolName=='') {
					alert("请输入学校名称");
					return;
				}
				if(degree=='') {
					alert("请选择您的最高学历");
					return;
				}
				if(startDt=='' || endDt=='') {
					alert("请输入开始时间和毕业时间");
					return;
				}
				if(majors_code=='') {
					alert("请选择您的专业");
					return;
				}

				var params = {"id":(id ? id : ""), "userId":user.id, "num":resumeId, "schoolName":schoolName,"description":description,
							  "degree":{"name":degree_name,"code":degree}, "startDt":startDt, "endDt":endDt,"fullTime":fullTime,
							  "majors":{"name":majors, "code":majors_code}};

				var url = serverUrl + "/educationExperiences/edit";//执行更新
				if(!id) {
					url = serverUrl + "/educationExperiences/add";//执行新增
				} 
				utils.post(url, JSON.stringify(params), function(result){
					if(result.code==0) {
						alert("保存成功");
						setTimeout(function(){
							// location.href = "educationExpList.html";
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

