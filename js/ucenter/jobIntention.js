var positions;
$(function(){
	var basicInfo;
	var isnew = false;
	var workExp = {
		init:function(){
			this.loadData();
			this.loadHopeBonus();
			this.loadJobProp();
			this.loadIndustry();
			this.loadJobDate();
			this.loadSelfEvaluation();
			this.loadCity();
			this.loadPosition();
			this.save();
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/jobIntentions/getDataByUserId/" + user.id;
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						isnew = true;
					} else {
						basicInfo = data[0];
						positions = basicInfo.position;
						console.log(basicInfo);
						$("#label").val(basicInfo.label);
						$("#evaluation").val(basicInfo.evaluation);
						$("#inputed").html(basicInfo.evaluation.length);
						$(".input-tip").html(basicInfo.evaluation.length + "/500");
						if(basicInfo.workProvince) {
							$("#countyProvince_name").val(basicInfo.workProvince.name);
							$("#countyProvince_code").val(basicInfo.workProvince.code);
						}
						if(basicInfo.workCity) {
							$("#countyCity_name").val(basicInfo.workCity.name);
							$("#countyCity_code").val(basicInfo.workCity.code);
						}
						if(basicInfo.workArea) {
							$("#countyArea_name").html(basicInfo.workArea.name);
							$("#countyArea_code").val(basicInfo.workArea.code);
						}
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
						if(basicInfo.industry) {
							$("#industry_name").html(basicInfo.industry.name);
							$("#industry_code").val(basicInfo.industry.code);
						}
						if(basicInfo.salary) {
							$("#salary_min").val(basicInfo.salary.min);
							$("#salary_max").val(basicInfo.salary.max);
						}
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		loadHopeBonus:function(){
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/B_001/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					var html = "<option value=\"\">自定义</option>";
					if(data.length==0) {
						alert("期望薪资数据为空");
					} else {
						for(var i=0; i<data.list.length; i++) {
							var degree = data.list[i];
							var selected = "";
							if(basicInfo && basicInfo.salary && basicInfo.salary.code==degree.conditionCode) {
								selected = "selected";
							}
							html += "<option value=\""+degree.conditionCode+"\" min=\""+degree.minValue+"\" max=\""+degree.maxValue+"\" "+selected+">"+degree.conditionName+"</option>";
						}
						$("#hopeBonus").html(html);

						$("#hopeBonus").change(function(){
							if(this.value=='') {
								$("#cus").show();
							} else {
								$("#cus").hide();
							}
						});
						$("#hopeBonus").trigger("change");
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		loadJobProp:function(){
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/C_005/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("岗位性质数据为空");
					} else {
						var html = "";
						for(var i=0; i<data.list.length; i++) {
							var degree = data.list[i];
							var selected = "";
							if(basicInfo && basicInfo.workType && basicInfo.workType.code==degree.conditionCode) {
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
		loadIndustry:function(){
			$("#industry-btn").on("click", function(){
				$("#page4").load("jobType.html?tt="+Math.random(), function(){
					$("#mainPage").hide();
					$("#page4").show();
				});
			});
		},
		loadJobDate:function(){
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/C_012/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("到岗时间数据为空");
					} else {
						var html = "";
						for(var i=0; i<data.list.length; i++) {
							var degree = data.list[i];
							var selected = "";
							if(basicInfo && basicInfo.jobDate && basicInfo.jobDate.code==degree.conditionCode) {
								selected = "selected";
							}
							html += "<option value=\""+degree.conditionCode+"\" "+selected+">"+degree.conditionName+"</option>";
						}
						$("#jobDate").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		loadSelfEvaluation:function(){
			$("#selfEvaluation").on("click", function(){
				$("#mainPage").hide();
				$("#page2").show();
			});
		},
		loadCity:function(){
			$("#nowCity-btn").on("click", function(){
				$("#areaPage").load("area.html?tt="+Math.random(), function(){
					$("#mainPage").hide();
					$("#areaPage").show();
				});
			});
		},
		loadPosition:function(){
			$("#page3").load("position.html?tt="+Math.random());
			$("#position-btn").on("click", function(){
				$("#mainPage").hide();
				$("#page3").show();
			});
		},
		save:function(){
			$("#jobIntention-btn").on("click", function(){
				var hopeBonus = $("#hopeBonus").val();
				var hopeBonus_name = $("#hopeBonus option:selected").text();
				var min,max;
				if(hopeBonus!='') {
					min = $("#hopeBonus option:selected").attr("min");
					max = $("#hopeBonus option:selected").attr("max");
				} else {
					hopeBonus = '';
					hopeBonus_name = '';
					min = $("#salary_min").val();
					max = $("#salary_max").val();
				}
				var jobProp = $("#jobProp").val();
				var jobProp_name = $("#jobProp option:selected").text();
				var industry_code = $("#industry_code").val();
				var industry_name = $("#industry_name").html();
				var jobDate = $("#jobDate").val();
				var jobDate_name = $("#jobDate option:selected").text();
				var label = $("#label").val().replace("，", ",");
				var evaluation =  $("#evaluation").val();
				var countyProvince_name = $("#countyProvince_name").val();
				var countyProvince_code = $("#countyProvince_code").val();
				var countyCity_name = $("#countyCity_name").val();
				var countyCity_code = $("#countyCity_code").val();
				var countyArea_name = $("#countyArea_name").html();
				var countyArea_code = $("#countyArea_code").val();
				var position_name = $("#position_name").html();
				var position_code = $("#position_code").val();
				if(countyCity_code=='') {
					alert("请选择工作地点");
					return;
				}
				if(position_code=='') {
					alert("请选择岗位类型");
					return;
				}
				if(industry_code=='') {
					alert("请选择行业");
					return;
				}
				var position_name_arr = position_name.split(",");
				var position_code_arr = position_code.split(",");
				var positionArr = [];
				for(var i=0;i<position_code_arr.length;i++) {
					var position = {"code":position_code_arr[i],"name":position_name_arr[i]};
					positionArr.push(position);
				}

				var params = {"id":(basicInfo ? basicInfo.id : ""),"salary":{"name":hopeBonus_name,"code":hopeBonus, "min":min, "max":max}, "userId":user.id,"num":resumeId,
							  "workType":{"code":jobProp,"name":jobProp_name},"industry":{"name":industry_name,"code":industry_code},
							  "jobDate":{"name":jobDate_name,"code":jobDate},"label":label,"evaluation":evaluation, 
							  "workProvince":{"name":countyProvince_name, "code":countyProvince_code},
							  "workArea":{"name":countyArea_name, "code":countyArea_code}, 
							  "workCity":{"name":countyCity_name, "code":countyCity_code},
							  "position":positionArr};

				var url = serverUrl + "/jobIntentions/edit";//执行更新
				if(isnew) {
					url = serverUrl + "/jobIntentions/add";//执行新增
				} 
				utils.post(url, JSON.stringify(params), function(result){
					if(result.code==0) {
						alert("保存成功");
						setTimeout(function(){
							// location.href = "resume.html";
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

