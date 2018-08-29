var query = $.getLocationQueryData();
var id = query.id;
var positions;
$(function(){
	var basicInfo;
	var dateStr = getCurrentDateStr();
	var workExp = {
		init:function(){
			this.loadData();
			this.loadJobProp();
			this.loadBonus();
			this.loadPosition();
			this.date();
			this.save();
		},
		loadData:function(){
			if(id) {
				//执行ajax请求
				var url = serverUrl + "/workExperiences/getDataById/" + id;
				utils.get(url, {}, function(result){
					if(result.code==0) {
						var data = result.data;
						if(data.length!=0) {
							basicInfo = data[0];
							positions = data[0].position;
							$("#companyName").val(basicInfo.companyName);

							var startDt = dateFtt(new Date(basicInfo.startDt), "yyyy-MM-dd");
							$("#beginTime_text").html(startDt);
							$("#beginTime").val(startDt);

							var endDt = dateFtt(new Date(basicInfo.endDt), "yyyy-MM-dd");
							$("#endTime_text").html(endDt);
							$("#endTime").val(endDt);

							$("#description").val(basicInfo.description);
							if(basicInfo.position) {
								var positionList = basicInfo.position;
								var position_name = "";
								var position_code = "";
								for(var i=0;i<positionList.length;i++){
									var position = positionList[i];
									position_name += position.name+",";
									position_code += position.code+",";
								} 
								$("#position_name").html(position_name.substring(0,position_name.length-1));
								$("#position_code").val(position_code.substring(0,position_code.length-1));
							}
							
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
		loadJobProp:function(){
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/C_005/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("工作性质数据为空");
					} else {
						var html = "";
						for(var i=0; i<data.list.length; i++) {
							var degree = data.list[i];
							var selected = "";
							if(basicInfo && basicInfo.workType==degree.conditionCode) {
								selected = "selected";
							}
							html += "<option value=\""+degree.conditionCode+"\" "+selected+">"+degree.conditionName+"</option>";
						}
						$("#jobProp").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		loadBonus:function(){
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/B_005/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("薪资待遇数据为空");
					} else {
						var html = "";
						for(var i=0; i<data.list.length; i++) {
							var degree = data.list[i];
							var selected = "";
							if(basicInfo && basicInfo.salary && basicInfo.salary.code==degree.conditionCode) {
								selected = "selected";
							}
							html += "<option value=\""+degree.conditionCode+"\" "+selected+">"+degree.conditionName+"</option>";
						}
						$("#bonus").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		loadPosition:function(){
			$("#page3").load("position.html?tt="+Math.random());
			$("#position-btn").on("click", function(){
				$("#mainPage").hide();
				$("#page3").show();
			});
		},
		date:function(){
			$("#beginTime").on("change", function(){
				$("#beginTime_text").html($("#beginTime").val());
			});
			$("#beginTime").on("focus", function(){
				$("#beginTime_text").html($("#beginTime").val());
			});
			$("#endTime").on("change", function(){
				$("#endTime_text").html($("#endTime").val());
			});
			$("#endTime").on("focus", function(){
				$("#endTime_text").html($("#endTime").val());
			});
		},
		save:function(){
			$("#addExp-btn").on("click", function(){
				var companyName = $("#companyName").val();
				var jobProp = $("#jobProp").val();
				var jobProp_name = $("#jobProp option:selected").text();
				var bonus = $("#bonus").val();
				var bonus_name = $("#bonus option:selected").text();
				var description = $("#description").val();
				var startDt = $("#beginTime_text").html();
				var endDt = $("#endTime_text").html();
				var position_name = $("#position_name").html();
				var position_code = $("#position_code").val();
				if(endDt=="至今") {
					endDt = dateStr;
				}
				if(companyName=='') {
					alert("请输入公司名称");
					return;
				}
				if(startDt=='' || endDt=='') {
					alert("请输入开始时间和结束时间");
					return;
				}
				if(position_name=='' || position_name=='请选择') {
					alert("请选择岗位名称");
					return;
				}
				var position_name_arr = position_name.split(",");
				var position_code_arr = position_code.split(",");
				console.log(position_code_arr);
				var positionArr = [];
				for(var i=0;i<position_code_arr.length;i++) {
					var position = {"code":position_code_arr[i],"name":position_name_arr[i]};
					console.log(position);
					positionArr.push(position);
					console.log(positionArr);
				}
				var bonusObj = {"name":bonus_name,"code":bonus};

				var params = {"id":(id ? id : ""), "userId":user.id, "num":resumeId, "companyName":companyName,"description":description,
							  "workType":jobProp, "startDt":startDt, "endDt":endDt,"salary":bonusObj,"position":positionArr};

				var url = serverUrl + "/workExperiences/edit";//执行更新
				if(!id) {
					url = serverUrl + "/workExperiences/add";//执行新增
				}
				utils.post(url, JSON.stringify(params), function(result){
					if(result.code==0) {
						alert("保存成功");
						setTimeout(function(){
							// location.href = "workExpList.html";
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

