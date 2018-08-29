
$(function(){
	var attachment = {
		init:function(){
			this.loadData();
			this.addAttachment();
		},
		loadData:function(){
			//执行ajax请求
			var url = serverUrl + "/annexs/getDataByUserId/" + user.id;
			utils.get(url, {}, function(result){
				if(result.code==0) {
					var expList = result.data;
					if(expList.length!=0) {
						var html = "";
						for(var i=0; i<expList.length; i++) {
							var exp = expList[i];
							html+="<a href=\"javascript:void(0)\" class=\"no-hope-item small-img\" src=\""+imageUrl + "/" + exp.attachmentUrl+"\"><img src=\"images/attachment.png\"><span>附件"+(i+1)+"："+exp.attachmentName+"</span></a>";
						}
						$("#attachmentList").html(html);
					}
				} else {
					alert(result.message);
				}
				
			});
		},
		addAttachment:function(){
			$("#add-btn").on("click", function(){
				$("#fileupload").trigger("click");
			});

			$("#fileupload").change(function(){
				 var file = $('#fileupload').get(0).files[0];
				 if(file.size > 10 * 1024 * 1024) {
				 	alert("附件大小不能超过10M");
				 	return;
				 }
			     //创建用来读取此文件的对象
			     var reader = new FileReader();
			     //使用该对象读取file文件
			     reader.readAsDataURL(file);
			     //读取文件成功后执行的方法函数
			     reader.onload=function(e){
				     $("#page1").load("addAttachment.html?tt="+Math.random(), function(){
				     	$('#imgshow').get(0).src = e.target.result;
				     	$("#mainPage").hide();
				     	$("#page1").show();
				     });
			 	 }
			});

			$(document).on("click",".small-img", function(e){
        		var url = $(this).attr("src");
        		$(".zhezhao").show();
        		$(".img-preview").show();
        		$("#img-preview").attr("src", url);
        		$("body").on("click", function(){
        			$(".zhezhao").hide();
        			$(".img-preview").hide();
        		});
        	});
		}
	}
	attachment.init();
});

