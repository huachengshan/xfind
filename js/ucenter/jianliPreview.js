
$(function(){
	var preview = {
		init:function(){
			this.loadData();
			this.edit();
			this.refresh();
		}, 
		edit:function(){
			$("#edit").on("click", function(){
				// location.href = "resume.html";
				wx.miniProgram.navigateBack({
				    delta:1
				});
			});
		},
		refresh:function(){
			$("#refresh").on("click", function(){
				location.href = location.href;
			});
		},
		loadData:function() {
			//执行ajax请求
			var url = serverUrl + "/resume/getDataByUserId/" + user.id;
			utils.get(url,{}, function(result){
				if(result.code==0) {
					var data = result.data;
					if(data.length==0) {
						alert("您还没有维护简历，请先前往维护简历", 2000);
					} else {
						console.log(data);
						var date = new Date();
						var nowYear = date.getFullYear(); 

						//基本信息
						var customer = data.customer[0];
						if(customer.avatar) {
							$("#avatar").attr("src", imageUrl + "/" + customer.avatar);
						}
						var nowCity = customer.nowCity.name;
						if(nowCity==null || nowCity=="" || nowCity=="市辖区") {
							nowCity = customer.nowProvince.name;
						}
						var birthday = getDateStr(new Date(customer.birthday));
						$("#username").html(customer.realName);
						$("#sex").html(customer.sex == 'M' ? "男" : "女");
						$("#age").html(customer.age<=18?"未成年":customer.age+"岁");
						$("#birthday").html(birthday);
						$("#marry").html(customer.maritalStatus.name);
						$("#height").html(customer.height+"cm");
						$("#nowCity").html(customer.nowProvince.name);
						var countyProvince = customer.countyProvince.name+"/";
						var countyCity = customer.countyCity.name==null||customer.countyCity.name==""?"":customer.countyCity.name+"/";
						var countyArea = customer.countyArea.name;
						$("#area").html(countyProvince+countyCity+countyArea);
						var phone = customer.phone;
						var mphone = phone.substr(0, 3) + '****' + phone.substr(7); 
						$("#phone").html(mphone);
						var email = customer.email;
						$("#email").html(email);
						$("#degree").html(customer.degree.name);
						$("#currStatus").html(customer.currentSituation.name);

						//求职意向
						var jobIntentions = data.jobIntentions[0];
						if(jobIntentions){
							var workCity = "";
							if(jobIntentions.workProvince.name!='') {
								workCity = jobIntentions.workProvince.name;
							}
							if(jobIntentions.workCity.name!=''&&jobIntentions.workCity.name!="市辖区") {
								workCity += "/"+jobIntentions.workCity.name;
							}
							if(jobIntentions.workArea.name!='') {
								workCity += "/"+jobIntentions.workArea.name;
							}
							$("#workType").html(jobIntentions.workType.name);
							$("#workCity").html(workCity);
							$("#industry").html(jobIntentions.industry.name);
							var positionList = jobIntentions.position;
							var positionStr = "";
							for(var i=0;i<positionList.length;i++) {
								var position = positionList[i];
								if(i==positionList.length-1) {
									positionStr += position.name;
								} else if(position.name!=''){
									positionStr += position.name + "/";
								}
							}
							var salary = jobIntentions.salary.name;
							if(salary==null || salary=="") {
								var min = jobIntentions.salary.min+"";
								var max = jobIntentions.salary.max+"";
								// if(min.indexOf("K")==-1 && min.length>=4) {
								// 	min = min.substring(0, min.length-3)+"K";
								// }
								// if(max.indexOf("K")==-1 && max.length>=4) {
								// 	max = max.substring(0, max.length-3)+"K";
								// }
								salary = min+"k-"+max+"k";
							}
							$("#position").html(positionStr);
							$("#salary").html(salary);
							$("#evaluation").html(jobIntentions.evaluation);
						}

						//工作经验
						var workHtml = "";
						var workList = data.work;
						var startYear = 2018;
						for(var i=0; i<workList.length; i++) {
							var work = workList[i];
							var startDt = getDateStr(new Date(work.startDt));
							var endDt = getDateStr(new Date(work.endDt));
							var year = parseInt(startDt.substring(0, 4));
							if(startYear>year) {
								startYear = year;
							}
							var salary = work.salary.name;
							if(salary==null || salary=="") {
								var min = work.salary.min+"";
								var max = work.salary.max+"";
								if(min.indexOf("K")==-1 && min.length>=4) {
									min = min.substring(0, min.length-3)+"K";
								}
								if(max.indexOf("K")==-1 && max.length>=4) {
									max = max.substring(0, max.length-3)+"K";
								}
								salary = min+"-"+max;
							}
							var positionList = work.position;
							var position_name = "";
							for(var i=0;i<positionList.length;i++){
								var position = positionList[i];
								position_name += position.name+",";
							} 
							position_name = position_name.substring(0,position_name.length-1);
							workHtml += "<div class=\"exp-item\">"+
						                     "<div class=\"time-split\">"+
						                        "<img class=\"dot\" src=\"images/icon-6.png\">"+
						                        "<span>"+startDt+"-"+endDt+"</span>"+
						                     "</div>"+
						                     "<div class=\"content\">"+
						                        "<div class=\"font1\">"+position_name+"</div>"+
						                        "<div class=\"font3\">"+work.companyName+"</div>"+
						                        "<div class=\"font4\">薪资待遇："+salary+"</div>"+
						                        "<div class=\"font5\">"+
						                           work.description +
						                     	"</div>"+
						                	 "</div>"+
						                "</div>";
						} 
						$("#work-container").html(workHtml);
						$("#workYear").html(customer.experience==0?"应届毕业生":customer.experience+"年工作经验");


						//项目经验
						var projectHtml = "";
						var projectList = data.project;
						for(var i=0; i<projectList.length; i++) {
							var project = projectList[i];
							var startDt = getDateStr(new Date(project.startDt));
							var endDt = getDateStr(new Date(project.endDt));
							projectHtml += "<div class=\"exp-item\">"+
						                     "<div class=\"time-split\">"+
						                        "<img class=\"dot\" src=\"images/icon-6.png\">"+
						                        "<span>"+startDt+"-"+endDt+"</span>"+
						                     "</div>"+
						                     "<div class=\"content\">"+
						                        "<div class=\"font1\">"+project.projectName+"</div>"+
						                        "<div class=\"font3\">"+project.companyName+"</div>"+
						                        "<div class=\"font5\">"+
						                           project.description +
						                     	"</div>"+
						                	 "</div>"+
						                "</div>";
						} 
						$("#project-container").html(projectHtml);



						//教育经历
						var eduHtml = "";
						var educationList = data.education;
						for(var i=0; i<educationList.length; i++) {
							var edu = educationList[i];
							var startDt = getDateStr(new Date(edu.startDt));
							var endDt = getDateStr(new Date(edu.endDt));
							eduHtml += "<div class=\"exp-item\">" +
					                     "<div class=\"time-split\">" +
					                        "<img class=\"dot\" src=\"images/icon-6.png\">" +
					                        "<span>"+startDt+"-"+endDt+"</span>" +
					                     "</div>" +
					                     "<div class=\"content\">" +
					                        "<div class=\"font1\">"+edu.schoolName+"</div>" +
					                        "<div class=\"font2\">"+edu.degree.name+"&nbsp;|&nbsp;"+edu.majors.name+"</div>" +
					                     "</div>"+
					                  "</div>";
						}
						$("#edu-container").html(eduHtml);

						//培训经历
						var skillHtml = "";
						var skillList = data.training;
						for(var i=0; i<skillList.length; i++) {
							var skill = skillList[i];
							var startDt = getDateStr(new Date(skill.startDt));
							var endDt = getDateStr(new Date(skill.endDt));
							skillHtml += "<div class=\"exp-item\">"+
						                     "<div class=\"time-split\">"+
						                        "<img class=\"dot\" src=\"images/icon-6.png\">"+
						                        "<span>"+startDt+"-"+endDt+"</span>"+
						                     "</div>"+
						                     "<div class=\"content\">"+
						                        "<div class=\"font1\">"+skill.course+"</div>"+
						                        "<div class=\"font3\">"+skill.mechanism+"</div>"+
						                        "<div class=\"font5\">"+
						                           skill.description +
						                     	"</div>"+
						                	 "</div>"+
						                "</div>";
						} 
						$("#skill-container").html(skillHtml);
						

						$("#container").show();
					}
				} else {
					alert(result.message);
				}
			
			});
		}
	}
	preview.init();
});

