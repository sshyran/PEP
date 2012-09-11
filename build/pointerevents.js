/*
 * Copyright 2012 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */(function(e){Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;return function(){return t.apply(e,arguments)}}),e=e||{},e.clone=function(e,t){var n=[].slice.call(arguments,1);for(var r=0,i;i=n[r];r++)if(i)for(var s in i)e[s]=i[s];return e},window.PointerEventShim=e})(window.PointerEventShim),function(e){var t={pointers:[],addPointer:function(e,t){var n={id:e,event:t};return this.pointers.push(n),n},removePointer:function(e){var t=this.getPointerIndex(e);if(t>-1)return this.pointers.splice(t,1)},getPointerById:function(e){return this.pointers[this.getPointerIndex(e)]},getPointerIndex:function(e){for(var t=0,n=this.pointers.length,r;t<n&&(r=this.pointers[t]);t++)if(r.id===e)return t;return-1},getPointerList:function(){return this.pointers}};e.pointermap=t}(window.PointerEventShim),function(e){var t=e.clone,n=e.pointermap,r=n.getPointerList.bind(n),i={hooks:[],events:{},eventSources:{},registerSource:function(e,t,n){n.forEach(function(e){t[e]&&(this.events[e]=t[e].bind(t))},this),this.listen(n),this.eventSources[e]=t},registerHook:function(e,t,n){this.hooks.push({scope:t,events:n,name:e})},down:function(e){this.fireEvent(e,"pointerdown")},move:function(e){this.fireEvent(e,"pointermove")},up:function(e){this.fireEvent(e,"pointerup")},tap:function(e){this.disableTap||this.fireEvent(e,"pointertap")},enter:function(e){this.fireEvent(e,"pointerenter")},leave:function(e){this.fireEvent(e,"pointerleave")},eventHandler:function(e){var t=e.type,n=this.events&&this.events[t];n&&n(e)},listen:function(e){e.forEach(function(e){this.addEvent(e,this.boundHandler)},this)},unlisten:function(e){e.forEach(function(e){this.removeEvent(e,this.boundHandler)},this)},addEvent:function(e,t,n){document.addEventListener(e,t,n)},removeEvent:function(e,t,n){document.removeEventListener(e,t,n)},makeEvent:function(e,t){var n;typeof e.buttons!="undefined"?n=e.buttons?e.button:-1:n=e.which?e.button:-1;var i=document.createEvent("MouseEvent");return i.initMouseEvent(t,e.bubbles,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,n,e.relatedTarget),i.srcEvent=e.srcEvent||e,i.pointerId=e.pointerId||-1,i.getPointerList=r,i},fireEvent:function(e,t){var n=this.makeEvent(e,t);return this.dispatchEvent(n)},cloneEvent:function(e){return t({},e)},findTarget:function(e){return e.target},dispatchEvent:function(e){var t=e.type;for(var n=0,r,i;r=this.hooks[n];n++)if(r.events.indexOf(t)>-1){i=r.scope[t];if(i&&i.call(r.scope,e)===!0)return}return this.findTarget(e.srcEvent).dispatchEvent(e)}};e.dispatcher=i,i.boundHandler=i.eventHandler.bind(i)}(window.PointerEventShim),function(e){var t=e.dispatcher,n=e.pointermap,r=function(e,t){var n=e;while(n){if(n===t)return!0;n=n.parentNode}},i={events:["click","touchstart","touchmove","touchend"],splitEvents:function(e){var n=Array.prototype.map.call(e.changedTouches,function(e){var n=t.cloneEvent(e);return n.pointerId=e.identifier,n.target=this.findTarget(n),n.bubbles=!0,n.cancelable=!0,n.which=1,n.button=0,n},this);return n},findTarget:function(e){return document.elementFromPoint(e.clientX,e.clientY)},click:function(e){t.tap(e)},touchstart:function(e){var t=this.splitEvents(e);t.forEach(this.downEnter,this)},downEnter:function(e){var r=n.addPointer(e.pointerId,e,null);t.down(e),r.over=e,t.enter(e)},touchmove:function(e){e.preventDefault();var t=this.splitEvents(e);t.forEach(this.moveEnterLeave,this)},moveEnterLeave:function(e){var i=e,s=n.getPointerById(i.pointerId),o=s.over;s.event=i,t.move(i),o&&o.target!==i.target&&(o.relatedTarget=i.target,i.relatedTarget=o.target,r(o.relatedTarget,o.target)||t.leave(o),r(i.relatedTarget,i.target)||t.enter(i)),s.over=i},touchend:function(e){var t=this.splitEvents(e);t.forEach(this.upLeave,this)},upLeave:function(e){t.up(e),t.leave(e),n.removePointer(e.pointerId)}},s={POINTER_ID:-1,buttons:0,events:["click","mousedown","mousemove","mouseup","mouseover","mouseout"],click:function(e){t.tap(e)},mousedown:function(e){if(e.button==2)return;this.buttons==0&&(n.addPointer(this.POINTER_ID,e),t.down(e)),this.buttons++},mousemove:function(e){var r=n.getPointerById(this.POINTER_ID);r&&(r.event=e),t.move(e)},mouseup:function(e){this.buttons--,this.buttons==0&&(t.up(e),n.removePointer(this.POINTER_ID))},mouseover:function(e){if(!r(e.relatedTarget,e.target)){var n=t.cloneEvent(e);n.bubbles=!1,t.enter(n)}},mouseout:function(e){if(!r(e.relatedTarget,e.target)){var n=t.cloneEvent(e);n.bubbles=!1,t.leave(n)}}};"ontouchstart"in window?t.registerSource("touch",i,i.events):t.registerSource("mouse",s,s.events)}(window.PointerEventShim),function(e){var t=e.dispatcher,n=e.pointermap,r=t.cloneEvent,i={MIN_VELOCITY:.5,pointerdown:function(e){var t=n.getPointerById(e.pointerId);t.flickStart=r(e)},pointerup:function(e){var t=n.getPointerById(e.pointerId);if(t.flickStart){var r=this.makeFlick(t.flickStart,e);t.flickStart=null}},makeFlick:function(e,n){var r=e,i=n,s=i.timeStamp-r.timeStamp,o=i.clientX-r.clientX,u=i.clientY-r.clientY,a=o/s,f=u/s,l=Math.sqrt(a*a+f*f),c=Math.abs(a)>Math.abs(f)?"x":"y",h=this.calcAngle(a,f);if(Math.abs(l)>=this.MIN_VELOCITY){var p=t.makeEvent(r,"pointerflick");p.xVelocity=a,p.yVelocity=f,p.velocity=l,p.angle=h,p.majorAxis=c,t.dispatchEvent(p)}},calcAngle:function(e,t){return Math.atan2(t,e)*180/Math.PI}};t.registerHook("flick",i,["pointerdown","pointerup"])}(window.PointerEventShim),function(e){e.keep||(window.PointerEventShim=undefined)}(window.PointerEventShim);