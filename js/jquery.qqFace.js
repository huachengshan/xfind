// QQ表情插件
(function($){  
	$.fn.qqFace = function(options){
		var defaults = {
			id : 'facebox',
			path : 'face/',
			assign : 'content',
			tip : 'em_'
		};
		var option = $.extend(defaults, options);
		var assign = $('#'+option.assign);
		var id = option.id;
		var path = option.path;
		var tip = option.tip;
		
		if(assign.length<=0){
			alert('缺少表情赋值对象。');
			return false;
		}
		
		$(this).click(function(e){
			e.preventDefault();
			assign.blur();
			var strFace, labFace;
			if($('#'+id).length<=0){
				strFace = '<div id="'+id+'" style="position:absolute;display:none;z-index:1000;" class="qqFace">' +
							  '<table border="0" cellspacing="0" cellpadding="0"><tr>';
				for(var i=1; i<=75; i++){
					labFace = '['+tip+i+']';
					strFace += '<td><img src="'+path+i+'.gif" onclick="$(\'#'+option.assign+'\').setCaret();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');" /></td>';
					if( i % 15 == 0 ) strFace += '</tr><tr>';
				}
				strFace += '</tr></table></div>';
			}
			$(this).parent().parent().append(strFace);
			var offset = $(this).position();
			var top = offset.top + $(this).outerHeight();
			$('#'+id).css('top',top);
			$('#'+id).css('left',offset.left);
			$('#'+id).show();
			e.stopPropagation();
		});

		$(document).click(function(){
			$('#'+id).hide();
			$('#'+id).remove();
		});
	};

})(jQuery);

jQuery.extend({ 
unselectContents: function(){ 
	if(window.getSelection) 
		window.getSelection().removeAllRanges(); 
	else if(document.selection) 
		document.selection.empty(); 
	} 
}); 
jQuery.fn.extend({ 
	selectContents: function(){ 
		$(this).each(function(i){ 
			var node = this; 
			var selection, range, doc, win; 
			if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined'){ 
				range = doc.createRange(); 
				range.selectNode(node); 
				if(i == 0){ 
					selection.removeAllRanges(); 
				} 
				selection.addRange(range); 
			} else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())){ 
				range.moveToElementText(node); 
				range.select(); 
			} 
		}); 
	}, 

	setCaret: function(){ 
		if(!$.browser || !$.browser.msie) return; 
		var initSetCaret = function(){ 
			var textObj = $(this).get(0); 
			textObj.caretPos = document.selection.createRange().duplicate(); 
		}; 
		$(this).click(initSetCaret).select(initSetCaret).keyup(initSetCaret); 
	}, 

	insertAtCaret: function(textFeildValue){
		insertHTML(replace_em(textFeildValue), this);
		$(this).keyup();
		
		function replace_em(str){

			str = str.replace(/\</g,'&lt;');

			str = str.replace(/\>/g,'&gt;');

			str = str.replace(/\n/g,'<br/>');

			str = str.replace(/\[em_([0-9]*)\]/g,'<img src="arclist/$1.gif" border="0" />');

			return str;

		}

		function insertHTML(html, obj) {  
           var dthis=obj;//要插入内容的某个div,在标准浏览器中 无需这句话  
            var sel, range;  
            if (window.getSelection)  
             {  
                    // IE9 and non-IE  
                    sel = window.getSelection();  
                    if (sel.getRangeAt && sel.rangeCount) {  
                    range = sel.getRangeAt(0);  
                    range.deleteContents();  
                    var el = document.createElement('div');  
                    el.innerHTML = html;  
                    var frag = document.createDocumentFragment(), node, lastNode;  
                    while ( (node = el.firstChild) )  
                     {  
                        lastNode = frag.appendChild(node);  
                     }  

                range.insertNode(frag);  
                    if (lastNode) {  
                    range = range.cloneRange();  
                    range.setStartAfter(lastNode);  
                    range.collapse(true);  
                    sel.removeAllRanges();  
                    sel.addRange(range);  
                    }  
                   }  
            }   
            else if (document.selection && document.selection.type !='Control')   
            {  
                $(dthis).focus(); //在非标准浏览器中 要先让你需要插入html的div 获得焦点  
         ierange= document.selection.createRange();//获取光标位置  
                ierange.pasteHTML(html);    //在光标位置插入html 如果只是插入text 则就是fus.text="..."  
                $(dthis).focus();      

            }  
       }

	} 
	
	
});
