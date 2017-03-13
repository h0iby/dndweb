window.Template7=function(){"use strict";function e(e){return"[object Array]"===Object.prototype.toString.apply(e)}function n(e){return"function"==typeof e}function t(e){return"undefined"!=typeof window&&window.escape?window.escape(e):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function r(e){var n,t,r,a=e.replace(/[{}#}]/g,"").split(" "),s=[];for(t=0;t<a.length;t++){var l,d,c=a[t];if(0===t)s.push(c);else if(0===c.indexOf('"')||0===c.indexOf("'"))if(l=0===c.indexOf('"')?o:i,d=0===c.indexOf('"')?'"':"'",2===c.match(l).length)s.push(c);else{for(n=0,r=t+1;r<a.length;r++)if(c+=" "+a[r],a[r].indexOf(d)>=0){n=r,s.push(c);break}n&&(t=n)}else if(c.indexOf("=")>0){var p=c.split("="),f=p[0],u=p[1];if(l||(l=0===u.indexOf('"')?o:i,d=0===u.indexOf('"')?'"':"'"),2!==u.match(l).length){for(n=0,r=t+1;r<a.length;r++)if(u+=" "+a[r],a[r].indexOf(d)>=0){n=r;break}n&&(t=n)}var h=[f,u.replace(l,"")];s.push(h)}else s.push(c)}return s}function a(n){var t,a,i=[];if(!n)return[];var o=n.split(/({{[^{^}]*}})/);for(t=0;t<o.length;t++){var s=o[t];if(""!==s)if(s.indexOf("{{")<0)i.push({type:"plain",content:s});else{if(s.indexOf("{/")>=0)continue;if(s.indexOf("{#")<0&&s.indexOf(" ")<0&&s.indexOf("else")<0){i.push({type:"variable",contextName:s.replace(/[{}]/g,"")});continue}var l=r(s),d=l[0],c=">"===d,p=[],f={};for(a=1;a<l.length;a++){var u=l[a];e(u)?f[u[0]]="false"!==u[1]&&u[1]:p.push(u)}if(s.indexOf("{#")>=0){var h,v="",g="",m=0,x=!1,y=!1,O=0;for(a=t+1;a<o.length;a++)if(o[a].indexOf("{{#")>=0&&O++,o[a].indexOf("{{/")>=0&&O--,o[a].indexOf("{{#"+d)>=0)v+=o[a],y&&(g+=o[a]),m++;else if(o[a].indexOf("{{/"+d)>=0){if(!(m>0)){h=a,x=!0;break}m--,v+=o[a],y&&(g+=o[a])}else o[a].indexOf("else")>=0&&0===O?y=!0:(y||(v+=o[a]),y&&(g+=o[a]));x&&(h&&(t=h),i.push({type:"helper",helperName:d,contextName:p,content:v,inverseContent:g,hash:f}))}else s.indexOf(" ")>0&&(c&&(d="_partial",p[0]&&(p[0]='"'+p[0].replace(/"|'/g,"")+'"')),i.push({type:"helper",helperName:d,contextName:p,hash:f}))}}return i}var i=new RegExp("'","g"),o=new RegExp('"',"g"),s=function(e,n){function t(e,n){return e.content?s(e.content,n):function(){return""}}function r(e,n){return e.inverseContent?s(e.inverseContent,n):function(){return""}}function i(e,n){var t,r,a=0;if(0===e.indexOf("../")){a=e.split("../").length-1;var i=n.split("_")[1]-a;n="ctx_"+(i>=1?i:1),r=e.split("../")[a].split(".")}else 0===e.indexOf("@global")?(n="Template7.global",r=e.split("@global.")[1].split(".")):0===e.indexOf("@root")?(n="root",r=e.split("@root.")[1].split(".")):r=e.split(".");t=n;for(var o=0;o<r.length;o++){var s=r[o];0===s.indexOf("@")?o>0?t+="[(data && data."+s.replace("@","")+")]":t="(data && data."+e.replace("@","")+")":isFinite(s)?t+="["+s+"]":"this"===s||s.indexOf("this.")>=0||s.indexOf("this[")>=0||s.indexOf("this(")>=0?t=s.replace("this",n):t+="."+s}return t}function o(e,n){for(var t=[],r=0;r<e.length;r++)/^['"]/.test(e[r])?t.push(e[r]):/^(true|false|\d+)$/.test(e[r])?t.push(e[r]):t.push(i(e[r],n));return t.join(", ")}function s(e,n){if(n=n||1,e=e||l.template,"string"!=typeof e)throw new Error("Template7: Template must be a string");var s=a(e);if(0===s.length)return function(){return""};var d="ctx_"+n,c="";c+=1===n?"(function ("+d+", data, root) {\n":"(function ("+d+", data) {\n",1===n&&(c+="function isArray(arr){return Object.prototype.toString.apply(arr) === '[object Array]';}\n",c+="function isFunction(func){return (typeof func === 'function');}\n",c+='function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n',c+="root = root || ctx_1 || {};\n"),c+="var r = '';\n";var p;for(p=0;p<s.length;p++){var f=s[p];if("plain"!==f.type){var u,h;if("variable"===f.type&&(u=i(f.contextName,d),c+="r += c("+u+", "+d+");"),"helper"===f.type)if(f.helperName in l.helpers)h=o(f.contextName,d),c+="r += (Template7.helpers."+f.helperName+").call("+d+", "+(h&&h+", ")+"{hash:"+JSON.stringify(f.hash)+", data: data || {}, fn: "+t(f,n+1)+", inverse: "+r(f,n+1)+", root: root});";else{if(f.contextName.length>0)throw new Error('Template7: Missing helper: "'+f.helperName+'"');u=i(f.helperName,d),c+="if ("+u+") {",c+="if (isArray("+u+")) {",c+="r += (Template7.helpers.each).call("+d+", "+u+", {hash:"+JSON.stringify(f.hash)+", data: data || {}, fn: "+t(f,n+1)+", inverse: "+r(f,n+1)+", root: root});",c+="}else {",c+="r += (Template7.helpers.with).call("+d+", "+u+", {hash:"+JSON.stringify(f.hash)+", data: data || {}, fn: "+t(f,n+1)+", inverse: "+r(f,n+1)+", root: root});",c+="}}"}}else c+="r +='"+f.content.replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/'/g,"\\'")+"';"}return c+="\nreturn r;})",eval.call(window,c)}var l=this;l.template=e,l.compile=function(e){return l.compiled||(l.compiled=s(e)),l.compiled}};s.prototype={options:{},partials:{},helpers:{_partial:function(e,n){var t=s.prototype.partials[e];if(!t||t&&!t.template)return"";t.compiled||(t.compiled=new s(t.template).compile());var r=this;for(var a in n.hash)r[a]=n.hash[a];return t.compiled(r,n.data,n.root)},escape:function(e,n){if("string"!=typeof e)throw new Error('Template7: Passed context to "escape" helper should be a string');return t(e)},if:function(e,t){return n(e)&&(e=e.call(this)),e?t.fn(this,t.data):t.inverse(this,t.data)},unless:function(e,t){return n(e)&&(e=e.call(this)),e?t.inverse(this,t.data):t.fn(this,t.data)},each:function(t,r){var a="",i=0;if(n(t)&&(t=t.call(this)),e(t)){for(r.hash.reverse&&(t=t.reverse()),i=0;i<t.length;i++)a+=r.fn(t[i],{first:0===i,last:i===t.length-1,index:i});r.hash.reverse&&(t=t.reverse())}else for(var o in t)i++,a+=r.fn(t[o],{key:o});return i>0?a:r.inverse(this)},with:function(e,t){return n(e)&&(e=e.call(this)),t.fn(e)},join:function(e,t){return n(e)&&(e=e.call(this)),e.join(t.hash.delimiter||t.hash.delimeter)},js:function(e,n){var t;return t=e.indexOf("return")>=0?"(function(){"+e+"})":"(function(){return ("+e+")})",eval.call(this,t).call(this)},js_compare:function(e,n){var t;t=e.indexOf("return")>=0?"(function(){"+e+"})":"(function(){return ("+e+")})";var r=eval.call(this,t).call(this);return r?n.fn(this,n.data):n.inverse(this,n.data)}}};var l=function(e,n){if(2===arguments.length){var t=new s(e),r=t.compile()(n);return t=null,r}return new s(e)};return l.registerHelper=function(e,n){s.prototype.helpers[e]=n},l.unregisterHelper=function(e){s.prototype.helpers[e]=void 0,delete s.prototype.helpers[e]},l.registerPartial=function(e,n){s.prototype.partials[e]={template:n}},l.unregisterPartial=function(e,n){s.prototype.partials[e]&&(s.prototype.partials[e]=void 0,delete s.prototype.partials[e])},l.compile=function(e,n){var t=new s(e,n);return t.compile()},l.options=s.prototype.options,l.helpers=s.prototype.helpers,l.partials=s.prototype.partials,l}();var dnd=dnd||{};!function(){"use strict";dnd.ajax=function(e,n,t){var r=new XMLHttpRequest;r.open("GET",e,!0),r.onload=function(){r.status>=200&&r.status<400?n(r.responseText):t()},r.onerror=function(){t()},r.send()},dnd.selector=function(e,n){if(e=e.trim(),n||(n=document),e.indexOf(" ")===-1){if(0===e.lastIndexOf("."))return n.getElementsByClassName(e.substring(1));if(0===e.lastIndexOf("#"))return n.getElementById(e.substring(1))}return n.querySelectorAll(e)}}();var dnd=dnd||{};!function(){"use strict";dnd.vars=dnd.vars||{},dnd.service=dnd.service||{};var e=function(){console.log("Error loading data")},n=function(n){dnd.ajax(dnd.vars.webservice+"/endpoints",function(t){dnd.service.endpoints=JSON.parse(t),dnd.vars.endpointAmount=1,n&&localStorage.setItem("endpoints",t),dnd.service.endpoints.forEach(function(t,r){t.path.indexOf(":id")==-1&&dnd.ajax(dnd.vars.webservice+t.path,function(e){dnd.vars.endpointAmount=dnd.vars.endpointAmount+1,dnd.service[""+t.alias]=e,n&&localStorage.setItem(t.alias,JSON.stringify(e))},function(){e()},function(){e()})})},function(){e()},function(){e()})},t=function(){dnd.vars.localStorage&&0==localStorage.length?n(!0):dnd.vars.localStorage?(dnd.vars.endpointAmount=1,JSON.parse(localStorage.getItem("endpoints")).forEach(function(e,n){if(e.path.indexOf(":id")==-1){dnd.vars.endpointAmount=dnd.vars.endpointAmount+1;var t=localStorage.getItem(e.alias);dnd.service[""+e.alias]=JSON.parse(t)}})):n(!1)};dnd.initService=function(e){var n=dnd.selector("#Loader");if(dnd.vars.serviceLoaded=!1,dnd.vars.serviceLoadedSpeed="-1",dnd.database){localStorage.clear(),n.style.display="block",t();var r=setInterval(function(){dnd.vars.serviceLoaded&&(clearInterval(r),console.log("json loaded in",dnd.vars.serviceLoadedSpeed),e(),n.classList?n.classList.add("loaded"):n.className+=" loaded")},100)}else n.style.display="none"}}();var dnd=dnd||{};!function(){"use strict";dnd.vars=dnd.vars||{},dnd.service=dnd.service||{},dnd.slider=function(){}}();var dnd=dnd||{};!function(){dnd.vars=dnd.vars||{},dnd.service=dnd.service||{},dnd.vars.webservice="http://localhost:81","undefined"!=typeof Storage?dnd.vars.localStorage=!0:dnd.vars.localStorage=!1,dnd.dataLoaded=function(){console.log("after data has been loaded")},dnd.initService(dnd.dataLoaded)}();