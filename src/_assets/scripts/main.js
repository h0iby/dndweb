var dnd=dnd||{};!function(){"use strict";dnd.ajax=function(e,t,n,d){var a=new XMLHttpRequest;a.open("GET",t),a.onload=function(){e||(a.status>=200&&a.status<400?n(a.responseText):d())},a.onloadend=function(){e&&(a.status>=200&&a.status<400?n(a.responseText):d())},a.onerror=function(){d()},a.send()},dnd.selector=function(e,t){if(e=e.trim(),t||(t=document),e.indexOf(" ")===-1){if(0===e.lastIndexOf("."))return t.getElementsByClassName(e.substring(1));if(0===e.lastIndexOf("#"))return t.getElementById(e.substring(1))}return t.querySelectorAll(e)},dnd.replaceAll=function(e,t,n){return e.replace(new RegExp(t,"g"),n)},dnd.appendTo=function(e,t){e.insertAdjacentHTML("beforeend",t)},dnd.addEventHandler=function(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent&&e.attachEvent("on"+t,n)},dnd.setHash=function(e,t){var n=""!=t?e+"="+t.toLowerCase():"",d=window.location.hash.substring(1),a="#"+d;if(history.pushState)if(""!=t){if(d.indexOf(e)<0)a.length>1&&(a+="&"),a+=n;else if(d.indexOf("&")<0)a="#"+n;else{var i=d.substring(d.indexOf(e)),r=i;i.indexOf("&")>-1&&(r=i.substring(0,i.indexOf("&"))),a=a.replace(r,n)}history.pushState(null,null,a)}else if(d.indexOf("&")<0)d.indexOf(e)>-1&&history.pushState(null,null," ");else{var i=d.substring(d.indexOf(e)),r=i;i.indexOf("&")>-1&&(r=i.substring(0,i.indexOf("&"))),a=a.replace("#"+r+"&","#"),a=a.replace("&"+r,""),history.pushState(null,null,a)}}}();var dnd=dnd||{};!function(){"use strict";var e=function(){var e=window.location.hash.substring(1);if(""!=e&&null!=e){var t=document.getElementsByClassName("filter__toggle");t&&(t[0].checked=!0)}},t=function(){var e=0,t=document.getElementById("Header");t.offsetHeight+5;window.onscroll=function(){window.pageYOffset<e?t.classList.remove("is-hidden"):t.classList.add("is-hidden"),e=window.pageYOffset}};dnd.navigation=function(){t(),e()}}();var dnd=dnd||{};!function(){"use strict";dnd.vars=dnd.vars||{},dnd.service=dnd.service||{};var e=function(e,t){var n=e;if(n)for(var d=n.options,a=0;a<d.length;a++){var i=d[a];i.value==t.toString()&&(n.selectedIndex=a)}},t=function(e,t){var n=e;n.value=t},n=function(e,t){dnd.setHash(e,t)},d=function(n){for(var d=window.location.hash.substring(1).split("&"),a=0;a<d.length;a++){var i=d[a].split("="),r=document.getElementById(i[0]);if(r)switch(r.tagName.toLowerCase()){case"select":e(r,i[1]);break;default:t(r,i[1])}}},a=function(e){var t=dnd.service[e.getAttribute("data-type")],a=e.getAttribute("id"),i=document.createElement("option"),r=t.length;if(e.hasAttribute("data-loaded")||(i.value="",i.innerHTML="",e.appendChild(i)),r>0){if(!e.hasAttribute("data-loaded")){e.setAttribute("data-loaded","true");for(var o=0;o<t.length;o++){var l=document.createElement("option");l.value=t[o].slug,l.innerHTML=t[o].name,e.appendChild(l)}e.addEventListener("change",function(){var t=this,d=t.options[t.selectedIndex].value;n(a,d),dnd.templates(document.getElementsByClassName("-js-template--"+e.getAttribute("data-target"))[0])})}d()}},i=function(e,t){var n=dnd.selector(".section__filter")[0],d=t.toLowerCase();e.setAttribute("data-type",d),e.setAttribute("data-item",d),e.setAttribute("data-endpoint","/"+d),n.hasAttribute("data-loaded")?a(e):dnd.data(e,a)},r=function(e){var t=document.getElementById("filter"+e);if(t){var n=e.toLowerCase(),d=dnd.service[n];null==d?i(t,e):a(t)}},o=function(e){var t=document.getElementById("filter"+e);if(t){var a;t.hasAttribute("data-loaded")||(t.setAttribute("data-loaded","true"),t.addEventListener("keyup",function(){a&&(clearTimeout(a),a=null),a=setTimeout(function(){n("filter"+e,t.value),dnd.templates(document.getElementsByClassName("-js-template--"+t.getAttribute("data-target"))[0])},500)})),d()}},l=function(){dnd.filters.amount=25,dnd.vars.localstorage&&(null==localStorage.getItem("filter-amount")?localStorage.setItem("filter-amount",dnd.filters.amount):dnd.filters.amount=parseInt(localStorage.getItem("filter-amount")));for(var e=dnd.selector(".-js-sorting-amount"),t=0;t<e.length;t++){for(var n=e[t],d=n.options,a=0;a<d.length;a++){var i=d[a];i.value==dnd.filters.amount.toString()&&(n.selectedIndex=a)}n.addEventListener("change",function(){var e=this.options[this.selectedIndex].value;dnd.filters.amount=parseInt(e),dnd.vars.localstorage&&localStorage.setItem("filter-amount",dnd.filters.amount),dnd.templates()})}};dnd.filters=function(){l(),setTimeout(function(){r("Rulebook"),r("Edition"),r("Feat-Category"),o("Slug"),o("Keywords"),o("Benefit")},1)}}();var dnd=dnd||{};!function(){"use strict";dnd.vars=dnd.vars||{},dnd.service=dnd.service||{},dnd.filter=function(e){var t=e,n=window.location.hash.substring(1).split("&");return n.length>0&&(t=e.filter(function(e){for(var t=!0,d=0;d<n.length;d++){var a=n[d].split("="),i=a[0].toLowerCase().substr(6,a[0].length-6),r=a[1];if(null!=e[i])e[i].indexOf(r)==-1&&(t=!1);else if(null!=e[i+"_slug"])e[i+"_slug"].indexOf(r)==-1&&(t=!1);else switch(i){case"keywords":break;case"prerequisites":}}return!!t})),t}}();var dnd=dnd||{};!function(){"use strict";dnd.vars=dnd.vars||{},dnd.service=dnd.service||{};var e,t="dndDB",n="http://",d="",a=function(e){var t=null==e?"Error loading data":e;console.log("Data Error",t)},i=function(){var e=null;return""!=document.cookie&&null!=document.cookie&&(e=document.cookie),e},r=function(){var e=new Date;e.setTime(e.getTime()+31536e6);var t="expires="+e.toUTCString();document.cookie="dndDB=true;"+t+";path=/"},o=function(e,t,n){dnd.service[""+t.id]=t.data,null!=n&&n(e,t.data)},l=function(t,n){dnd.ajax(!0,d+""+t.getAttribute("data-endpoint"),function(d){var a=JSON.parse(d);e.transaction([t.getAttribute("data-type")],"readwrite").objectStore(t.getAttribute("data-type")).add({id:t.getAttribute("data-item"),data:a}),s(t,n)},function(){a()},function(){a()})},s=function(t,n){var d=e.transaction([t.getAttribute("data-type")],"readwrite"),a=d.objectStore(t.getAttribute("data-type")),i=a.get(t.getAttribute("data-item"));i.onsuccess=function(e){var d=i.result;null==d?l(t,n):o(t,d,n)}},u=function(n,d,i){var r=window.indexedDB.open(t,1);r.onerror=function(e){a("idbStart Error")},r.onsuccess=function(t){e=r.result,s(n,i)},r.onupgradeneeded=function(t){e=t.target.result,d.forEach(function(t,n){e.createObjectStore(t.alias,{keyPath:"id"})})}},c=function(e,t){null==i()?(r(),dnd.ajax(!0,d+"/endpoints",function(n){var d=JSON.parse(n);u(e,d,t)},function(){a()},function(){a()})):u(e,null,t)},f=function(e,t){var n=[{id:0,data:{}}];dnd.ajax(!0,d+""+e.getAttribute("data-endpoint"),function(d){var a=JSON.parse(d);n.id=e.getAttribute("data-type"),n.data=a,o(e,n,t)},function(){a()},function(){a()})};dnd.data=function(e,t){d=n+dnd.path,dnd.vars.indexeddb?c(e,t):f(e,t)}}();var dnd=dnd||{};!function(){"use strict";dnd.vars=dnd.vars||{},dnd.service=dnd.service||{};var e=function(e){var t=dnd.selector("#Loader");e?(t.style.display="block",t.classList.remove("is-hidden")):(t.style.display="none",t.classList.add("is-hidden"))},t=function(e){e.innerHTML=""},n=function(e,n,d){var a=d.innerHTML,i=0,r="",o=null!=dnd.filters.amount?dnd.filters.amount:25;t(e),n.forEach(function(t,n){if(i<o){var d=a,l=1==t.prestige,s=1==t.verbal_component,u=1==t.somatic_component,c=1==t.arcane_focus_component,f=1==t.divine_focus_component,v=1==t.xp_component;d=dnd.replaceAll(d,"#ID#",t.itemid),d=dnd.replaceAll(d,"#NAME#",t.name),d=dnd.replaceAll(d,"#ALIAS#",t.slug),d=dnd.replaceAll(d,"#DESCRIPTION#",t.description),d=dnd.replaceAll(d,"#PRESTIGE#",l),d=dnd.replaceAll(d,"#SPELLSCHOOL#",t.spellschool_name),d=dnd.replaceAll(d,"#COMPONENTVERBAL#",s),d=dnd.replaceAll(d,"#COMPONENTSOMATIC#",u),d=dnd.replaceAll(d,"#COMPONENTARCANE#",c),d=dnd.replaceAll(d,"#COMPONENTDIVINE#",f),d=dnd.replaceAll(d,"#COMPONENTXP#",v),d=dnd.replaceAll(d,"#BOOK#",t.rulebook_name),d=dnd.replaceAll(d,"#EDITION#",t.edition_name),d=dnd.replaceAll(d,"#EDITIONURL#","/edition/"+t.edition_slug),d=dnd.replaceAll(d,"#CURRENTURL#","/"+e.getAttribute("data-item")+"/"+t.slug),d=dnd.replaceAll(d,"#URL#","/rulebook/"+t.rulebook_slug),d=dnd.replaceAll(d,"#BOOKURL#","/rulebook/"+t.rulebook_slug),r+=d,i++}}),e.innerHTML=r},d=function(t,d){var a=document.getElementById(t.classList[1].replace("-js-",""));e(!1),t&&d&&a&&(n(t,d,a),dnd.filters())};dnd.templates=function(t){var n=[],d="-js-template";if(null!=t?(d+="--"+t.getAttribute("data-item"),n=document.getElementsByClassName(d)):n=document.getElementsByClassName(d),n.length>0)for(var a=0;a<n.length;a++)null!=t?dnd.template(n[a],dnd.service[t.getAttribute("data-type")]):dnd.data(n[a],dnd.template);else e(!1)},dnd.template=function(e,t){var n=t,a=window.location.hash.substring(1);""!=a&&null!=a&&(n=dnd.filter(n)),d(e,n)}}();var dnd=dnd||{};!function(){dnd.vars=dnd.vars||{},dnd.service=dnd.service||{},dnd.path="localhost:81",dnd.vars.localstorage=!1,dnd.vars.indexeddb=!1,window.indexedDB=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB,window.IDBTransaction=window.IDBTransaction||window.webkitIDBTransaction||window.msIDBTransaction,window.IDBKeyRange=window.IDBKeyRange||window.webkitIDBKeyRange||window.msIDBKeyRange,"undefined"!=typeof Storage&&(dnd.vars.localstorage=!0),window.indexedDB&&(dnd.vars.indexeddb=!0),dnd.navigation(),dnd.templates()}();