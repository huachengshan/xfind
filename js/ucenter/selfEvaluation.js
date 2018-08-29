
$(function(){
	var evaluation = {
		init:function(){
			this.input();
			this.save();
		},
		input:function(){
			$(".evaluation").on("keyup",function(){
				var text = $("#evaluation").val();
				$(".input-tip").html(text.length + "/500");
			});
		},
		save:function(){
			$(".btn").on("click",function(){
				var text = $("#evaluation").val();
				if(text.length>500) {
					alert("您输入的字数超过限制数量");
					return false;
				}
				$("#inputed").html(text.length);
				$("#mainPage").show();
				$("#page2").hide();
			});
		}
	}
	evaluation.init();
});

