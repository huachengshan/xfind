document.write("<script type=\"text/javascript\" src=\"https://res.wx.qq.com/open/js/jweixin-1.3.0.js\"></script>");

var serverUrl = "https://api.xfindzp.com";
var imageUrl = "https://tobacco.qitenai.com";
var accessToken;
var user;
var resumeId;
$(function(){
    accessToken = localStorage.getItem("accessToken");
    user = JSON.parse(localStorage.getItem("user"));
    resumeId = localStorage.getItem("resumeId");

	window.alert = function(msg, time){
		$("body").append("<div class=\"common-alert\">"+msg+"</div>");
		var time = time || 1000;
		setTimeout(function(){
			$(".common-alert").remove();
		},time); 
	}

    window.loading = {
        show:function(msg){
            $("body").append("<div class=\"zhezhao\"></div>");
            $("body").append("<div class=\"common-alert\">"+msg+"</div>");
            $(".zhezhao").show();
        },
        hide:function(){
            $(".common-alert").remove();
            $(".zhezhao").remove();
        }
    }

    var commonDialog = {
        init:function(){
            
        },
        entrance:function(){
            var entranceHtml = 
                "<div class=\"dialog-entrance\">"+
                 "<div class=\"dialog-close\" onclick=\"closeDialog(this);\">×</div>"+
                 "<div class=\"dialog-entrance-title\">"+
                    "登录或注册迅聘"+
                 "</div>"+
                 "<div class=\"weixin-entrance\">"+
                    "<img src=\"images/weixin.png\">"+
                    "微信账号快速登录"+
                 "</div>"+
                 "<div class=\"mobile-entrance\">"+
                    "<img src=\"images/phone.png\">"+
                    "注册/登录"+
                 "</div>"+
                 "<div class=\"entrance-xieyi\">"+
                    "注册代表你已同意迅聘用户协议"+
                 "</div>"+
              "</div>"+
              "<div class=\"zhezhao\"></div>";

            $("body").append(entranceHtml);

        },
        open:function(title, content, leftText, rightText, leftCallback, rightCallback){
            var _title = title || "提示";
            var _content = content || "";
            var _leftText = leftText || "取消";
            var _rightText = rightText || "确定";
            <!-- 通用弹框 实际使用时 适当修改文字即可 -->
            var html = "<div class='dialog'>"+
                          "<div class='dialog_shadow_black'></div>"+
                          "<div class='alert_dialog_content'>"+
                             "<div class='dialog_header'>"+title+"</div>"+
                             "<div class='dialog_content_body'>"+
                                _content +
                             "</div>"+
                             "<div class='dialog_footer'>"+
                                "<button class='cancel'>"+_leftText+"</button>"+
                                "<button class='confirm'>"+_rightText+"</button>"+
                             "</div>"+
                          "</div>"+
                       "</div>";
            $("body").append(html);
            $(".cancel").on("click", function(){
                if(leftCallback) {
                    leftCallback();
                }
                $(".dialog").remove();   
            });
            $(".confirm").on("click", function(){
                if(rightCallback) {
                    rightCallback();
                }
                $(".dialog").remove();
            });
        },
        datepick: function(callback){
            var html = 
            "<div class=\"datepick\">" +
                "<div class=\"datepick-cancel\">取消</div><div class=\"datepick-sure\">确定</div>" +
                "<div class=\"datepick-select\">"+
                    "<div class=\"datepick-roll\">" + 
                        "<div class=\"datepick-select-left gear\" data-datetype=\"date_yy\">" +
                            "<div class=\"selector\">";
                                for(var i=1950;i<=2021;i++) {
                                    html += "<div class=\"first\">"+i+"</div>";
                                }
                            html+="</div>" +
                        "</div>" +
                        "<div class=\"datepick-select-right gear\" data-datetype=\"date_mm\">" +
                            "<div class=\"selector\">";
                                for(var i=1;i<=12;i++) {
                                    html += "<div class=\"first\">"+i+"</div>";
                                }
                            html += "</div>" +
                        "</div>" +
                        "<div class=\"guding-left\"></div>" +
                        "<div class=\"guding-right\"></div>" +
                    "</div>" +
                "</div>" +
            "</div>" +
            "<div class=\"zhezhao\"></div>";
            $("body").append(html);

            //内部方法
            var _self = {
                maxY:2021,
                maxM:12,
                maxD:31,
                minY:1950,
                minM:1,
                minD:1
            }

            var date = new Date();
                var dateArr = {
                    yy: date.getFullYear(),
                    mm: date.getMonth() + 1,
                    dd: date.getDate()
                };
            $(".datepick-select-left")[0].setAttribute("val", dateArr.yy);
            $(".datepick-select-right")[0].setAttribute("val", dateArr.mm);
            setDateGearTooth();

            $('.datepick').on('touchmove', function(event) {
                event.preventDefault();
            });
            $(".datepick-select-left")[0].addEventListener("touchstart" ,gearTouchStart);
            $(".datepick-select-left")[0].addEventListener("touchmove" ,gearTouchMove);
            $(".datepick-select-left")[0].addEventListener("touchend" ,gearTouchEnd);
            $(".datepick-select-right")[0].addEventListener("touchstart" ,gearTouchStart);
            $(".datepick-select-right")[0].addEventListener("touchmove" ,gearTouchMove);
            $(".datepick-select-right")[0].addEventListener("touchend" ,gearTouchEnd);
            $(".zhezhao, .datepick-cancel").on("click", function(){
                $(".datepick").remove();
                $(".zhezhao").remove();
            });
            $(".zhezhao, .datepick-sure").on("click", function(){
                var year = $(".datepick-select-left").attr("val");
                var month = $(".datepick-select-right").attr("val");
                callback(year, month)
                $(".datepick").remove();
                $(".zhezhao").remove();
            });


            //触摸开始
            function gearTouchStart(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                clearInterval(target["int_" + target.id]);
                target["old_" + target.id] = e.targetTouches[0].screenY;
                target["o_t_" + target.id] = (new Date()).getTime();
                var top = target.getAttribute('top');
                if (top) {
                    target["o_d_" + target.id] = parseFloat(top.replace(/rem/g, ""));
                } else {
                    target["o_d_" + target.id] = 0;
                }
                target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
            }
            //手指移动
            function gearTouchMove(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                target["new_" + target.id] = e.targetTouches[0].screenY;
                target["n_t_" + target.id] = (new Date()).getTime();
                var rootSize = (getComputedStyle(window.document.documentElement)['font-size']);
                rootSize = rootSize.substring(0, rootSize.indexOf("px"));
                var move_px = target["new_" + target.id] - target["old_" + target.id];
                var move_rem = move_px / rootSize;

                target["pos_" + target.id] = target["o_d_" + target.id] + move_rem;
                target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'rem,0)';
                target.setAttribute('top', target["pos_" + target.id] + 'rem');
                if (e.targetTouches[0].screenY < move_px) {
                    gearTouchEnd(e);
                };
            }
            //离开屏幕
            function gearTouchEnd(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
                if (Math.abs(flag) <= 0.2) {
                    target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
                } else {
                    if (Math.abs(flag) <= 0.5) {
                        target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                    } else {
                        target["spd_" + target.id] = flag / 2;
                    }
                }
                if (!target["pos_" + target.id]) {
                    target["pos_" + target.id] = 0;
                }
                rollGear(target);
            }
            //缓动效果
            function rollGear(target) {
                var d = 0;
                var stopGear = false;

                function setDuration() {
                    target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
                    stopGear = true;
                }
                var passY = _self.maxY - _self.minY + 1;
                clearInterval(target["int_" + target.id]);
                target["int_" + target.id] = setInterval(function() {
                    var pos = target["pos_" + target.id];
                    var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
                    pos += speed;
                    if (Math.abs(speed) > 0.1) {} else {
                        var b = (Math.round(target["pos_" + target.id] / 1.2) * 1.2).toFixed(1);
                        pos = parseFloat(b);
                        setDuration();
                    }
                    if (pos > 1.2) {
                        pos = 1.2;
                        setDuration();
                    }
                    switch (target.dataset.datetype) {
                        case "date_yy":
                            var minTop = 1.2 - (passY - 1) * 1.2;
                            if (pos < minTop) {
                                pos = minTop;
                                setDuration();
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 1.2) / 1.2;
                                setGear(target, _self.minY + gearVal);
                                clearInterval(target["int_" + target.id]);
                            }
                            break;
                        case "date_mm":
                            var date_yy = $(".datepick-select-left")[0];
                            //得到年份的值
                            var yyVal = parseInt(date_yy.getAttribute("val"));
                            var maxM = 12;
                            var minM = 1;
                            var minTop = 1.2 - (maxM - minM) * 1.2;
                            if (pos < minTop) {
                                pos = minTop;
                                setDuration();
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 1.2) / 1.2 + minM;
                                setGear(target, gearVal);
                                clearInterval(target["int_" + target.id]);
                            }
                            break;
                        default:
                    };
                    target["pos_" + target.id] = pos;
                    target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'rem,0)';
                    target.setAttribute('top', pos + 'rem');
                    d++;
                }, 30);
            }
            //控制插件滚动后停留的值
            function setGear(target, val) {
                val = Math.round(val);
                target.setAttribute("val", val);
            }
            //重置日期节点个数
            function setDateGearTooth() {
                var passY = _self.maxY - _self.minY + 1;
                var date_yy = $(".datepick-select-left")[0];
                var itemStr = "";
                if (date_yy && date_yy.getAttribute("val")) {
                    //得到年份的值
                    var year = parseInt(date_yy.getAttribute("val"));
                    var yyVal = passY - (_self.maxY - year) - 1 ;
                    date_yy.style["-webkit-transform"] = 'translate3d(0,' + (1.2 - yyVal * 1.2) + 'rem,0)';
                    date_yy.setAttribute('top', 1.2 - yyVal * 1.2 + 'rem');
                } else {
                    return;
                }
                var date_mm = $(".datepick-select-right")[0];
                if (date_mm && date_mm.getAttribute("val")) {
                    //得到月份的值
                    var mmVal = parseInt(date_mm.getAttribute("val"));
                    var minM = _self.minM;
                    date_mm.style["-webkit-transform"] = 'translate3d(0,' + (1.2 - (mmVal - minM) * 1.2) + 'rem,0)';
                    date_mm.setAttribute('top', 1.2 - (mmVal - minM) * 1.2 + 'rem');
                } else {
                    return;
                }
            }
        }
    }

    var utils = {
        post : function(url, params, func) {
            $.ajax({
                type : "post",
                dataType : "json",
                url : url,
                data : params,
                async : false,
                contentType : "application/json;charset=utf-8",
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Authorization", "xfind " + accessToken);
                },
                success : func
            });
        },
        request : function(url, params, func) {
            $.ajax({
                type : "post",
                dataType : "json",
                url : url,
                data : params,
                async : false,
                contentType:"application/x-www-form-urlencoded",
                beforeSend:function(xhr){
                    if(accessToken){
                       xhr.setRequestHeader("Authorization", "xfind " + accessToken);
                    }
                },
                success : func
            });
        },
        get:function(url, params, func){
            $.ajax({
                type : "get",
                dataType : "json",
                url : url,
                async : false,
                contentType : "application/json;charset=utf-8",
                beforeSend:function(xhr){
                    if(accessToken){
                        xhr.setRequestHeader("Authorization", "xfind " + accessToken);
                    }
                },
                success : func
            });
        },
        upload:function(url, params, func){
            $.ajax({  
                url: url,  
                type: 'POST',  
                cache: false,  
                data: params,  
                processData: false,  
                contentType: false,  
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Authorization", "xfind " + accessToken);
                },
                success: func
            }); 
        },
        delete:function(url, params, func){
            $.ajax({
                type : "delete",
                dataType : "json",
                url : url,
                async : false,
                contentType : "application/json;charset=utf-8",
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Authorization", "xfind " + accessToken);
                },
                success : func
            });
        }
    }

    window.utils = utils;

    window.commonDialog = commonDialog;

    loadFooter();
});


function checkLogin(){
    //登录验证
    var accessToken = localStorage.getItem("accessToken");
    if(accessToken==null || accessToken=='') {
        return false;
    } else {
        return true;
    }
}


var menu_index = 0;
function loadFooter() {
    if($("#footer")) {
        menu_index = $("#footer").attr("index");
        $("#footer").load("footer.html");
    }
}

function closeDialog(obj){
    $(obj).parent().remove();
    $(".zhezhao").remove();
}

function wx_navigate(url) {
    wx.miniProgram.navigateTo({
        url:url
    });
}

function wx_reLaunch(url, redirect) {

    wx.miniProgram.reLaunch({
        url:url
    });
}

function wx_redirect(url, redirect) {
    wx.miniProgram.redirectTo({
        url:url
    });
}

$.getLocationQueryData = function(){
    var query = {};
    var q = location.search.substr(1);   
    var qs = q.split("&");   
    if (qs) {   
        for (var i=0;i<qs.length;i++) {
            var key  = qs[i].substring(0,qs[i].indexOf("="));
            var val = qs[i].substring(qs[i].indexOf("=")+1);
            query[key] = val;   
        }   
    }
    return query;
}

function monthAndDay(second) {
    var date = new Date(second);
    if(date) {
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return month + "." + day; 
    }
    return "";
}

function yearMonthAndDay(second) {
    var date = new Date(second);
    if(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year + "." + month + "." + day; 
    }
    return "";
}

function getCurrentDateStr() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var monthStr;
    if(month<10) {
        monthStr = "0" + month;
    } else {
        monthStr = month;
    }
    var dateStr = date.getFullYear() + "-" + monthStr  + "-" + date.getDate();
    return dateStr;
}

/**************************************时间格式化处理************************************/
function dateFtt(date, fmt)   
{ //author: meizz   
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 