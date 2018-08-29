var query = $.getLocationQueryData();
var testing_id = query.testing_id;

var current_question_id,is_last;
$(function(){

	var testing = {
		init:function(){
			this.loadData();
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/front/ajax_testing";
			var query = {"user_id" : user.xyUserId, "testing_id":testing_id};
			var params = {"param" : JSON.stringify(query)};
			utils.request(url,params,function(result){
                console.log(result);
				if(result.code==0) {
					var data = result.data;
					if(data=='is last question') {
                        wx_redirect("/pages/redirect/redirect?url="+escape("testResult.html?testing_id="+testing_id));
						return;
					}
					var category = data.category;
					var question = data.question;
					var rate = parseInt(question.categoryStatistic.answer_num/question.categoryStatistic.total_num * 100);
					$(".progress_inner")[0].style.width = rate + "%";
					$(".per_text").html(rate + "%");
					$("#title1").html("<p>"+question.parent.title+"</p>");
					$("#title2").html(question.title);
					var optionsHtml = "";
					for(var i=0; i<question.options.length; i++) {
						var option = question.options[i];
						optionsHtml += "<div class='answer_item'>"+
						                    "<label class='radiobox1'>"+
						                        "<input type='radio' name='answer1' onclick=\"selectOption('"+option.value+"')\">"+
						                        "<p class='content_box'><span class='checkbox_dot'></span><span class='checkbox_content'>"+option.content+"</span></p>"+
						                    "</label>"+
						                "</div>";
					}

					$("#option_content").html(optionsHtml);
					if(question.is_first) {
						$("#nextBtn").hide();
					}
					current_question_id = question.id;
					is_last = question.is_last;
				} else {
					alert(result.message);
				}
			},function(xhr, type){
                if(xhr.status==0) {
                    testing.loadData();
                }
            });
		}
	}

	testing.init();
});

function selectOption(select_value) {
    setTimeout(function(){
        $("#select_value").val(select_value);
        nextQuestion();
    },300);
    
}

function preQuestion() {
	var url = serverUrl + "/front/ajax_pretest";
	var query = {testing_id:testing_id,current_question_id:current_question_id, user_id:user.xyUserId};
	var params = {"param" : JSON.stringify(query)};
    utils.request(url, params, function(result){
        console.log(result);
        if(result.code==0) {
            var question = result.data.question;
            var category = result.data.category;
            var questionAnswer = result.data.questionAnswer;
            testing_id = category.id;
            current_question_id = question.id;
            is_last = false;
            //按钮
            if(question.is_first) {
                $("#nextBtn").hide();
            } else {
                $("#nextBtn").show();
            }
            //进度条
            var flot = question.categoryStatistic.answer_num/question.categoryStatistic.total_num;
            var percent = parseInt(flot*100)+"%";
            $(".progress_inner").attr("style","width:"+percent);
            $(".per_text").html(percent);
            //问题
            $("#title1").html(question.parent.title);
            $("#title2").html(question.title);
            //选项
            var html = "";
            for(var i=0; i < question.options.length; i++) {
                var option = question.options[i];
                html += "<div class='answer_item' value=\""+option.value+"\">";
                html += "   <label class='radiobox1'>";
                html += "       <input type='radio' name='answer1' onclick='selectOption("+option.value+")'>";
                html += "       <p class='content_box'><span class='checkbox_dot'></span><span class='checkbox_content'>"+option.content+"</span></p>";
                html += "   </label>";
                html += "</div>";
            }
            $("#option_content").html("");
            $("#option_content").append(html);
            $("#select_value").val(questionAnswer.select_value);
            $("#option_content .answer_item[value='"+questionAnswer.select_value+"'] input:radio")[0].checked = true;
        } else {
            alert("提交失败");
        }
    });
}

function nextQuestion() {
    var select_value = $("#select_value").val();
    if(select_value==null || select_value=='') {
        alert("请先选择一项");
        return;
    }
    if(is_last) {
        var prePercent = $(".per_text").html();
        $(".progress_inner").attr("style","width:100%");
        $(".per_text").html("100%");
        commonDialog.open("测评提交后不可修改！","","坚决提交","我再想想",function(){
            var url = serverUrl + "/front/testing";
	    	var query = {"testing_id":testing_id,"current_question_id":current_question_id,"select_value":select_value,"user_id":user.xyUserId};
	    	var params = {"param" : JSON.stringify(query)};
	        utils.request(url, params, function(result){
	            if(result.code==0) {
	            	wx_redirect("/pages/redirect/redirect?url="+escape("testResult.html?testing_id="+testing_id));
	            } else {
	            	alert(result.message);
	            }
	        });
        },function(){
            $(".progress_inner").attr("style","width:"+prePercent);
            $(".per_text").html(prePercent);
        });
    } else {
    	var url = serverUrl + "/front/ajax_testing";
    	var query = {"testing_id":testing_id,"current_question_id":current_question_id,"select_value":select_value,"user_id":user.xyUserId};
    	var params = {"param" : JSON.stringify(query)};
        utils.request(url, params, function(result){
            console.log(result);
            if(result.code==0) {
                $("#select_value").val('');
                var question = result.data.question;
                var category = result.data.category;
                var questionAnswer = result.data.questionAnswer;
                var categoryStatistic = question.categoryStatistic;
                var last_question_id = categoryStatistic.last_question_id;
                var pre_question_id = current_question_id;
                testing_id = category.id;
                current_question_id = question.id;
                is_last = question.is_last && pre_question_id==last_question_id;
                //按钮
                if(question.is_first) {
                    $("#nextBtn").hide();
                } else {
                    $("#nextBtn").show();
                }
                //进度条
                var flot = question.categoryStatistic.answer_num/question.categoryStatistic.total_num;
                var percent = parseInt(flot*100)+"%";
                $(".progress_inner").attr("style","width:"+percent);
                $(".per_text").html(percent);
                //问题
                $("#title1").html(question.parent.title);
                $("#title2").html(question.title);
                //选项
                var html = "";
                for(var i=0; i < question.options.length; i++) {
                    var option = question.options[i];
                    html += "<div class='answer_item' value=\""+option.value+"\">";
                    html += "   <label class='radiobox1'>";
                    html += "       <input type='radio' name='answer1' onclick='selectOption("+option.value+")'>";
                    html += "       <p class='content_box'><span class='checkbox_dot'></span><span class='checkbox_content'>"+option.content+"</span></p>";
                    html += "   </label>";
                    html += "</div>";
                }
                $("#option_content").html("");
                $("#option_content").append(html);
                if(questionAnswer && questionAnswer!=null) {
                    $("#select_value").val(questionAnswer.select_value);
                    $("#option_content .answer_item[value='"+questionAnswer.select_value+"'] input:radio")[0].checked = true;
                }
            } else {
                alert("提交失败");
            }
        });
    }
}



pushHistory();
window.addEventListener("popstate", function(e) {
        history.pushState(null, null, window.location.href)
        window.onpopstate = function (event) {
            history.go(1)
        }
        commonDialog.open("确定要退出吗？","","我手抖","保存并退出",null,function(){
            location.href = "index.html";
        });
}, false);
function pushHistory() {
    var state = {
        title: "title",
        url: "#"
    };
    window.history.pushState(state, "title", "#");
}


