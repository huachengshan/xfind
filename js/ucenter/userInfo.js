
$(function(){
	var isnew = false;
	var basicInfo;
	var dateStr = getCurrentDateStr();
	var workExp = {
		init:function(){
			loading.show("数据加载中");
			this.loadData();
			this.date();
			this.sex();
			this.loadDegree();
			this.loadCity();
			this.loadArea();
			this.loadCurrentSituation();
			this.loadMaritalStatus();
			this.loadPoliticalStatus();
			this.save();
			this.editMobile();
			this.editEmail();
			loading.hide();
		},
		editMobile:function(){
			$("#my-mobile").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=bindMobile.html");
			});
		},
		editEmail:function(){
			$("#my-email").on("click", function(){
				wx_navigate("/pages/redirect/redirect?url=bindEmail.html");
			});
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/customer/getDataByUserId/" + user.id;
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						isnew = true;
						$("#phone").html(user.phone);
						$("#beginTime").val(dateStr);
					} else {
						basicInfo = data[0];
						$("#phone").html(basicInfo.phone);
						$("#username").val(basicInfo.realName);
						$("#height").val(basicInfo.height);
						$("#homePage").val(basicInfo.homePage);
						$("#email").html(user.email);
						if(basicInfo.nowCity) {
							$("#nowCity_name").val(basicInfo.nowCity.name);
							$("#nowCity_code").val(basicInfo.nowCity.code);
						}
						if(basicInfo.nowArea) {
							$("#nowArea_name").html(basicInfo.nowArea.name);
							$("#nowArea_code").val(basicInfo.nowArea.code);
						}
						if(basicInfo.nowProvince) {
							$("#nowProvince_name").val(basicInfo.nowProvince.name);
							$("#nowProvince_code").val(basicInfo.nowProvince.code);
						}
						if(basicInfo.countyProvince) {
							$("#countyProvince_name").val(basicInfo.countyProvince.name);
							$("#countyProvince_code").val(basicInfo.countyProvince.code);
						}	
						if(basicInfo.countyCity) {
							$("#countyCity_name").val(basicInfo.countyCity.name);
							$("#countyCity_code").val(basicInfo.countyCity.code);
						}	
						if(basicInfo.countyArea) {
							$("#countyArea_name").html(basicInfo.countyArea.name);
							$("#countyArea_code").val(basicInfo.countyArea.code);
						}	
					}
				} else {
					alert(result.message);
				}
				
			});
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
			if(basicInfo && basicInfo.birthday) {
				var birthTimeSecond = basicInfo.birthday;
				var birthday = dateFtt(new Date(birthTimeSecond),'yyyy-MM-dd');
				$("#beginTime_text").html(birthday);
				$("#beginTime").val(birthday);
			}

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
			if(basicInfo && basicInfo.experienceDate) {
				var experienceDateSecond = basicInfo.experienceDate;
				var experienceDate = dateFtt(new Date(experienceDateSecond),'yyyy-MM-dd');
				$("#endTime_text").html(experienceDate);
				$("#endTime").val(experienceDate);
			}
		},
		sex:function(){
			$(".male").on("click", function(){
				var isCheck = $(this).attr("isCheck");
				if(isCheck==0) {
					$(this).find("img").attr("src", "images/male-yes.png");
					$(".female").find("img").attr("src", "images/female-no.png");
					$(this).attr("isCheck", 1);
					$(".female").attr("isCheck",0);
					$("#sex").val("M");
				} else {
					$("#sex").val("F");
				}
			});
			$(".female").on("click", function(){
				var isCheck = $(this).attr("isCheck");
				if(isCheck==0) {
					$(this).find("img").attr("src", "images/female-yes.png");
					$(".male").find("img").attr("src", "images/male-no.png");
					$(this).attr("isCheck", 1);
					$(".male").attr("isCheck",0);
					$("#sex").val("F");
				} else {
					$("#sex").val("M");
				}
			});
			if(basicInfo && basicInfo.sex=='F') {
				$(".female").trigger("click");
			} else {
				$(".mail").trigger("click");
			}
		},
		loadDegree:function(){
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/B_003/1/100";
			utils.get(url,{}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("学历数据为空");
					} else {
						var html = "<option></option>";
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
		loadCity:function(){
			$("#nowCity-btn").on("click", function(){
				$("#cityPage").load("nowCity.html?tt="+Math.random(), function(){
					$("#mainPage").hide();
					$("#cityPage").show();
				});
			});
		},
		loadArea:function(){
			$("#area-btn").on("click", function(){
				$("#areaPage").load("area.html?tt="+Math.random(), function(){
					$("#mainPage").hide();
					$("#areaPage").show();
				});
			});
		},
		loadCurrentSituation:function(){
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/B_012/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("目前状况数据为空");
					} else {
						var html = "";
						for(var i=0; i<data.list.length; i++) {
							var degree = data.list[i];
							var selected = "";
							if(basicInfo && basicInfo.currentSituation && basicInfo.currentSituation.code==degree.conditionCode) {
								selected = "selected";
							}
							html += "<option value=\""+degree.conditionCode+"\" "+selected+">"+degree.conditionName+"</option>";
						}
						$("#currentSituation").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		loadMaritalStatus:function(){
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/C_010/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("婚姻状况数据为空");
					} else {
						var html = "";
						for(var i=0; i<data.list.length; i++) {
							var degree = data.list[i];
							var selected = "";
							if(basicInfo && basicInfo.maritalStatus && basicInfo.maritalStatus.code==degree.conditionCode) {
								selected = "selected";
							}
							html += "<option value=\""+degree.conditionCode+"\" "+selected+">"+degree.conditionName+"</option>";
						}
						$("#maritalStatus").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		loadPoliticalStatus:function(){
			//执行ajax请求
			var url = serverUrl + "/condition/getConditionByType/C_011/1/100";
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("政治面貌数据为空");
					} else {
						var html = "";
						for(var i=0; i<data.list.length; i++) {
							var degree = data.list[i];
							var selected = "";
							if(basicInfo && basicInfo.politicalStatus && basicInfo.politicalStatus.code==degree.conditionCode) {
								selected = "selected";
							}
							html += "<option value=\""+degree.conditionCode+"\" "+selected+">"+degree.conditionName+"</option>";
						}
						$("#politicalStatus").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		save:function(){
			$(".btn").on("click", function(){
				var date = new Date();
				var nowYear = date.getFullYear();
				var username = $("#username").val();
				var sex = $("#sex").val();
				var birthday = $("#beginTime_text").html();
				var experienceDate = $("#endTime_text").html();
				var nowCity_name = $("#nowCity_name").html();
				var nowCity_code = $("#nowCity_code").val();
				var currentSituation = $("#currentSituation").val();
				var currentSituation_name = $("#currentSituation option:selected").text();
				var phone = $("#phone").html();
				var email = $("#email").html();
				var degree = $("#degree").val();
				var degree_name = $("#degree option:selected").text();
				
				var countyProvince_code = $("#countyProvince_code").val();
				var countyProvince_name = $("#countyProvince_name").val();
				var countyCity_code = $("#countyCity_code").val();
				var countyCity_name = $("#countyCity_name").val();
				var countyArea_code = $("#countyArea_code").val();
				var countyArea_name = $("#countyArea_name").html();

				var nowProvince_code = $("#nowProvince_code").val();
				var nowProvince_name = $("#nowProvince_name").val();
				var nowCity_code = $("#nowCity_code").val();
				var nowCity_name = $("#nowCity_name").val();
				var nowArea_code = $("#nowArea_code").val();
				var nowArea_name = $("#nowArea_name").html();

				var height = $("#height").val();
				var maritalStatus = $("#maritalStatus").val();
				var maritalStatus_name = $("#maritalStatus option:selected").text();
				var politicalStatus = $("#politicalStatus").val();
				var politicalStatus_name = $("#politicalStatus option:selected").text();
				var homePage = $("#homePage").val();
				if(username=='') {
					alert("请输入姓名");
					return;
				}
				if(birthday=='') {
					alert("请选择出生日期");
					return;
				}
				if(degree=='') {
					alert("请选择最高学历");
					return;
				}
				if(experienceDate=='') {
					alert("请选择工作时间");
					return;
				}
				if(nowCity_name=='') {
					alert("请选择现居城市");
					return;
				}
				if(countyArea_code=='') {
					alert("请选择户籍/国籍");
					return;
				}
				if(height=='') {
					alert("请输入身高");
					return;
				}
				if(maritalStatus=='') {
					alert("请选择婚姻状况");
					return;
				}
				if(politicalStatus=='') {
					alert("请选择政治面貌");
					return;
				}
				var birthYear = birthday.substring(0,4);
				var age = nowYear - birthYear;
				var experienceYear = experienceDate.substring(0,4);
				var experience = nowYear - experienceYear;
				var params = {"id":isnew?"":basicInfo.id,"realName":username, "userId":user.id,"phone":phone,"experience":experience,
							  "currentSituation":{"code":currentSituation,"name":currentSituation_name},
							  "email":email, "sex":sex, "birthday":birthday,"source":"wechat", "height":height,
							  "maritalStatus":{"name":maritalStatus_name,"code":maritalStatus},
							  "homePage":homePage,"politicalStatus":{"name":politicalStatus_name,"code":politicalStatus},
							  "countyProvince":{"name":countyProvince_name, "code":countyProvince_code},
							  "countyCity":{"name":countyCity_name, "code":countyCity_code},"degree":{"name":degree_name, "code":degree},
							  "countyArea":{"name":countyArea_name, "code":countyArea_code},
							  "nowProvince":{"name":nowProvince_name, "code":nowProvince_code},
							  "nowCity":{"name":nowCity_name, "code":nowCity_code},
							  "nowArea":{"name":nowArea_name, "code":nowArea_code},"age":age, "experienceDate":experienceDate};

				var url = serverUrl + "/customer/edit";//修改
				if(isnew) {
					url = serverUrl + "/customer/add";//执行新增
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

