!function(a,c){function v(){var c=f.getBoundingClientRect().width;c/i>540&&(c=540*i);var v=c/10;f.style.fontSize=v+"px",g.rem=a.rem=v}var d,e=a.document,f=e.documentElement,h=e.querySelector('meta[name="viewport"]'),b=e.querySelector('meta[name="flexible"]'),i=0,w=0,g=c.flexible||(c.flexible={});if(h){console.warn("将根据已有的meta标签来设置缩放比例");var l=h.getAttribute("content").match(/initial\-scale=([\d\.]+)/);l&&(w=parseFloat(l[1]),i=parseInt(1/w))}else if(b){var m=b.getAttribute("content");if(m){var n=m.match(/initial\-dpr=([\d\.]+)/),o=m.match(/maximum\-dpr=([\d\.]+)/);n&&(i=parseFloat(n[1]),w=parseFloat((1/i).toFixed(2))),o&&(i=parseFloat(o[1]),w=parseFloat((1/i).toFixed(2)))}}if(!i&&!w){var p=(a.navigator.appVersion.match(/android/gi),a.navigator.appVersion.match(/iphone/gi)),q=a.devicePixelRatio;i=p?q>=3&&(!i||i>=3)?3:q>=2&&(!i||i>=2)?2:1:1,w=1/i}if(f.setAttribute("data-dpr",i),!h)if(h=e.createElement("meta"),h.setAttribute("name","viewport"),h.setAttribute("content","initial-scale="+w+", maximum-scale="+w+", minimum-scale="+w+", user-scalable=no"),f.firstElementChild)f.firstElementChild.appendChild(h);else{var r=e.createElement("div");r.appendChild(h),e.write(r.innerHTML)}a.addEventListener("resize",function(){clearTimeout(d),d=setTimeout(v,300)},!1),a.addEventListener("pageshow",function(a){a.persisted&&(clearTimeout(d),d=setTimeout(v,300))},!1),"complete"===e.readyState?e.body.style.fontSize=12*i+"px":e.addEventListener("DOMContentLoaded",function(){e.body.style.fontSize=12*i+"px"},!1),v(),g.dpr=a.dpr=i,g.refreshRem=v,g.rem2px=function(a){var c=parseFloat(a)*this.rem;return"string"==typeof a&&a.match(/rem$/)&&(c+="px"),c},g.px2rem=function(a){var c=parseFloat(a)/this.rem;return"string"==typeof a&&a.match(/px$/)&&(c+="rem"),c}}(window,window.lib||(window.lib={}));