(function(win,doc,undefined){
    var pagination = function (ele, options) {
    	this.obj = $(ele);
    	this.page = {page:(options.page || 0), size:options.size || 10};
    }
    pagination.prototype ={
        constructor:pagination,
        dropload:function (callback) {
        	if(this.obj) {
        		var _self = this;
	        	var p = this.obj.dropload({
			        scrollArea : window,
			        loadDownFn : function(me){
			        	_self.page.page++;
			        	callback(_self.page, me);
			        }
			    });
	        	return p;
        	}
        },
        droploadUp:function (callback) {
            if(this.obj) {
                var _self = this;
                var p = this.obj.dropload({
                    scrollArea : window,
                    loadDownFn : function(me){
                        _self.page.page++;
                        callback(_self.page, me);
                        me.lock();
                        me.noData();
                        $('.dropload-down').remove();
                    },
                    loadUpFn : function(me){
                        _self.page.page++;
                        callback(_self.page, me);
                    }
                });
                return p;
            }
        }
    }
    win.pagination = pagination;
})(window,document);