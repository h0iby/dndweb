var dnd=dnd||{};!function(){"use strict";dnd.ajax=function(t,e,n,a){var d=new XMLHttpRequest;d.open("GET",e),d.onload=function(){t||(d.status>=200&&d.status<400?n(d.responseText):a())},d.onloadend=function(){t&&(d.status>=200&&d.status<400?n(d.responseText):a())},d.onerror=function(){a()},d.send()},dnd.selector=function(t,e){if(t=t.trim(),e||(e=document),t.indexOf(" ")===-1){if(0===t.lastIndexOf("."))return e.getElementsByClassName(t.substring(1));if(0===t.lastIndexOf("#"))return e.getElementById(t.substring(1))}return e.querySelectorAll(t)},dnd.replaceAll=function(t,e,n){return t.replace(new RegExp(e,"g"),n)},dnd.appendTo=function(t,e){t.insertAdjacentHTML("beforeend",e)},dnd.addEventHandler=function(t,e,n){t.addEventListener?t.addEventListener(e,n,!1):t.attachEvent&&t.attachEvent("on"+e,n)},dnd.setHash=function(t,e){var n=""!=e?t+"="+e.toLowerCase():"",a=window.location.hash.substring(1),d="#"+a;if(history.pushState)if(""!=e){if(a.indexOf(t)<0)d.length>1&&(d+="&"),d+=n;else if(a.indexOf("&")<0)d="#"+n;else{var r=a.substring(a.indexOf(t)),i=r;r.indexOf("&")>-1&&(i=r.substring(0,r.indexOf("&"))),d=d.replace(i,n)}history.pushState(null,null,d)}else if(a.indexOf("&")<0)a.indexOf(t)>-1&&history.pushState(null,null," ");else{var r=a.substring(a.indexOf(t)),i=r;r.indexOf("&")>-1&&(i=r.substring(0,r.indexOf("&"))),d=d.replace("#"+i+"&","#"),d=d.replace("&"+i,""),history.pushState(null,null,d)}}}();var dnd=dnd||{};!function(){"use strict";var t=function(){var t=window.location.hash.substring(1);if(""!=t&&null!=t){var e=document.getElementsByClassName("filter__toggle");e&&(e[0].checked=!0)}},e=function(){var t=0,e=document.getElementById("Header");e.offsetHeight+5;window.onscroll=function(){window.pageYOffset<t?e.classList.remove("is-hidden"):e.classList.add("is-hidden"),t=window.pageYOffset}};dnd.loader=function(t){var e=dnd.selector("#Loader");t?e.classList.remove("is-hidden"):e.classList.add("is-hidden")},dnd.navigation=function(){e(),t()}}();var dnd=dnd||{};!function(){"use strict";dnd.vars=dnd.vars||{};var t,e="dndDB",n="http://",a="",d=function(t){var e=null==t?"Error loading data":t;console.log("Data Error",e)},r=function(e,n){var i=t.transaction([n.getAttribute("data-type")],"readwrite"),o=i.objectStore(n.getAttribute("data-type")),l=o.get(n.getAttribute("data-item"));n.classList.toString().indexOf("rid")>-1||n.classList.toString().indexOf("sid")>-1?(console.log("THIS IS ERROR"),e(n,[{}])):l.onsuccess=function(i){var o=l.result;null==o?dnd.ajax(!0,a+""+n.getAttribute("data-endpoint"),function(a){var d=JSON.parse(a);t.transaction([n.getAttribute("data-type")],"readwrite").objectStore(n.getAttribute("data-type")).add({id:n.getAttribute("data-type"),data:d}),r(e,n)},function(){d()},function(){d()}):e(n,o.data)}},i=function(e,n){console.log(n);var r=0,i=0;n.filter(function(t){""!=t.show&&r++}),n.forEach(function(n,o){""!=n.show&&dnd.ajax(!0,a+""+n.path,function(a){i++;var d=JSON.parse(a);t.transaction([n.alias],"readwrite").objectStore(n.alias).add({id:n.alias,data:d}),i==r&&(localStorage.setItem("idbSet",!0),e())},function(){d()},function(){d()})})},o=function(n,a){var r=window.indexedDB.open(e,1);r.onerror=function(t){d("idbStart Error")},r.onsuccess=function(e){t=r.result,null==localStorage.getItem("idbSet")?i(n,a):n()},r.onupgradeneeded=function(e){t=e.target.result,null==localStorage.getItem("idbSet")&&a.forEach(function(e,n){t.createObjectStore(e.alias,{keyPath:"id"})})}},l=function(t){if(null==localStorage.getItem("idbData"))dnd.ajax(!0,a+"/endpoints",function(e){localStorage.setItem("idbData",e);var n=JSON.parse(e);o(t,n)},function(){d()},function(){d()});else{var e=JSON.parse(localStorage.getItem("idbData"));o(t,e)}},s=function(t,e){dnd.vars.modern?r(t,e):dnd.ajax(!0,a+""+e.getAttribute("data-endpoint"),function(n){var a=JSON.parse(n);t(e,a)},function(){d()},function(){d()})};dnd.data=function(t,e){a=n+dnd.path,null!=e?s(t,e):dnd.vars.modern?l(t):t()}}();var dnd=dnd||{};!function(){"use strict";dnd.vars=dnd.vars||{},dnd.service=dnd.service||{};var t=function(t){t.innerHTML=""},e=function(e,n,a){var d=a.innerHTML,r=0,i="",o=null!=dnd.filters.amount?dnd.filters.amount:25;t(e),n.forEach(function(t,n){if(r<o){var a=d,l=1==t.prestige,s=1==t.verbal_component,u=1==t.somatic_component,c=1==t.arcane_focus_component,f=1==t.divine_focus_component,g=1==t.xp_component;a=dnd.replaceAll(a,"#ID#",t.itemid),a=dnd.replaceAll(a,"#NAME#",t.name),a=dnd.replaceAll(a,"#ALIAS#",t.slug),a=dnd.replaceAll(a,"#DESCRIPTION#",t.description),a=dnd.replaceAll(a,"#PRESTIGE#",l),a=dnd.replaceAll(a,"#SPELLSCHOOL#",t.spellschool_name),a=dnd.replaceAll(a,"#COMPONENTVERBAL#",s),a=dnd.replaceAll(a,"#COMPONENTSOMATIC#",u),a=dnd.replaceAll(a,"#COMPONENTARCANE#",c),a=dnd.replaceAll(a,"#COMPONENTDIVINE#",f),a=dnd.replaceAll(a,"#COMPONENTXP#",g),a=dnd.replaceAll(a,"#BOOK#",t.rulebook_name),a=dnd.replaceAll(a,"#EDITION#",t.edition_name),a=dnd.replaceAll(a,"#EDITIONURL#","/edition/"+t.edition_slug),a=dnd.replaceAll(a,"#CURRENTURL#","/"+e.getAttribute("data-item")+"/"+t.slug),a=dnd.replaceAll(a,"#URL#","/rulebook/"+t.rulebook_slug),a=dnd.replaceAll(a,"#BOOKURL#","/rulebook/"+t.rulebook_slug),i+=a,r++}}),e.innerHTML=i},n=function(t,n){var a=document.getElementById(t.classList[1].replace("-js-",""));t&&n&&a&&(e(t,n,a),dnd.filters())};dnd.template=function(t,e){var a=e,d=window.location.hash.substring(1);""!=d&&null!=d&&(a=dnd.filter(a)),n(t,a),dnd.loader(!1)},dnd.templates=function(t){var e=[],n="-js-template";if(null!=t&&(n+="--"+t),e=document.getElementsByClassName(n),e.length>0){dnd.loader(!0);for(var a=0;a<e.length;a++)dnd.data(dnd.template,e[a])}else dnd.loader(!1)}}();var dnd=dnd||{};!function(){"use strict";dnd.vars=dnd.vars||{};var t=function(t,e){var n=t;if(n)for(var a=n.options,d=0;d<a.length;d++){var r=a[d];r.value==e.toString()&&(n.selectedIndex=d)}},e=function(t,e){var n=t;n.value=e},n=function(t){t.checked=!0},a=function(t,e){dnd.setHash(t,dnd.replaceAll(e," ","-"))},d=function(){if(window.location.hash)for(var a=window.location.hash.substring(1).split("&"),d=0;d<a.length;d++)for(var r=a[d].split("="),i=document.querySelectorAll("[data-select='"+r[0]+"']"),o=0;o<i.length;o++){var l=i[o];if(l)switch(l.tagName.toLowerCase()){case"select":t(l,dnd.replaceAll(r[1],"-"," "));break;default:if(l.hasAttribute("data-radio")){var s=l.getAttribute("data-radio");s==r[1]&&n(l)}else e(l,dnd.replaceAll(r[1],"-"," "))}}},r=function(t){var e=dnd.service[t.getAttribute("data-type")],n=t.getAttribute("data-select"),d=document.createElement("option"),r=e.length;if(t.hasAttribute("data-loaded")||(d.value="",d.innerHTML="",t.appendChild(d)),r>0&&!t.hasAttribute("data-loaded")){t.setAttribute("data-loaded","true");for(var i=0;i<e.length;i++){var o=document.createElement("option");o.value=e[i].slug,o.innerHTML=e[i].name,t.appendChild(o)}t.addEventListener("change",function(){var e=this,d=e.options[e.selectedIndex].value;a(n,d),dnd.templates(document.getElementsByClassName("-js-template--"+t.getAttribute("data-target"))[0])})}},i=function(t,e){var n=e.toLowerCase();t.setAttribute("data-type",n),t.setAttribute("data-item",n),t.setAttribute("data-endpoint","/"+n),console.log("NEED TO DO THIS")},o=function(t){var e=t.getAttribute("data-select");if(t&&e){var n=e.toLowerCase(),a=dnd.service[n];null==a?i(t,e):r(t)}},l=function(t){var e=t.getAttribute("data-select");if(t&&e){var n;t.hasAttribute("data-loaded")||(t.setAttribute("data-loaded","true"),t.addEventListener("keyup",function(){n&&(clearTimeout(n),n=null),n=setTimeout(function(){a(e,t.value),dnd.templates(document.getElementsByClassName("-js-template--"+t.getAttribute("data-target"))[0])},750)}))}},s=function(t){var e=t.getAttribute("data-select");if(t&&e){var n;t.hasAttribute("data-loaded")||(t.setAttribute("data-loaded","true"),t.addEventListener("change",function(){n&&(clearTimeout(n),n=null),n=setTimeout(function(){var n="";t.hasAttribute("data-radio")&&(n=t.getAttribute("data-radio")),a(e,n),dnd.templates(document.getElementsByClassName("-js-template--"+t.getAttribute("data-target"))[0])},1)}))}},u=function(){dnd.filters.amount=25,dnd.vars.localstorage&&(null==localStorage.getItem("filter-amount")?localStorage.setItem("filter-amount",dnd.filters.amount):dnd.filters.amount=parseInt(localStorage.getItem("filter-amount")));for(var t=dnd.selector(".-js-sorting-amount"),e=0;e<t.length;e++){for(var n=t[e],a=n.options,d=0;d<a.length;d++){var r=a[d];r.value==dnd.filters.amount.toString()&&(n.selectedIndex=d)}n.addEventListener("change",function(){var t=this.options[this.selectedIndex].value;dnd.filters.amount=parseInt(t),dnd.vars.localstorage&&localStorage.setItem("filter-amount",dnd.filters.amount),dnd.templates()})}};dnd.filters=function(){u(),setTimeout(function(){for(var t=dnd.selector(".filter__list__item__container__select"),e=0;e<t.length;e++){var n=t[e];n.hasAttribute("data-select")&&""!=n.getAttribute("data-select")&&o(n)}t=dnd.selector(".filter__list__item__container__input");for(var e=0;e<t.length;e++){var n=t[e];n.hasAttribute("data-select")&&""!=n.getAttribute("data-select")&&l(n)}t=dnd.selector(".filter__list__item__container__radiobutton");for(var e=0;e<t.length;e++){var n=t[e];n.hasAttribute("data-select")&&""!=n.getAttribute("data-select")&&s(n)}d()},1)}}();var dnd=dnd||{};!function(){"use strict";dnd.vars=dnd.vars||{},dnd.filter=function(t){var e=t,n=window.location.hash.substring(1).split("&");return n.length>0&&(e=t.filter(function(t){for(var e=!0,a=0;a<n.length;a++){var d=n[a].split("="),r=d[0].toLowerCase(),i=d[1];if(null!=t[r])t[r].toString().indexOf(i)==-1&&(e=!1);else if(null!=t[r+"_slug"])t[r+"_slug"].toString().indexOf(i)==-1&&(e=!1);else switch(r){case"keywords":break;case"prerequisites":}}return!!e})),e}}();var dnd=dnd||{};!function(){dnd.vars=dnd.vars||{},dnd.path="localhost:81",dnd.vars.localstorage=!1,dnd.vars.indexeddb=!1,dnd.vars.modern=!1,window.indexedDB=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB,window.IDBTransaction=window.IDBTransaction||window.webkitIDBTransaction||window.msIDBTransaction,window.IDBKeyRange=window.IDBKeyRange||window.webkitIDBKeyRange||window.msIDBKeyRange,"undefined"!=typeof Storage&&(dnd.vars.localstorage=!0),window.indexedDB&&(dnd.vars.indexeddb=!0),dnd.vars.indexeddb&&dnd.vars.localstorage&&(dnd.vars.modern=!0);var t=function(){dnd.loader(!1),dnd.templates(null)};dnd.navigation(),dnd.data(t,null)}();