import{r as c,j as u,a as tt,f as je}from"./iframe-EqBHPOI0.js";import{O as nt,d as V}from"./OptionalPortal-WPrERzRX.js";import{B as te,h as F,f as M,u as j,d as rt,e as ot}from"./factory-DqECm5K9.js";import{c as Re}from"./create-safe-context-BYa7r0xv.js";import{a as at}from"./CloseButton-C2RilD6v.js";import{u as st,F as lt,O as it}from"./FocusTrap-WZMWjmgo.js";import{P as ct}from"./Paper-C9robENA.js";import{T as De}from"./Transition-DGeBSity.js";import{e as ut,a as dt,g as ft}from"./get-size-CSQgFZmj.js";import{u as ht}from"./DirectionProvider-B3a4q35G.js";import{u as mt}from"./use-reduced-motion-BE2r52SP.js";import{u as pt}from"./use-id-DAS2y4nq.js";import{S as vt}from"./ScrollArea-Bl6yET7t.js";import{c as gt}from"./create-optional-context-BUf-ypkz.js";import{B as _}from"./Button-DyxeCZYV.js";import{T as pe}from"./Text-DA2JmZSP.js";import"./preload-helper-Dp1pzeXC.js";import"./is-element-bYPkbgzu.js";import"./index-CbX1FNOe.js";import"./index-BQPiQ6rT.js";import"./use-merged-ref-vgvTjVRf.js";import"./polymorphic-factory-BGsUCbbm.js";import"./UnstyledButton-CsDtP7a1.js";import"./Loader-YJwzFIcQ.js";import"./Text-B4ge9-AH.js";var N=function(){return N=Object.assign||function(t){for(var n,r=1,o=arguments.length;r<o;r++){n=arguments[r];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=n[s])}return t},N.apply(this,arguments)};function Ie(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]]);return n}function yt(e,t,n){if(n||arguments.length===2)for(var r=0,o=t.length,s;r<o;r++)(s||!(r in t))&&(s||(s=Array.prototype.slice.call(t,0,r)),s[r]=t[r]);return e.concat(s||Array.prototype.slice.call(t))}var q="right-scroll-bar-position",J="width-before-scroll-bar",wt="with-scroll-bars-hidden",bt="--removed-body-scroll-bar-size";function de(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function St(e,t){var n=c.useState(function(){return{value:e,callback:t,facade:{get current(){return n.value},set current(r){var o=n.value;o!==r&&(n.value=r,n.callback(r,o))}}}})[0];return n.callback=t,n.facade}var xt=typeof window<"u"?c.useLayoutEffect:c.useEffect,ve=new WeakMap;function Ct(e,t){var n=St(null,function(r){return e.forEach(function(o){return de(o,r)})});return xt(function(){var r=ve.get(n);if(r){var o=new Set(r),s=new Set(e),l=n.current;o.forEach(function(a){s.has(a)||de(a,null)}),s.forEach(function(a){o.has(a)||de(a,l)})}ve.set(n,e)},[e]),n}function Pt(e){return e}function Bt(e,t){t===void 0&&(t=Pt);var n=[],r=!1,o={read:function(){if(r)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return n.length?n[n.length-1]:e},useMedium:function(s){var l=t(s,r);return n.push(l),function(){n=n.filter(function(a){return a!==l})}},assignSyncMedium:function(s){for(r=!0;n.length;){var l=n;n=[],l.forEach(s)}n={push:function(a){return s(a)},filter:function(){return n}}},assignMedium:function(s){r=!0;var l=[];if(n.length){var a=n;n=[],a.forEach(s),l=n}var d=function(){var m=l;l=[],m.forEach(s)},i=function(){return Promise.resolve().then(d)};i(),n={push:function(m){l.push(m),i()},filter:function(m){return l=l.filter(m),n}}}};return o}function kt(e){e===void 0&&(e={});var t=Bt(null);return t.options=N({async:!0,ssr:!1},e),t}var Le=function(e){var t=e.sideCar,n=Ie(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var r=t.read();if(!r)throw new Error("Sidecar medium not found");return c.createElement(r,N({},n))};Le.isSideCarExport=!0;function Tt(e,t){return e.useMedium(t),Le}var Ae=kt(),fe=function(){},ne=c.forwardRef(function(e,t){var n=c.useRef(null),r=c.useState({onScrollCapture:fe,onWheelCapture:fe,onTouchMoveCapture:fe}),o=r[0],s=r[1],l=e.forwardProps,a=e.children,d=e.className,i=e.removeScrollBar,m=e.enabled,y=e.shards,h=e.sideCar,w=e.noRelative,b=e.noIsolation,f=e.inert,p=e.allowPinchZoom,S=e.as,x=S===void 0?"div":S,P=e.gapMode,B=Ie(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),C=h,T=Ct([n,t]),k=N(N({},B),o);return c.createElement(c.Fragment,null,m&&c.createElement(C,{sideCar:Ae,removeScrollBar:i,shards:y,noRelative:w,noIsolation:b,inert:f,setCallbacks:s,allowPinchZoom:!!p,lockRef:n,gapMode:P}),l?c.cloneElement(c.Children.only(a),N(N({},k),{ref:T})):c.createElement(x,N({},k,{className:d,ref:T}),a))});ne.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};ne.classNames={fullWidth:J,zeroRight:q};var Nt=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function Ot(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=Nt();return t&&e.setAttribute("nonce",t),e}function Et(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function _t(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var Mt=function(){var e=0,t=null;return{add:function(n){e==0&&(t=Ot())&&(Et(t,n),_t(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},jt=function(){var e=Mt();return function(t,n){c.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&n])}},Fe=function(){var e=jt(),t=function(n){var r=n.styles,o=n.dynamic;return e(r,o),null};return t},Rt={left:0,top:0,right:0,gap:0},he=function(e){return parseInt(e||"",10)||0},Dt=function(e){var t=window.getComputedStyle(document.body),n=t[e==="padding"?"paddingLeft":"marginLeft"],r=t[e==="padding"?"paddingTop":"marginTop"],o=t[e==="padding"?"paddingRight":"marginRight"];return[he(n),he(r),he(o)]},It=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return Rt;var t=Dt(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},Lt=Fe(),A="data-scroll-locked",At=function(e,t,n,r){var o=e.left,s=e.top,l=e.right,a=e.gap;return n===void 0&&(n="margin"),`
  .`.concat(wt,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(a,"px ").concat(r,`;
  }
  body[`).concat(A,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(r,";"),n==="margin"&&`
    padding-left: `.concat(o,`px;
    padding-top: `).concat(s,`px;
    padding-right: `).concat(l,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(a,"px ").concat(r,`;
    `),n==="padding"&&"padding-right: ".concat(a,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(q,` {
    right: `).concat(a,"px ").concat(r,`;
  }
  
  .`).concat(J,` {
    margin-right: `).concat(a,"px ").concat(r,`;
  }
  
  .`).concat(q," .").concat(q,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(J," .").concat(J,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat(A,`] {
    `).concat(bt,": ").concat(a,`px;
  }
`)},ge=function(){var e=parseInt(document.body.getAttribute(A)||"0",10);return isFinite(e)?e:0},Ft=function(){c.useEffect(function(){return document.body.setAttribute(A,(ge()+1).toString()),function(){var e=ge()-1;e<=0?document.body.removeAttribute(A):document.body.setAttribute(A,e.toString())}},[])},Ht=function(e){var t=e.noRelative,n=e.noImportant,r=e.gapMode,o=r===void 0?"margin":r;Ft();var s=c.useMemo(function(){return It(o)},[o]);return c.createElement(Lt,{styles:At(s,!t,o,n?"":"!important")})},me=!1;if(typeof window<"u")try{var X=Object.defineProperty({},"passive",{get:function(){return me=!0,!0}});window.addEventListener("test",X,X),window.removeEventListener("test",X,X)}catch{me=!1}var I=me?{passive:!1}:!1,Wt=function(e){return e.tagName==="TEXTAREA"},He=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return n[t]!=="hidden"&&!(n.overflowY===n.overflowX&&!Wt(e)&&n[t]==="visible")},zt=function(e){return He(e,"overflowY")},Vt=function(e){return He(e,"overflowX")},ye=function(e,t){var n=t.ownerDocument,r=t;do{typeof ShadowRoot<"u"&&r instanceof ShadowRoot&&(r=r.host);var o=We(e,r);if(o){var s=ze(e,r),l=s[1],a=s[2];if(l>a)return!0}r=r.parentNode}while(r&&r!==n.body);return!1},Zt=function(e){var t=e.scrollTop,n=e.scrollHeight,r=e.clientHeight;return[t,n,r]},$t=function(e){var t=e.scrollLeft,n=e.scrollWidth,r=e.clientWidth;return[t,n,r]},We=function(e,t){return e==="v"?zt(t):Vt(t)},ze=function(e,t){return e==="v"?Zt(t):$t(t)},Xt=function(e,t){return e==="h"&&t==="rtl"?-1:1},Yt=function(e,t,n,r,o){var s=Xt(e,window.getComputedStyle(t).direction),l=s*r,a=n.target,d=t.contains(a),i=!1,m=l>0,y=0,h=0;do{if(!a)break;var w=ze(e,a),b=w[0],f=w[1],p=w[2],S=f-p-s*b;(b||S)&&We(e,a)&&(y+=S,h+=b);var x=a.parentNode;a=x&&x.nodeType===Node.DOCUMENT_FRAGMENT_NODE?x.host:x}while(!d&&a!==document.body||d&&(t.contains(a)||t===a));return(m&&Math.abs(y)<1||!m&&Math.abs(h)<1)&&(i=!0),i},Y=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},we=function(e){return[e.deltaX,e.deltaY]},be=function(e){return e&&"current"in e?e.current:e},Ut=function(e,t){return e[0]===t[0]&&e[1]===t[1]},Gt=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},Kt=0,L=[];function Qt(e){var t=c.useRef([]),n=c.useRef([0,0]),r=c.useRef(),o=c.useState(Kt++)[0],s=c.useState(Fe)[0],l=c.useRef(e);c.useEffect(function(){l.current=e},[e]),c.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(o));var f=yt([e.lockRef.current],(e.shards||[]).map(be),!0).filter(Boolean);return f.forEach(function(p){return p.classList.add("allow-interactivity-".concat(o))}),function(){document.body.classList.remove("block-interactivity-".concat(o)),f.forEach(function(p){return p.classList.remove("allow-interactivity-".concat(o))})}}},[e.inert,e.lockRef.current,e.shards]);var a=c.useCallback(function(f,p){if("touches"in f&&f.touches.length===2||f.type==="wheel"&&f.ctrlKey)return!l.current.allowPinchZoom;var S=Y(f),x=n.current,P="deltaX"in f?f.deltaX:x[0]-S[0],B="deltaY"in f?f.deltaY:x[1]-S[1],C,T=f.target,k=Math.abs(P)>Math.abs(B)?"h":"v";if("touches"in f&&k==="h"&&T.type==="range")return!1;var Z=window.getSelection(),z=Z&&Z.anchorNode,ue=z?z===T||z.contains(T):!1;if(ue)return!1;var D=ye(k,T);if(!D)return!0;if(D?C=k:(C=k==="v"?"h":"v",D=ye(k,T)),!D)return!1;if(!r.current&&"changedTouches"in f&&(P||B)&&(r.current=C),!C)return!0;var $=r.current||C;return Yt($,p,f,$==="h"?P:B)},[]),d=c.useCallback(function(f){var p=f;if(!(!L.length||L[L.length-1]!==s)){var S="deltaY"in p?we(p):Y(p),x=t.current.filter(function(C){return C.name===p.type&&(C.target===p.target||p.target===C.shadowParent)&&Ut(C.delta,S)})[0];if(x&&x.should){p.cancelable&&p.preventDefault();return}if(!x){var P=(l.current.shards||[]).map(be).filter(Boolean).filter(function(C){return C.contains(p.target)}),B=P.length>0?a(p,P[0]):!l.current.noIsolation;B&&p.cancelable&&p.preventDefault()}}},[]),i=c.useCallback(function(f,p,S,x){var P={name:f,delta:p,target:S,should:x,shadowParent:qt(S)};t.current.push(P),setTimeout(function(){t.current=t.current.filter(function(B){return B!==P})},1)},[]),m=c.useCallback(function(f){n.current=Y(f),r.current=void 0},[]),y=c.useCallback(function(f){i(f.type,we(f),f.target,a(f,e.lockRef.current))},[]),h=c.useCallback(function(f){i(f.type,Y(f),f.target,a(f,e.lockRef.current))},[]);c.useEffect(function(){return L.push(s),e.setCallbacks({onScrollCapture:y,onWheelCapture:y,onTouchMoveCapture:h}),document.addEventListener("wheel",d,I),document.addEventListener("touchmove",d,I),document.addEventListener("touchstart",m,I),function(){L=L.filter(function(f){return f!==s}),document.removeEventListener("wheel",d,I),document.removeEventListener("touchmove",d,I),document.removeEventListener("touchstart",m,I)}},[]);var w=e.removeScrollBar,b=e.inert;return c.createElement(c.Fragment,null,b?c.createElement(s,{styles:Gt(o)}):null,w?c.createElement(Ht,{noRelative:e.noRelative,gapMode:e.gapMode}):null)}function qt(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const Jt=Tt(Ae,Qt);var Ve=c.forwardRef(function(e,t){return c.createElement(ne,N({},e,{ref:t,sideCar:Jt}))});Ve.classNames=ne.classNames;function en(e,t,n){c.useEffect(()=>(window.addEventListener(e,t,n),()=>window.removeEventListener(e,t,n)),[e,t])}const[tn,O]=Re("ModalBase component was not found in tree");function nn({opened:e,transitionDuration:t}){const[n,r]=c.useState(e),o=c.useRef(-1),l=mt()?0:t;return c.useEffect(()=>(e?(r(!0),window.clearTimeout(o.current)):l===0?r(!1):o.current=window.setTimeout(()=>r(!1),l),()=>window.clearTimeout(o.current)),[e,l]),n}function rn({id:e,transitionProps:t,opened:n,trapFocus:r,closeOnEscape:o,onClose:s,returnFocus:l}){const a=pt(e),[d,i]=c.useState(!1),[m,y]=c.useState(!1),h=typeof(t==null?void 0:t.duration)=="number"?t==null?void 0:t.duration:200,w=nn({opened:n,transitionDuration:h});return en("keydown",b=>{var f;b.key==="Escape"&&o&&!b.isComposing&&n&&((f=b.target)==null?void 0:f.getAttribute("data-mantine-stop-propagation"))!=="true"&&s()},{capture:!0}),st({opened:n,shouldReturnFocus:r&&l}),{_id:a,titleMounted:d,bodyMounted:m,shouldLockScroll:w,setTitleMounted:i,setBodyMounted:y}}const Ze=c.forwardRef(({keepMounted:e,opened:t,onClose:n,id:r,transitionProps:o,onExitTransitionEnd:s,onEnterTransitionEnd:l,trapFocus:a,closeOnEscape:d,returnFocus:i,closeOnClickOutside:m,withinPortal:y,portalProps:h,lockScroll:w,children:b,zIndex:f,shadow:p,padding:S,__vars:x,unstyled:P,removeScrollProps:B,...C},T)=>{const{_id:k,titleMounted:Z,bodyMounted:z,shouldLockScroll:ue,setTitleMounted:D,setBodyMounted:$}=rn({id:r,transitionProps:o,opened:t,trapFocus:a,closeOnEscape:d,onClose:n,returnFocus:i}),{key:Je,...et}=B||{};return u.jsx(nt,{...h,withinPortal:y,children:u.jsx(tn,{value:{opened:t,onClose:n,closeOnClickOutside:m,onExitTransitionEnd:s,onEnterTransitionEnd:l,transitionProps:{...o,keepMounted:e},getTitleId:()=>`${k}-title`,getBodyId:()=>`${k}-body`,titleMounted:Z,bodyMounted:z,setTitleMounted:D,setBodyMounted:$,trapFocus:a,closeOnEscape:d,zIndex:f,unstyled:P},children:u.jsx(Ve,{enabled:ue&&w,...et,children:u.jsx(te,{ref:T,...C,__vars:{...x,"--mb-z-index":(f||V("modal")).toString(),"--mb-shadow":dt(p),"--mb-padding":ut(S)},children:b})},Je)})})});Ze.displayName="@mantine/core/ModalBase";var H={title:"m_615af6c9",header:"m_b5489c3c",inner:"m_60c222c7",content:"m_fd1ab0aa",close:"m_606cb269",body:"m_5df29311"};function on(){const e=O();return c.useEffect(()=>(e.setBodyMounted(!0),()=>e.setBodyMounted(!1)),[]),e.getBodyId()}const $e=c.forwardRef(({className:e,...t},n)=>{const r=on(),o=O();return u.jsx(te,{ref:n,...t,id:r,className:F({[H.body]:!o.unstyled},e)})});$e.displayName="@mantine/core/ModalBaseBody";const Xe=c.forwardRef(({className:e,onClick:t,...n},r)=>{const o=O();return u.jsx(at,{ref:r,...n,onClick:s=>{o.onClose(),t==null||t(s)},className:F({[H.close]:!o.unstyled},e),unstyled:o.unstyled})});Xe.displayName="@mantine/core/ModalBaseCloseButton";const Ye=c.forwardRef(({transitionProps:e,className:t,innerProps:n,onKeyDown:r,style:o,...s},l)=>{const a=O();return u.jsx(De,{mounted:a.opened,transition:"pop",...a.transitionProps,onExited:()=>{var d,i,m;(d=a.onExitTransitionEnd)==null||d.call(a),(m=(i=a.transitionProps)==null?void 0:i.onExited)==null||m.call(i)},onEntered:()=>{var d,i,m;(d=a.onEnterTransitionEnd)==null||d.call(a),(m=(i=a.transitionProps)==null?void 0:i.onEntered)==null||m.call(i)},...e,children:d=>u.jsx("div",{...n,className:F({[H.inner]:!a.unstyled},n.className),children:u.jsx(lt,{active:a.opened&&a.trapFocus,innerRef:l,children:u.jsx(ct,{...s,component:"section",role:"dialog",tabIndex:-1,"aria-modal":!0,"aria-describedby":a.bodyMounted?a.getBodyId():void 0,"aria-labelledby":a.titleMounted?a.getTitleId():void 0,style:[o,d],className:F({[H.content]:!a.unstyled},t),unstyled:a.unstyled,children:s.children})})})})});Ye.displayName="@mantine/core/ModalBaseContent";const Ue=c.forwardRef(({className:e,...t},n)=>{const r=O();return u.jsx(te,{component:"header",ref:n,className:F({[H.header]:!r.unstyled},e),...t})});Ue.displayName="@mantine/core/ModalBaseHeader";const an={duration:200,timingFunction:"ease",transition:"fade"};function sn(e){const t=O();return{...an,...t.transitionProps,...e}}const Ge=c.forwardRef(({onClick:e,transitionProps:t,style:n,visible:r,...o},s)=>{const l=O(),a=sn(t);return u.jsx(De,{mounted:r!==void 0?r:l.opened,...a,transition:"fade",children:d=>u.jsx(it,{ref:s,fixed:!0,style:[n,d],zIndex:l.zIndex,unstyled:l.unstyled,onClick:i=>{e==null||e(i),l.closeOnClickOutside&&l.onClose()},...o})})});Ge.displayName="@mantine/core/ModalBaseOverlay";function ln(){const e=O();return c.useEffect(()=>(e.setTitleMounted(!0),()=>e.setTitleMounted(!1)),[]),e.getTitleId()}const Ke=c.forwardRef(({className:e,...t},n)=>{const r=ln(),o=O();return u.jsx(te,{component:"h2",ref:n,className:F({[H.title]:!o.unstyled},e),...t,id:r})});Ke.displayName="@mantine/core/ModalBaseTitle";function cn({children:e}){return u.jsx(u.Fragment,{children:e})}var E={root:"m_f11b401e",header:"m_5a7c2c9",content:"m_b8a05bbd",inner:"m_31cd769a"};const[un,W]=Re("Drawer component was not found in tree"),re=M((e,t)=>{const n=j("DrawerBody",null,e),{classNames:r,className:o,style:s,styles:l,vars:a,...d}=n,i=W();return u.jsx($e,{ref:t,...i.getStyles("body",{classNames:r,style:s,styles:l,className:o}),...d})});re.classes=E;re.displayName="@mantine/core/DrawerBody";const oe=M((e,t)=>{const n=j("DrawerCloseButton",null,e),{classNames:r,className:o,style:s,styles:l,vars:a,...d}=n,i=W();return u.jsx(Xe,{ref:t,...i.getStyles("close",{classNames:r,style:s,styles:l,className:o}),...d})});oe.classes=E;oe.displayName="@mantine/core/DrawerCloseButton";const ae=M((e,t)=>{const n=j("DrawerContent",null,e),{classNames:r,className:o,style:s,styles:l,vars:a,children:d,radius:i,__hidden:m,...y}=n,h=W(),w=h.scrollAreaComponent||cn;return u.jsx(Ye,{...h.getStyles("content",{className:o,style:s,styles:l,classNames:r}),innerProps:h.getStyles("inner",{className:o,style:s,styles:l,classNames:r}),ref:t,...y,radius:i||h.radius||0,"data-hidden":m||void 0,children:u.jsx(w,{style:{height:"calc(100vh - var(--drawer-offset) * 2)"},children:d})})});ae.classes=E;ae.displayName="@mantine/core/DrawerContent";const se=M((e,t)=>{const n=j("DrawerHeader",null,e),{classNames:r,className:o,style:s,styles:l,vars:a,...d}=n,i=W();return u.jsx(Ue,{ref:t,...i.getStyles("header",{classNames:r,style:s,styles:l,className:o}),...d})});se.classes=E;se.displayName="@mantine/core/DrawerHeader";const le=M((e,t)=>{const n=j("DrawerOverlay",null,e),{classNames:r,className:o,style:s,styles:l,vars:a,...d}=n,i=W();return u.jsx(Ge,{ref:t,...i.getStyles("overlay",{classNames:r,style:s,styles:l,className:o}),...d})});le.classes=E;le.displayName="@mantine/core/DrawerOverlay";function dn(e){switch(e){case"top":return"flex-start";case"bottom":return"flex-end";default:return}}function fn(e){if(e==="top"||e==="bottom")return"0 0 calc(100% - var(--drawer-offset, 0rem) * 2)"}const hn={top:"slide-down",bottom:"slide-up",left:"slide-right",right:"slide-left"},mn={top:"slide-down",bottom:"slide-up",right:"slide-right",left:"slide-left"},pn={closeOnClickOutside:!0,withinPortal:!0,lockScroll:!0,trapFocus:!0,returnFocus:!0,closeOnEscape:!0,keepMounted:!1,zIndex:V("modal"),position:"left"},vn=ot((e,{position:t,size:n,offset:r})=>({root:{"--drawer-size":ft(n,"drawer-size"),"--drawer-flex":fn(t),"--drawer-height":t==="left"||t==="right"?void 0:"var(--drawer-size)","--drawer-align":dn(t),"--drawer-justify":t==="right"?"flex-end":void 0,"--drawer-offset":tt(r)}})),ie=M((e,t)=>{const n=j("DrawerRoot",pn,e),{classNames:r,className:o,style:s,styles:l,unstyled:a,vars:d,scrollAreaComponent:i,position:m,transitionProps:y,radius:h,attributes:w,...b}=n,{dir:f}=ht(),p=rt({name:"Drawer",classes:E,props:n,className:o,style:s,classNames:r,styles:l,unstyled:a,attributes:w,vars:d,varsResolver:vn}),S=(f==="rtl"?mn:hn)[m];return u.jsx(un,{value:{scrollAreaComponent:i,getStyles:p,radius:h},children:u.jsx(Ze,{ref:t,...p("root"),transitionProps:{transition:S,...y},"data-offset-scrollbars":i===vt.Autosize||void 0,unstyled:a,...b})})});ie.classes=E;ie.displayName="@mantine/core/DrawerRoot";const[gn,yn]=gt();function Qe({children:e}){const[t,n]=c.useState([]),[r,o]=c.useState(V("modal"));return u.jsx(gn,{value:{stack:t,addModal:(s,l)=>{n(a=>[...new Set([...a,s])]),o(a=>typeof l=="number"&&typeof a=="number"?Math.max(a,l):a)},removeModal:s=>n(l=>l.filter(a=>a!==s)),getZIndex:s=>`calc(${r} + ${t.indexOf(s)} + 1)`,currentId:t[t.length-1],maxZIndex:r},children:e})}Qe.displayName="@mantine/core/DrawerStack";const ce=M((e,t)=>{const n=j("DrawerTitle",null,e),{classNames:r,className:o,style:s,styles:l,vars:a,...d}=n,i=W();return u.jsx(Ke,{ref:t,...i.getStyles("title",{classNames:r,style:s,styles:l,className:o}),...d})});ce.classes=E;ce.displayName="@mantine/core/DrawerTitle";const wn={closeOnClickOutside:!0,withinPortal:!0,lockScroll:!0,trapFocus:!0,returnFocus:!0,closeOnEscape:!0,keepMounted:!1,zIndex:V("modal"),withOverlay:!0,withCloseButton:!0},v=M((e,t)=>{const{title:n,withOverlay:r,overlayProps:o,withCloseButton:s,closeButtonProps:l,children:a,opened:d,stackId:i,zIndex:m,...y}=j("Drawer",wn,e),h=yn(),w=!!n||s,b=h&&i?{closeOnEscape:h.currentId===i,trapFocus:h.currentId===i,zIndex:h.getZIndex(i)}:{},f=r===!1?!1:i&&h?h.currentId===i:d;return c.useEffect(()=>{h&&i&&(d?h.addModal(i,m||V("modal")):h.removeModal(i))},[d,i,m]),u.jsxs(ie,{ref:t,opened:d,zIndex:h&&i?h.getZIndex(i):m,...y,...b,children:[r&&u.jsx(le,{visible:f,transitionProps:h&&i?{duration:0}:void 0,...o}),u.jsxs(ae,{__hidden:h&&i&&d?i!==h.currentId:!1,children:[w&&u.jsxs(se,{children:[n&&u.jsx(ce,{children:n}),s&&u.jsx(oe,{...l})]}),u.jsx(re,{children:a})]})]})});v.classes=E;v.displayName="@mantine/core/Drawer";v.Root=ie;v.Overlay=le;v.Content=ae;v.Body=re;v.Header=se;v.Title=ce;v.CloseButton=oe;v.Stack=Qe;const bn="Panel-module__content___wdGo-",Sn="Panel-module__inner___ruA2b",xn="Panel-module__header___o7SiC",Cn="Panel-module__title___181OP",Pn="Panel-module__body___SEC3T",Bn="Panel-module__footer___t6-hz",R={content:bn,inner:Sn,header:xn,title:Cn,body:Pn,footer:Bn},qe=function({overStyled:t=!1,position:n="right",keepMounted:r=!0,...o}){const s=je(o,t),l={content:R.content,header:R.header,title:R.title,body:R.body,inner:R.inner},a=s.classNames;if(a&&typeof a=="object"&&!Array.isArray(a)){const d=a;Object.keys(d).forEach(i=>{l[i]?l[i]=`${l[i]} ${d[i]}`:l[i]=d[i]})}return u.jsx(v,{position:n,keepMounted:r,closeOnClickOutside:o.closeOnClickOutside??!!o.opened,...s,classNames:l})};qe.displayName="Panel";const ee=c.forwardRef(function({overStyled:t=!1,...n},r){const o=je(n,t),s=o.className,l=s?`${R.footer} ${s}`:R.footer;return u.jsx("div",{ref:r,className:l,...o})});ee.displayName="PanelFooter";const g=qe;g.Root=v.Root;g.Overlay=v.Overlay;g.Content=v.Content;g.Header=v.Header;g.Title=v.Title;g.CloseButton=v.CloseButton;g.Body=v.Body;g.Stack=v.Stack;g.Footer=ee;try{ee.displayName="PanelFooter",ee.__docgenInfo={description:`Panel footer section with action buttons.
Separated from the body by a divider. Remains fixed at the bottom.
This is a Recursica-specific sub-component; Mantine Drawer does not
natively provide a footer.`,displayName:"PanelFooter",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Panel/Panel.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}try{g.displayName="Panel",g.__docgenInfo={description:"",displayName:"Panel",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Panel/Panel.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const Qn={title:"UI-Kit/Panel",component:g,tags:["autodocs"],argTypes:{position:{control:"select",options:["left","right","top","bottom"],description:"Side of the screen the panel slides in from."},title:{control:"text",description:"Panel title displayed in the header."},withOverlay:{control:"boolean",description:"Whether to display a background overlay."},withCloseButton:{control:"boolean",description:"Whether to display the close button in the header."},defaultChecked:{table:{disable:!0}},defaultValue:{table:{disable:!0}},suppressContentEditableWarning:{table:{disable:!0}},suppressHydrationWarning:{table:{disable:!0}}},parameters:{layout:"fullscreen",docs:{description:{component:`
The \`Panel\` component slides in or expands from the edge of the screen to reveal additional content or functionality. Built on Mantine's \`Drawer\`, it enforces Recursica design tokens for styling.

### Anatomy
1. **Header** — Title and close icon, remains fixed on scroll
2. **Divider** — Separates header/footer from content
3. **Body (Slot)** — Scrollable content area for custom content
4. **Footer** — Fixed action buttons (Recursica-specific)

### Usage
\`\`\`tsx
const [opened, { open, close }] = useDisclosure(false);

<Button onClick={open}>Open Panel</Button>
<Panel opened={opened} onClose={close} title="Settings" position="right">
  Content goes here
  <Panel.Footer>
    <Button variant="outline">Cancel</Button>
    <Button variant="solid">Save</Button>
  </Panel.Footer>
</Panel>
\`\`\`
        `}}}},U={args:{position:"right",title:"Panel Title",withOverlay:!0,withCloseButton:!0},render:()=>{const[e,t]=c.useState(!1);return u.jsxs(u.Fragment,{children:[u.jsx(_,{variant:"solid",onClick:()=>t(!0),children:"Open Panel"}),u.jsxs(g,{opened:e,onClose:()=>t(!1),title:"Panel Title",position:"right",children:[u.jsx(pe,{children:"This is the panel body content area. Panels slide in from the edge of the screen to reveal supplementary information, navigation options, or toolsets."}),u.jsxs(g.Footer,{children:[u.jsx(_,{variant:"outline",onClick:()=>t(!1),children:"Cancel"}),u.jsx(_,{variant:"solid",children:"Save"})]})]})]})}},G={args:{position:"left",title:"Navigation",withOverlay:!0,withCloseButton:!0},render:({withLayer:e,layer:t,...n})=>{const[r,o]=c.useState(!1);return u.jsxs(u.Fragment,{children:[u.jsx(_,{variant:"outline",onClick:()=>o(!0),children:"Open Left Panel"}),u.jsx(g,{...n,opened:r,onClose:()=>o(!1),children:u.jsx(pe,{children:"A panel sliding in from the left, commonly used for navigation menus or sidebars."})})]})}},K={args:{position:"right",title:"Scrollable Panel",withOverlay:!0,withCloseButton:!0},render:({withLayer:e,layer:t,...n})=>{const[r,o]=c.useState(!1);return u.jsxs(u.Fragment,{children:[u.jsx(_,{variant:"solid",onClick:()=>o(!0),children:"Open Scrollable Panel"}),u.jsxs(g,{...n,opened:r,onClose:()=>o(!1),children:[Array.from({length:20}).map((s,l)=>u.jsxs("p",{style:{marginBottom:"1rem"},children:["Paragraph ",l+1,": This is sample content to demonstrate the scrollable behavior of the panel when content exceeds the viewport height."]},l)),u.jsxs(g.Footer,{children:[u.jsx(_,{variant:"outline",onClick:()=>o(!1),children:"Close"}),u.jsx(_,{variant:"solid",children:"Apply"})]})]})]})}},Q={args:{position:"right",title:"This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",withOverlay:!0,withCloseButton:!0},render:({...e})=>{const[t,n]=c.useState(!1);return u.jsxs(u.Fragment,{children:[u.jsx(_,{variant:"solid",onClick:()=>n(!0),children:"Open Long Title Panel"}),u.jsx(g,{...e,opened:t,onClose:()=>n(!1),children:u.jsx(pe,{children:"Check the header to see if the long title is handled gracefully without pushing the close button off screen."})})]})}};var Se,xe,Ce;U.parameters={...U.parameters,docs:{...(Se=U.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  args: {
    position: "right",
    title: "Panel Title",
    withOverlay: true,
    withCloseButton: true
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Panel
        </Button>
        <Panel opened={opened} onClose={() => setOpened(false)} title="Panel Title" position="right">
          <Text>
            This is the panel body content area. Panels slide in from the edge
            of the screen to reveal supplementary information, navigation
            options, or toolsets.
          </Text>
          <Panel.Footer>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button variant="solid">Save</Button>
          </Panel.Footer>
        </Panel>
      </>;
  }
}`,...(Ce=(xe=U.parameters)==null?void 0:xe.docs)==null?void 0:Ce.source}}};var Pe,Be,ke;G.parameters={...G.parameters,docs:{...(Pe=G.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  args: {
    position: "left",
    title: "Navigation",
    withOverlay: true,
    withCloseButton: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="outline" onClick={() => setOpened(true)}>
          Open Left Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)}>
          <Text>
            A panel sliding in from the left, commonly used for navigation menus
            or sidebars.
          </Text>
        </Panel>
      </>;
  }
}`,...(ke=(Be=G.parameters)==null?void 0:Be.docs)==null?void 0:ke.source}}};var Te,Ne,Oe;K.parameters={...K.parameters,docs:{...(Te=K.parameters)==null?void 0:Te.docs,source:{originalSource:`{
  args: {
    position: "right",
    title: "Scrollable Panel",
    withOverlay: true,
    withCloseButton: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Scrollable Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)}>
          {Array.from({
          length: 20
        }).map((_, i) => <p key={i} style={{
          marginBottom: "1rem"
        }}>
              Paragraph {i + 1}: This is sample content to demonstrate the
              scrollable behavior of the panel when content exceeds the viewport
              height.
            </p>)}
          <Panel.Footer>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Close
            </Button>
            <Button variant="solid">Apply</Button>
          </Panel.Footer>
        </Panel>
      </>;
  }
}`,...(Oe=(Ne=K.parameters)==null?void 0:Ne.docs)==null?void 0:Oe.source}}};var Ee,_e,Me;Q.parameters={...Q.parameters,docs:{...(Ee=Q.parameters)==null?void 0:Ee.docs,source:{originalSource:`{
  args: {
    position: "right",
    title: "This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",
    withOverlay: true,
    withCloseButton: true
  },
  render: ({
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Long Title Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)}>
          <Text>
            Check the header to see if the long title is handled gracefully
            without pushing the close button off screen.
          </Text>
        </Panel>
      </>;
  }
}`,...(Me=(_e=Q.parameters)==null?void 0:_e.docs)==null?void 0:Me.source}}};const qn=["Default","LeftPosition","ScrollableContent","LongTitle"];export{U as Default,G as LeftPosition,Q as LongTitle,K as ScrollableContent,qn as __namedExportsOrder,Qn as default};
