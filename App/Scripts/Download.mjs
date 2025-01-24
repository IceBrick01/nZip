var e=class e{static createInlineStyle(e){const t={};for(const i of Object.keys(e))if(void 0!==e[i])if("center"===i)e[i].includes("horizontal")&&("column"===e.flexDirection?t["align-items"]="center":t["justify-content"]="center"),e[i].includes("vertical")&&("column"===e.flexDirection?t["justify-content"]="center":t["align-items"]="center");else if("horizontalAlign"===i)"column"===e.flexDirection?t["align-items"]=e.horizontalAlign:t["justify-content"]=e.horizontalAlign;else if("verticalAlign"===i)"column"===e.flexDirection?t["justify-content"]=e.verticalAlign:t["align-items"]=e.verticalAlign;else if(void 0!==r[i])for(const o of r[i])t[o]=e[i];else t[i]=e[i];return Object.keys(t).map((e=>`${e}:${this.parseStyleValue(t[e])}`)).join(";")}static parseStyleValue(e){return i(t(e,0).tokens)}_blocks={};constructor(){}addStyleBlock(e,t){return this._blocks[e]={type:"style",value:t},this}addKeyframeBlock(e,t){return this._blocks[e]={type:"keyframe",value:t},this}addOther(e,t){return this._blocks[e]={type:"other",value:t},this}render(){return Object.keys(this._blocks).map((t=>{const i=this._blocks[t];return"style"===i.type?`${t}{${e.createInlineStyle(i.value)}}`:"keyframe"===i.type?`@keyframe ${t}{${i.value.map((t=>`${t[0]}{${e.createInlineStyle(t[1])}}`)).join("")}}`:`${t}{${Object.keys(i.value).map((e=>`${e}:${i.value[e]}`)).join(";")}}`})).join("")}};function t(e,r){const o=[];var n=void 0;function s(){return void 0!==n&&(o.push({type:n.type,value:n.value}),n=void 0,!0)}function a(e){o.length>0&&"text"===o[o.length-1].type?o[o.length-1].value+=e:o.push({type:"text",value:e})}for(let l=r;l<e.length;l++)if(" "===e[l])s()," "!==e[l-1]&&a(" ");else if("$"===e[l])s(),n={type:"variable",value:""};else if(["+","-","*","/"].includes(e[l]))" "===e[l-1]&&" "===e[l+1]?(s(),o.push({type:"operator",value:e[l]})):void 0===n?a(e[l]):n.value+=e[l];else if("("===e[l]){s();const r=t(e,l+1);o.push({type:"block",value:i(r.tokens)}),l=r.end}else{if(")"===e[l])return s(),{tokens:o,end:l};","===e[l]?(s(),o.push({type:"seperator",value:","})):void 0===n?a(e[l]):n.value+=e[l]}return s(),{tokens:o,end:e.length-1}}function i(e){if(void 0!==e.find((e=>"seperator"===e.type))){const t=[];for(const r of((e,t)=>{const i=[];let r=[];for(const o of e)t(o)?(i.push(r),r=[]):r.push(o);return r.length>0&&i.push(r),i})(e,(e=>"seperator"===e.type)))t.push(i(r));return t.join(",")}if(void 0!==e.find((e=>"operator"===e.type))){const t=[];let r=[];for(const o of e)"operator"===o.type?(t.push(i(r)),t.push(o.value),r=[]):r.push(o);return r.length>0&&t.push(i(r)),`calc(${t.join(" ")})`}{let t="";for(const i of e)"text"===i.type?t+=i.value:"variable"===i.type?t+=`var(--${i.value})`:"block"===i.type&&(t+=`(${i.value})`);return t}}var r={all:["all"],flex:["flex"],gridRow:["grid-row"],gridColumn:["grid-column"],gridRowStart:["grid-row-start"],gridRowEnd:["grid-row-end"],gridColumnStart:["grid-column-start"],gridColumnEnd:["grid-column-end"],position:["position"],display:["display"],flexDirection:["flex-direction"],flexShrink:["flex-shrink"],flexWrap:["flex-wrap"],gridAutoRows:["grid-auto-rows"],gridAutoColumns:["grid-auto-rows"],gridTemplateRows:["grid-template-rows"],gridTemplateColumns:["grid-template-columns"],gap:["gap"],rowGap:["row-gap"],columnGap:["column-gap"],backgroundColor:["background-color"],backgroundImage:["background-image"],backgroundSize:["background-size"],backgroundRepeat:["background-repeat"],backgroundX:["background-position-x"],backgroundY:["background-position-y"],foregroundColor:["color"],borderStyle:["border-style"],borderColor:["border-color"],borderSize:["border-size"],borderRadius:["border-radius"],font:["font-family"],fontSize:["font-size"],fontWeight:["font-weight"],textAlign:["text-align"],textWrap:["text-wrap"],textOverflow:["text-overflow"],textDecoration:["text-decoration"],textDecorationLine:["text-decoration-line"],textDecorationStyle:["text-decoration-style"],textDecorationColor:["text-decoration-color"],textDecorationThickness:["text-decoration-thickness"],lineHeight:["line-height"],boxShadow:["box-shadow","-webkit-box-shadow"],textShadow:["text-shadow"],left:["left"],right:["right"],top:["top"],bottom:["bottom"],width:["width"],minWidth:["min-width"],maxWidth:["max-width"],height:["height"],minHeight:["min-height"],maxHeight:["max-height"],margin:["margin"],marginLeft:["margin-left"],marginRight:["margin-right"],marginTop:["margin-top"],marginBottom:["margin-bottom"],padding:["padding"],paddingLeft:["padding-left"],paddingRight:["padding-right"],paddingTop:["padding-top"],paddingBottom:["padding-bottom"],filter:["filter"],backdropFilter:["backdrop-filter"],opacity:["opacity"],transform:["transform"],transition:["transition"],transitionProperty:["transition-property"],transitionDuration:["transition-duration"],animation:["animation"],animationName:["animation-name"],animationIterationCount:["animation-iteration-count"],animationDirection:["animation-direction"],overflow:["overflow"],overflowX:["overflow-x"],overflowY:["overflow-y"],zIndex:["z-index"],cursor:["cursor"],userSelect:["user-select"]},o=class{_attributes={};createAttribute(e,t){if(void 0!==this._attributes[e])throw new Error(`Attribute Already Exist: "${e}"`);this._attributes[e]=t}deleteAttribute(e){if(void 0===this._attributes[e])throw new Error(`Attribute Not Found: "${e}"`);delete this._attributes[e]}deleteAllAttributes(){this._attributes={}}getAttribute(e){return this._attributes[e]}checkElementAttributes(e,t){if(void 0!==e.tagName)if(void 0===t)for(const t of e.getAttributeNames())this.checkElementAttributes(e,t);else{const i=this.getAttribute(t);if(void 0!==i){const r=e.hasAttribute("activated")?e.getAttribute("activated").split(","):[];r.includes(t)||(r.push(t),e.setAttribute("activated",r.join(",")),i(e,e.getAttribute(t)))}}}checkElementAttributesRecursively(e){if(this.checkElementAttributes(e),void 0!==e.tagName)for(let t=0;t<e.children.length;t++)this.checkElementAttributesRecursively(e.children.item(t))}},n=(e,t)=>{for(let i=0;i<Math.pow(10,e);i++){const r=i.toString().padStart(e,"0");if(!(Array.isArray(t)?t.includes(r):r in t))return r}throw new Error("Ran Out Of IDs")},s=class{_listeners={};createListener(e,t,i,r){const o=n(5,this._listeners);return this._listeners[o]={target:e,name:t,callback:(...e)=>{i(...e),!0===r&&this.deleteListener(o)}},e.addEventListener(t,this._listeners[o].callback),o}deleteListener(e){if(void 0===this._listeners[e])throw new Error(`Listener Not Found: "${e}"`);const t=this._listeners[e];t.target.removeEventListener(t.name,t.callback),delete this._listeners[e]}deleteAllTimers(){for(const e of Object.keys(this._listeners))this.deleteListener(e)}},a=class{static addPlugin(e){if(void 0!==l[e.id])throw new Error(`Plugin Already Exist: "${e.id}"`);return l[e.id]=e,e}static removePlugin(e){if(void 0===l[e])throw new Error(`Plugin Not Found: "${e}"`);delete l[e]}static initializePlugins(e){for(const t of Object.keys(l))l[t].initialize(e)}},l={},c=class{_promises={};handlePromise(e){return new Promise(((t,i)=>{const r=n(5,this._promises);this._promises[r]={abandon:()=>{delete this._promises[r],i()}},e.then((e=>{void 0!==this._promises[r]&&(delete this._promises[r],t(e))}))}))}abandonPromise(e){if(void 0===this._promises[e])throw new Error(`Promise Not Found: "${e}"`);this._promises[e].abandon()}abandonAllPromises(){for(const e of Object.keys(this._promises))this.abandonPromise(e)}},d=class{_interval=void 0;_timers={};createTimeout(e,t){return this._createTimer(1,e,void 0,t)}createInterval(e,t){return this._createTimer(1/0,e,t,void 0)}createLoop(e,t,i,r){return this._createTimer(e,t,i,r)}deleteTimer(e){if(void 0===this._timers[e])throw new Error(`Timer Not Found: "${e}"`);delete this._timers[e],0===Object.keys(this._timers).length&&void 0!==this._interval&&this._stopTimer()}deleteAllTimers(){this._timers={},this._stopTimer()}_createTimer(e,t,i,r){const o=n(5,this._timers);return this._timers[o]={times:e,interval:t,callback:i,endCallback:r,count:0,lastIterateTimestamp:performance.now()},void 0===this._interval&&this._startTimer(),o}_startTimer(){this._interval=setInterval((()=>{const e=performance.now();for(const t of Object.keys(this._timers)){const i=this._timers[t];e-i.lastIterateTimestamp>i.interval&&(i.lastIterateTimestamp=e,i.times===1/0?void 0!==i.callback&&i.callback(1/0):i.count<i.times?(void 0!==i.callback&&i.callback(i.count),i.count++):(void 0!==i.endCallback&&i.endCallback(),delete this._timers[t]))}}),1)}_stopTimer(){clearInterval(this._interval),this._interval=void 0}},u=class{static registerScope(e){const t=n(5,m);return m[t]=e,void 0===h&&(h=new MutationObserver((e=>{for(const t of e)if("childList"===t.type)t.addedNodes.forEach((e=>{const t=this.getParentScope(e);void 0!==t&&t.AttributeManager.checkElementAttributes(e)}));else if("attributes"===t.type){const e=this.getParentScope(t.target);void 0!==e&&e.AttributeManager.checkElementAttributes(t.target,t.attributeName)}}))).observe(document.body,{subtree:!0,childList:!0,attributes:!0}),t}static unregisterScope(e){if(void 0===m[e])throw new Error(`Scope Not Found: "${e}"`);delete m[e]}static getScope(e){if(void 0===m[e])throw new Error(`Scope Not Found: "${e}"`);return m[e]}static getAllScopes(){return Object.keys(m)}static getParentScope(e){if(null===e.parentElement)return;const t=e.parentElement.getAttribute("scope");return null===t?this.getParentScope(e.parentElement):m[t]}},h=void 0,m={},g=class{static createStyle(e,t){for(const i of Object.keys(f))if(f[i].content===e&&f[i].modifier===t)return`scope-${i}`;const i=n(5,f);return f[i]={content:e,modifier:t},this.updateStyles(),`scope-${i}`}static updateStyles(){void 0===p&&(p=document.head.appendChild(document.createElement("style")));const e=[];for(const t of Object.keys(f)){const i=f[t];e.push(`.scope-${t}:${void 0===i.modifier?"":i.modifier}{${f[t].content}}`)}p.textContent=e.join("")}},p=void 0,f={},b=class{static use(e){a.addPlugin(e)}_id;_root;ListenerManager;TimerManager;PromiseManager;PluginManager;AttributeManager;StyleManager;constructor(e){if(null!==e.getAttribute("scope"))throw new Error("Element Is Already The Root Of A Scope");this._id=u.registerScope(this),this._root=e,this.ListenerManager=new s,this.TimerManager=new d,this.PromiseManager=new c,this.PluginManager=a,this.AttributeManager=new o,this.StyleManager=g,e.setAttribute("scope",this._id),a.initializePlugins(this),this.AttributeManager.checkElementAttributesRecursively(this.root)}get id(){return this._id}get root(){return this._root}getElementByID(e){return this._root.querySelector(`#${e}`)}getElementByClassName(e){return this._root.querySelectorAll(`.${e}`)}isOwnedByScope(e){let t=e;for(;;){const e=u.getParentScope(t);if(void 0===e)return!1;if(e.id===this.id)return!0;t=e.root}}listen(e,t,i,r){return this.ListenerManager.createListener(e,t,i,r)}deleteListener(e){this.ListenerManager.deleteListener(e)}createTimeout(e,t){return this.TimerManager.createTimeout(e,t)}createInterval(e,t){return this.TimerManager.createInterval(e,t)}createLoop(e,t,i,r){return this.TimerManager.createLoop(e,t,i,r)}deleteTimer(e){this.TimerManager.deleteTimer(e)}async handle(e){return this.PromiseManager.handlePromise(e)}loadHTML(e){this._reset(),this.root.innerHTML=e,this.AttributeManager.checkElementAttributesRecursively(this.root)}remove(){this._reset(),u.unregisterScope(this._id),this.root.remove()}_reset(){this.ListenerManager.deleteAllTimers(),this.TimerManager.deleteAllTimers(),this.PromiseManager.abandonAllPromises();for(const e of u.getAllScopes()){const t=u.getParentScope(u.getScope(e).root);void 0!==t&&t.id===e&&t.remove()}}};b.use({id:"default",initialize:t=>{t.AttributeManager.createAttribute("style:dynamic:minheight",((i,r)=>{function o(){let t=0;for(const e of Array.from(i.children)){t+=e.getBoundingClientRect().height}i.style.minHeight=e.parseStyleValue(r.replace("<height>",`${t}px`))}o(),t.listen(window,"resize",(()=>o()))}))}}),new b(document.body);var v=document.getElementById("logs"),y=document.getElementById("text_logs"),w=document.getElementById("download_button"),_=new WebSocket(window.location.href);_.addEventListener("open",(()=>{y.innerHTML+="<br>Connected!<br>"}));var k=[];_.addEventListener("message",(async e=>{const t=new Uint8Array(await e.data.arrayBuffer());if(0===t[0]&&0===t[1]){const e=new TextDecoder("utf8").decode(t.slice(2));y.innerHTML+="<br>"+e,v.scrollTo(0,v.scrollHeight)}else 1===t[0]&&0===t[1]?(k.push(t.slice(2)),t.length-2):1===t[0]&&1===t[1]&&(w.href=new TextDecoder("utf8").decode(t.slice(2)),w.download=`${window.location.pathname.split("/")[2]}.zip`,w.innerText="Download ZIP")}));