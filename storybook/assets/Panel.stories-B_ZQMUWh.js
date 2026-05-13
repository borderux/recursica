import{r as c,j as d,a as tt,f as Re}from"./iframe-DsZc3vsf.js";import{O as nt,d as V}from"./OptionalPortal-Dp3rbrz2.js";import{B as te,g as F,f as R,u as j,d as rt,e as at}from"./factory-BP28tkBZ.js";import{c as je}from"./create-safe-context-Cb4KZ4Un.js";import{a as ot}from"./CloseButton-CX0nCgMk.js";import{u as st,F as lt,O as it}from"./FocusTrap-BeOHDZLR.js";import{P as ct}from"./Paper-B8iq7C0y.js";import{T as De}from"./Transition-B7qVUdM4.js";import{e as dt,a as ut,g as ft}from"./get-size-CjwDHwpK.js";import{u as ht}from"./DirectionProvider-BX_13-3X.js";import{u as mt}from"./use-reduced-motion-HwDF097m.js";import{u as pt}from"./use-id-3STLzpi6.js";import{S as vt}from"./ScrollArea-zyZMSF1V.js";import{c as gt}from"./create-optional-context-Bgp_MmSe.js";import{B as M}from"./Button-B_4u2-Gr.js";import{T as pe}from"./Text-DeJHUOgV.js";import"./preload-helper-Dp1pzeXC.js";import"./is-element-B5TEyDLt.js";import"./index-DrhMq3Io.js";import"./index-DJdbVkB6.js";import"./use-merged-ref-C17D_COh.js";import"./polymorphic-factory-C-Jj8IzR.js";import"./UnstyledButton-BNekScAg.js";import"./to-int-PQE0s6ay.js";import"./Loader-aUxTA5CY.js";import"./Text-DPUl_d5e.js";var N=function(){return N=Object.assign||function(t){for(var n,r=1,a=arguments.length;r<a;r++){n=arguments[r];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=n[s])}return t},N.apply(this,arguments)};function Ie(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var a=0,r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]]);return n}function yt(e,t,n){if(n||arguments.length===2)for(var r=0,a=t.length,s;r<a;r++)(s||!(r in t))&&(s||(s=Array.prototype.slice.call(t,0,r)),s[r]=t[r]);return e.concat(s||Array.prototype.slice.call(t))}var Q="right-scroll-bar-position",J="width-before-scroll-bar",wt="with-scroll-bars-hidden",bt="--removed-body-scroll-bar-size";function ue(e,t){return typeof e=="function"?e(t):e&&(e.current=t),e}function xt(e,t){var n=c.useState(function(){return{value:e,callback:t,facade:{get current(){return n.value},set current(r){var a=n.value;a!==r&&(n.value=r,n.callback(r,a))}}}})[0];return n.callback=t,n.facade}var St=typeof window<"u"?c.useLayoutEffect:c.useEffect,ve=new WeakMap;function Ct(e,t){var n=xt(null,function(r){return e.forEach(function(a){return ue(a,r)})});return St(function(){var r=ve.get(n);if(r){var a=new Set(r),s=new Set(e),l=n.current;a.forEach(function(o){s.has(o)||ue(o,null)}),s.forEach(function(o){a.has(o)||ue(o,l)})}ve.set(n,e)},[e]),n}function Pt(e){return e}function Tt(e,t){t===void 0&&(t=Pt);var n=[],r=!1,a={read:function(){if(r)throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");return n.length?n[n.length-1]:e},useMedium:function(s){var l=t(s,r);return n.push(l),function(){n=n.filter(function(o){return o!==l})}},assignSyncMedium:function(s){for(r=!0;n.length;){var l=n;n=[],l.forEach(s)}n={push:function(o){return s(o)},filter:function(){return n}}},assignMedium:function(s){r=!0;var l=[];if(n.length){var o=n;n=[],o.forEach(s),l=n}var u=function(){var h=l;l=[],h.forEach(s)},i=function(){return Promise.resolve().then(u)};i(),n={push:function(h){l.push(h),i()},filter:function(h){return l=l.filter(h),n}}}};return a}function Bt(e){e===void 0&&(e={});var t=Tt(null);return t.options=N({async:!0,ssr:!1},e),t}var Le=function(e){var t=e.sideCar,n=Ie(e,["sideCar"]);if(!t)throw new Error("Sidecar: please provide `sideCar` property to import the right car");var r=t.read();if(!r)throw new Error("Sidecar medium not found");return c.createElement(r,N({},n))};Le.isSideCarExport=!0;function _t(e,t){return e.useMedium(t),Le}var Ae=Bt(),fe=function(){},ne=c.forwardRef(function(e,t){var n=c.useRef(null),r=c.useState({onScrollCapture:fe,onWheelCapture:fe,onTouchMoveCapture:fe}),a=r[0],s=r[1],l=e.forwardProps,o=e.children,u=e.className,i=e.removeScrollBar,h=e.enabled,y=e.shards,m=e.sideCar,w=e.noRelative,b=e.noIsolation,f=e.inert,p=e.allowPinchZoom,x=e.as,S=x===void 0?"div":x,P=e.gapMode,T=Ie(e,["forwardProps","children","className","removeScrollBar","enabled","shards","sideCar","noRelative","noIsolation","inert","allowPinchZoom","as","gapMode"]),C=m,_=Ct([n,t]),B=N(N({},T),a);return c.createElement(c.Fragment,null,h&&c.createElement(C,{sideCar:Ae,removeScrollBar:i,shards:y,noRelative:w,noIsolation:b,inert:f,setCallbacks:s,allowPinchZoom:!!p,lockRef:n,gapMode:P}),l?c.cloneElement(c.Children.only(o),N(N({},B),{ref:_})):c.createElement(S,N({},B,{className:u,ref:_}),o))});ne.defaultProps={enabled:!0,removeScrollBar:!0,inert:!1};ne.classNames={fullWidth:J,zeroRight:Q};var Nt=function(){if(typeof __webpack_nonce__<"u")return __webpack_nonce__};function kt(){if(!document)return null;var e=document.createElement("style");e.type="text/css";var t=Nt();return t&&e.setAttribute("nonce",t),e}function Ot(e,t){e.styleSheet?e.styleSheet.cssText=t:e.appendChild(document.createTextNode(t))}function Et(e){var t=document.head||document.getElementsByTagName("head")[0];t.appendChild(e)}var Mt=function(){var e=0,t=null;return{add:function(n){e==0&&(t=kt())&&(Ot(t,n),Et(t)),e++},remove:function(){e--,!e&&t&&(t.parentNode&&t.parentNode.removeChild(t),t=null)}}},Rt=function(){var e=Mt();return function(t,n){c.useEffect(function(){return e.add(t),function(){e.remove()}},[t&&n])}},Fe=function(){var e=Rt(),t=function(n){var r=n.styles,a=n.dynamic;return e(r,a),null};return t},jt={left:0,top:0,right:0,gap:0},he=function(e){return parseInt(e||"",10)||0},Dt=function(e){var t=window.getComputedStyle(document.body),n=t[e==="padding"?"paddingLeft":"marginLeft"],r=t[e==="padding"?"paddingTop":"marginTop"],a=t[e==="padding"?"paddingRight":"marginRight"];return[he(n),he(r),he(a)]},It=function(e){if(e===void 0&&(e="margin"),typeof window>"u")return jt;var t=Dt(e),n=document.documentElement.clientWidth,r=window.innerWidth;return{left:t[0],top:t[1],right:t[2],gap:Math.max(0,r-n+t[2]-t[0])}},Lt=Fe(),A="data-scroll-locked",At=function(e,t,n,r){var a=e.left,s=e.top,l=e.right,o=e.gap;return n===void 0&&(n="margin"),`
  .`.concat(wt,` {
   overflow: hidden `).concat(r,`;
   padding-right: `).concat(o,"px ").concat(r,`;
  }
  body[`).concat(A,`] {
    overflow: hidden `).concat(r,`;
    overscroll-behavior: contain;
    `).concat([t&&"position: relative ".concat(r,";"),n==="margin"&&`
    padding-left: `.concat(a,`px;
    padding-top: `).concat(s,`px;
    padding-right: `).concat(l,`px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(o,"px ").concat(r,`;
    `),n==="padding"&&"padding-right: ".concat(o,"px ").concat(r,";")].filter(Boolean).join(""),`
  }
  
  .`).concat(Q,` {
    right: `).concat(o,"px ").concat(r,`;
  }
  
  .`).concat(J,` {
    margin-right: `).concat(o,"px ").concat(r,`;
  }
  
  .`).concat(Q," .").concat(Q,` {
    right: 0 `).concat(r,`;
  }
  
  .`).concat(J," .").concat(J,` {
    margin-right: 0 `).concat(r,`;
  }
  
  body[`).concat(A,`] {
    `).concat(bt,": ").concat(o,`px;
  }
`)},ge=function(){var e=parseInt(document.body.getAttribute(A)||"0",10);return isFinite(e)?e:0},Ft=function(){c.useEffect(function(){return document.body.setAttribute(A,(ge()+1).toString()),function(){var e=ge()-1;e<=0?document.body.removeAttribute(A):document.body.setAttribute(A,e.toString())}},[])},Ht=function(e){var t=e.noRelative,n=e.noImportant,r=e.gapMode,a=r===void 0?"margin":r;Ft();var s=c.useMemo(function(){return It(a)},[a]);return c.createElement(Lt,{styles:At(s,!t,a,n?"":"!important")})},me=!1;if(typeof window<"u")try{var X=Object.defineProperty({},"passive",{get:function(){return me=!0,!0}});window.addEventListener("test",X,X),window.removeEventListener("test",X,X)}catch{me=!1}var I=me?{passive:!1}:!1,Wt=function(e){return e.tagName==="TEXTAREA"},He=function(e,t){if(!(e instanceof Element))return!1;var n=window.getComputedStyle(e);return n[t]!=="hidden"&&!(n.overflowY===n.overflowX&&!Wt(e)&&n[t]==="visible")},zt=function(e){return He(e,"overflowY")},Vt=function(e){return He(e,"overflowX")},ye=function(e,t){var n=t.ownerDocument,r=t;do{typeof ShadowRoot<"u"&&r instanceof ShadowRoot&&(r=r.host);var a=We(e,r);if(a){var s=ze(e,r),l=s[1],o=s[2];if(l>o)return!0}r=r.parentNode}while(r&&r!==n.body);return!1},Zt=function(e){var t=e.scrollTop,n=e.scrollHeight,r=e.clientHeight;return[t,n,r]},$t=function(e){var t=e.scrollLeft,n=e.scrollWidth,r=e.clientWidth;return[t,n,r]},We=function(e,t){return e==="v"?zt(t):Vt(t)},ze=function(e,t){return e==="v"?Zt(t):$t(t)},Xt=function(e,t){return e==="h"&&t==="rtl"?-1:1},Yt=function(e,t,n,r,a){var s=Xt(e,window.getComputedStyle(t).direction),l=s*r,o=n.target,u=t.contains(o),i=!1,h=l>0,y=0,m=0;do{if(!o)break;var w=ze(e,o),b=w[0],f=w[1],p=w[2],x=f-p-s*b;(b||x)&&We(e,o)&&(y+=x,m+=b);var S=o.parentNode;o=S&&S.nodeType===Node.DOCUMENT_FRAGMENT_NODE?S.host:S}while(!u&&o!==document.body||u&&(t.contains(o)||t===o));return(h&&Math.abs(y)<1||!h&&Math.abs(m)<1)&&(i=!0),i},Y=function(e){return"changedTouches"in e?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0]},we=function(e){return[e.deltaX,e.deltaY]},be=function(e){return e&&"current"in e?e.current:e},Ut=function(e,t){return e[0]===t[0]&&e[1]===t[1]},Gt=function(e){return`
  .block-interactivity-`.concat(e,` {pointer-events: none;}
  .allow-interactivity-`).concat(e,` {pointer-events: all;}
`)},Kt=0,L=[];function qt(e){var t=c.useRef([]),n=c.useRef([0,0]),r=c.useRef(),a=c.useState(Kt++)[0],s=c.useState(Fe)[0],l=c.useRef(e);c.useEffect(function(){l.current=e},[e]),c.useEffect(function(){if(e.inert){document.body.classList.add("block-interactivity-".concat(a));var f=yt([e.lockRef.current],(e.shards||[]).map(be),!0).filter(Boolean);return f.forEach(function(p){return p.classList.add("allow-interactivity-".concat(a))}),function(){document.body.classList.remove("block-interactivity-".concat(a)),f.forEach(function(p){return p.classList.remove("allow-interactivity-".concat(a))})}}},[e.inert,e.lockRef.current,e.shards]);var o=c.useCallback(function(f,p){if("touches"in f&&f.touches.length===2||f.type==="wheel"&&f.ctrlKey)return!l.current.allowPinchZoom;var x=Y(f),S=n.current,P="deltaX"in f?f.deltaX:S[0]-x[0],T="deltaY"in f?f.deltaY:S[1]-x[1],C,_=f.target,B=Math.abs(P)>Math.abs(T)?"h":"v";if("touches"in f&&B==="h"&&_.type==="range")return!1;var Z=window.getSelection(),z=Z&&Z.anchorNode,de=z?z===_||z.contains(_):!1;if(de)return!1;var D=ye(B,_);if(!D)return!0;if(D?C=B:(C=B==="v"?"h":"v",D=ye(B,_)),!D)return!1;if(!r.current&&"changedTouches"in f&&(P||T)&&(r.current=C),!C)return!0;var $=r.current||C;return Yt($,p,f,$==="h"?P:T)},[]),u=c.useCallback(function(f){var p=f;if(!(!L.length||L[L.length-1]!==s)){var x="deltaY"in p?we(p):Y(p),S=t.current.filter(function(C){return C.name===p.type&&(C.target===p.target||p.target===C.shadowParent)&&Ut(C.delta,x)})[0];if(S&&S.should){p.cancelable&&p.preventDefault();return}if(!S){var P=(l.current.shards||[]).map(be).filter(Boolean).filter(function(C){return C.contains(p.target)}),T=P.length>0?o(p,P[0]):!l.current.noIsolation;T&&p.cancelable&&p.preventDefault()}}},[]),i=c.useCallback(function(f,p,x,S){var P={name:f,delta:p,target:x,should:S,shadowParent:Qt(x)};t.current.push(P),setTimeout(function(){t.current=t.current.filter(function(T){return T!==P})},1)},[]),h=c.useCallback(function(f){n.current=Y(f),r.current=void 0},[]),y=c.useCallback(function(f){i(f.type,we(f),f.target,o(f,e.lockRef.current))},[]),m=c.useCallback(function(f){i(f.type,Y(f),f.target,o(f,e.lockRef.current))},[]);c.useEffect(function(){return L.push(s),e.setCallbacks({onScrollCapture:y,onWheelCapture:y,onTouchMoveCapture:m}),document.addEventListener("wheel",u,I),document.addEventListener("touchmove",u,I),document.addEventListener("touchstart",h,I),function(){L=L.filter(function(f){return f!==s}),document.removeEventListener("wheel",u,I),document.removeEventListener("touchmove",u,I),document.removeEventListener("touchstart",h,I)}},[]);var w=e.removeScrollBar,b=e.inert;return c.createElement(c.Fragment,null,b?c.createElement(s,{styles:Gt(a)}):null,w?c.createElement(Ht,{noRelative:e.noRelative,gapMode:e.gapMode}):null)}function Qt(e){for(var t=null;e!==null;)e instanceof ShadowRoot&&(t=e.host,e=e.host),e=e.parentNode;return t}const Jt=_t(Ae,qt);var Ve=c.forwardRef(function(e,t){return c.createElement(ne,N({},e,{ref:t,sideCar:Jt}))});Ve.classNames=ne.classNames;function en(e,t,n){c.useEffect(()=>(window.addEventListener(e,t,n),()=>window.removeEventListener(e,t,n)),[e,t])}const[tn,k]=je("ModalBase component was not found in tree");function nn({opened:e,transitionDuration:t}){const[n,r]=c.useState(e),a=c.useRef(-1),l=mt()?0:t;return c.useEffect(()=>(e?(r(!0),window.clearTimeout(a.current)):l===0?r(!1):a.current=window.setTimeout(()=>r(!1),l),()=>window.clearTimeout(a.current)),[e,l]),n}function rn({id:e,transitionProps:t,opened:n,trapFocus:r,closeOnEscape:a,onClose:s,returnFocus:l}){const o=pt(e),[u,i]=c.useState(!1),[h,y]=c.useState(!1),m=typeof(t==null?void 0:t.duration)=="number"?t==null?void 0:t.duration:200,w=nn({opened:n,transitionDuration:m});return en("keydown",b=>{var f;b.key==="Escape"&&a&&!b.isComposing&&n&&((f=b.target)==null?void 0:f.getAttribute("data-mantine-stop-propagation"))!=="true"&&s()},{capture:!0}),st({opened:n,shouldReturnFocus:r&&l}),{_id:o,titleMounted:u,bodyMounted:h,shouldLockScroll:w,setTitleMounted:i,setBodyMounted:y}}const Ze=c.forwardRef(({keepMounted:e,opened:t,onClose:n,id:r,transitionProps:a,onExitTransitionEnd:s,onEnterTransitionEnd:l,trapFocus:o,closeOnEscape:u,returnFocus:i,closeOnClickOutside:h,withinPortal:y,portalProps:m,lockScroll:w,children:b,zIndex:f,shadow:p,padding:x,__vars:S,unstyled:P,removeScrollProps:T,...C},_)=>{const{_id:B,titleMounted:Z,bodyMounted:z,shouldLockScroll:de,setTitleMounted:D,setBodyMounted:$}=rn({id:r,transitionProps:a,opened:t,trapFocus:o,closeOnEscape:u,onClose:n,returnFocus:i}),{key:Je,...et}=T||{};return d.jsx(nt,{...m,withinPortal:y,children:d.jsx(tn,{value:{opened:t,onClose:n,closeOnClickOutside:h,onExitTransitionEnd:s,onEnterTransitionEnd:l,transitionProps:{...a,keepMounted:e},getTitleId:()=>`${B}-title`,getBodyId:()=>`${B}-body`,titleMounted:Z,bodyMounted:z,setTitleMounted:D,setBodyMounted:$,trapFocus:o,closeOnEscape:u,zIndex:f,unstyled:P},children:d.jsx(Ve,{enabled:de&&w,...et,children:d.jsx(te,{ref:_,...C,__vars:{...S,"--mb-z-index":(f||V("modal")).toString(),"--mb-shadow":ut(p),"--mb-padding":dt(x)},children:b})},Je)})})});Ze.displayName="@mantine/core/ModalBase";var H={title:"m_615af6c9",header:"m_b5489c3c",inner:"m_60c222c7",content:"m_fd1ab0aa",close:"m_606cb269",body:"m_5df29311"};function an(){const e=k();return c.useEffect(()=>(e.setBodyMounted(!0),()=>e.setBodyMounted(!1)),[]),e.getBodyId()}const $e=c.forwardRef(({className:e,...t},n)=>{const r=an(),a=k();return d.jsx(te,{ref:n,...t,id:r,className:F({[H.body]:!a.unstyled},e)})});$e.displayName="@mantine/core/ModalBaseBody";const Xe=c.forwardRef(({className:e,onClick:t,...n},r)=>{const a=k();return d.jsx(ot,{ref:r,...n,onClick:s=>{a.onClose(),t==null||t(s)},className:F({[H.close]:!a.unstyled},e),unstyled:a.unstyled})});Xe.displayName="@mantine/core/ModalBaseCloseButton";const Ye=c.forwardRef(({transitionProps:e,className:t,innerProps:n,onKeyDown:r,style:a,...s},l)=>{const o=k();return d.jsx(De,{mounted:o.opened,transition:"pop",...o.transitionProps,onExited:()=>{var u,i,h;(u=o.onExitTransitionEnd)==null||u.call(o),(h=(i=o.transitionProps)==null?void 0:i.onExited)==null||h.call(i)},onEntered:()=>{var u,i,h;(u=o.onEnterTransitionEnd)==null||u.call(o),(h=(i=o.transitionProps)==null?void 0:i.onEntered)==null||h.call(i)},...e,children:u=>d.jsx("div",{...n,className:F({[H.inner]:!o.unstyled},n.className),children:d.jsx(lt,{active:o.opened&&o.trapFocus,innerRef:l,children:d.jsx(ct,{...s,component:"section",role:"dialog",tabIndex:-1,"aria-modal":!0,"aria-describedby":o.bodyMounted?o.getBodyId():void 0,"aria-labelledby":o.titleMounted?o.getTitleId():void 0,style:[a,u],className:F({[H.content]:!o.unstyled},t),unstyled:o.unstyled,children:s.children})})})})});Ye.displayName="@mantine/core/ModalBaseContent";const Ue=c.forwardRef(({className:e,...t},n)=>{const r=k();return d.jsx(te,{component:"header",ref:n,className:F({[H.header]:!r.unstyled},e),...t})});Ue.displayName="@mantine/core/ModalBaseHeader";const on={duration:200,timingFunction:"ease",transition:"fade"};function sn(e){const t=k();return{...on,...t.transitionProps,...e}}const Ge=c.forwardRef(({onClick:e,transitionProps:t,style:n,visible:r,...a},s)=>{const l=k(),o=sn(t);return d.jsx(De,{mounted:r!==void 0?r:l.opened,...o,transition:"fade",children:u=>d.jsx(it,{ref:s,fixed:!0,style:[n,u],zIndex:l.zIndex,unstyled:l.unstyled,onClick:i=>{e==null||e(i),l.closeOnClickOutside&&l.onClose()},...a})})});Ge.displayName="@mantine/core/ModalBaseOverlay";function ln(){const e=k();return c.useEffect(()=>(e.setTitleMounted(!0),()=>e.setTitleMounted(!1)),[]),e.getTitleId()}const Ke=c.forwardRef(({className:e,...t},n)=>{const r=ln(),a=k();return d.jsx(te,{component:"h2",ref:n,className:F({[H.title]:!a.unstyled},e),...t,id:r})});Ke.displayName="@mantine/core/ModalBaseTitle";function cn({children:e}){return d.jsx(d.Fragment,{children:e})}var O={root:"m_f11b401e",header:"m_5a7c2c9",content:"m_b8a05bbd",inner:"m_31cd769a"};const[dn,W]=je("Drawer component was not found in tree"),re=R((e,t)=>{const n=j("DrawerBody",null,e),{classNames:r,className:a,style:s,styles:l,vars:o,...u}=n,i=W();return d.jsx($e,{ref:t,...i.getStyles("body",{classNames:r,style:s,styles:l,className:a}),...u})});re.classes=O;re.displayName="@mantine/core/DrawerBody";const ae=R((e,t)=>{const n=j("DrawerCloseButton",null,e),{classNames:r,className:a,style:s,styles:l,vars:o,...u}=n,i=W();return d.jsx(Xe,{ref:t,...i.getStyles("close",{classNames:r,style:s,styles:l,className:a}),...u})});ae.classes=O;ae.displayName="@mantine/core/DrawerCloseButton";const oe=R((e,t)=>{const n=j("DrawerContent",null,e),{classNames:r,className:a,style:s,styles:l,vars:o,children:u,radius:i,__hidden:h,...y}=n,m=W(),w=m.scrollAreaComponent||cn;return d.jsx(Ye,{...m.getStyles("content",{className:a,style:s,styles:l,classNames:r}),innerProps:m.getStyles("inner",{className:a,style:s,styles:l,classNames:r}),ref:t,...y,radius:i||m.radius||0,"data-hidden":h||void 0,children:d.jsx(w,{style:{height:"calc(100vh - var(--drawer-offset) * 2)"},children:u})})});oe.classes=O;oe.displayName="@mantine/core/DrawerContent";const se=R((e,t)=>{const n=j("DrawerHeader",null,e),{classNames:r,className:a,style:s,styles:l,vars:o,...u}=n,i=W();return d.jsx(Ue,{ref:t,...i.getStyles("header",{classNames:r,style:s,styles:l,className:a}),...u})});se.classes=O;se.displayName="@mantine/core/DrawerHeader";const le=R((e,t)=>{const n=j("DrawerOverlay",null,e),{classNames:r,className:a,style:s,styles:l,vars:o,...u}=n,i=W();return d.jsx(Ge,{ref:t,...i.getStyles("overlay",{classNames:r,style:s,styles:l,className:a}),...u})});le.classes=O;le.displayName="@mantine/core/DrawerOverlay";function un(e){switch(e){case"top":return"flex-start";case"bottom":return"flex-end";default:return}}function fn(e){if(e==="top"||e==="bottom")return"0 0 calc(100% - var(--drawer-offset, 0rem) * 2)"}const hn={top:"slide-down",bottom:"slide-up",left:"slide-right",right:"slide-left"},mn={top:"slide-down",bottom:"slide-up",right:"slide-right",left:"slide-left"},pn={closeOnClickOutside:!0,withinPortal:!0,lockScroll:!0,trapFocus:!0,returnFocus:!0,closeOnEscape:!0,keepMounted:!1,zIndex:V("modal"),position:"left"},vn=at((e,{position:t,size:n,offset:r})=>({root:{"--drawer-size":ft(n,"drawer-size"),"--drawer-flex":fn(t),"--drawer-height":t==="left"||t==="right"?void 0:"var(--drawer-size)","--drawer-align":un(t),"--drawer-justify":t==="right"?"flex-end":void 0,"--drawer-offset":tt(r)}})),ie=R((e,t)=>{const n=j("DrawerRoot",pn,e),{classNames:r,className:a,style:s,styles:l,unstyled:o,vars:u,scrollAreaComponent:i,position:h,transitionProps:y,radius:m,attributes:w,...b}=n,{dir:f}=ht(),p=rt({name:"Drawer",classes:O,props:n,className:a,style:s,classNames:r,styles:l,unstyled:o,attributes:w,vars:u,varsResolver:vn}),x=(f==="rtl"?mn:hn)[h];return d.jsx(dn,{value:{scrollAreaComponent:i,getStyles:p,radius:m},children:d.jsx(Ze,{ref:t,...p("root"),transitionProps:{transition:x,...y},"data-offset-scrollbars":i===vt.Autosize||void 0,unstyled:o,...b})})});ie.classes=O;ie.displayName="@mantine/core/DrawerRoot";const[gn,yn]=gt();function qe({children:e}){const[t,n]=c.useState([]),[r,a]=c.useState(V("modal"));return d.jsx(gn,{value:{stack:t,addModal:(s,l)=>{n(o=>[...new Set([...o,s])]),a(o=>typeof l=="number"&&typeof o=="number"?Math.max(o,l):o)},removeModal:s=>n(l=>l.filter(o=>o!==s)),getZIndex:s=>`calc(${r} + ${t.indexOf(s)} + 1)`,currentId:t[t.length-1],maxZIndex:r},children:e})}qe.displayName="@mantine/core/DrawerStack";const ce=R((e,t)=>{const n=j("DrawerTitle",null,e),{classNames:r,className:a,style:s,styles:l,vars:o,...u}=n,i=W();return d.jsx(Ke,{ref:t,...i.getStyles("title",{classNames:r,style:s,styles:l,className:a}),...u})});ce.classes=O;ce.displayName="@mantine/core/DrawerTitle";const wn={closeOnClickOutside:!0,withinPortal:!0,lockScroll:!0,trapFocus:!0,returnFocus:!0,closeOnEscape:!0,keepMounted:!1,zIndex:V("modal"),withOverlay:!0,withCloseButton:!0},v=R((e,t)=>{const{title:n,withOverlay:r,overlayProps:a,withCloseButton:s,closeButtonProps:l,children:o,opened:u,stackId:i,zIndex:h,...y}=j("Drawer",wn,e),m=yn(),w=!!n||s,b=m&&i?{closeOnEscape:m.currentId===i,trapFocus:m.currentId===i,zIndex:m.getZIndex(i)}:{},f=r===!1?!1:i&&m?m.currentId===i:u;return c.useEffect(()=>{m&&i&&(u?m.addModal(i,h||V("modal")):m.removeModal(i))},[u,i,h]),d.jsxs(ie,{ref:t,opened:u,zIndex:m&&i?m.getZIndex(i):h,...y,...b,children:[r&&d.jsx(le,{visible:f,transitionProps:m&&i?{duration:0}:void 0,...a}),d.jsxs(oe,{__hidden:m&&i&&u?i!==m.currentId:!1,children:[w&&d.jsxs(se,{children:[n&&d.jsx(ce,{children:n}),s&&d.jsx(ae,{...l})]}),d.jsx(re,{children:o})]})]})});v.classes=O;v.displayName="@mantine/core/Drawer";v.Root=ie;v.Overlay=le;v.Content=oe;v.Body=re;v.Header=se;v.Title=ce;v.CloseButton=ae;v.Stack=qe;const bn="Panel-module__content___wdGo-",xn="Panel-module__inner___ruA2b",Sn="Panel-module__header___o7SiC",Cn="Panel-module__title___181OP recursica_brand_typography_h3",Pn="Panel-module__titleTruncate___fuP6V Panel-module__title___181OP recursica_brand_typography_h3",Tn="Panel-module__body___SEC3T",Bn="Panel-module__footer___t6-hz",E={content:bn,inner:xn,header:Sn,title:Cn,titleTruncate:Pn,body:Tn,footer:Bn},Qe=function({overStyled:t=!1,position:n="right",keepMounted:r=!0,wrapHeaderText:a=!1,...s}){const l=Re(s,t),o={content:E.content,header:E.header,title:a?E.titleTruncate:E.title,body:E.body,inner:E.inner},u=l.classNames;if(u&&typeof u=="object"&&!Array.isArray(u)){const i=u;Object.keys(i).forEach(h=>{o[h]?o[h]=`${o[h]} ${i[h]}`:o[h]=i[h]})}return d.jsx(v,{position:n,keepMounted:r,closeOnClickOutside:s.closeOnClickOutside??!!s.opened,...l,classNames:o})};Qe.displayName="Panel";const ee=c.forwardRef(function({overStyled:t=!1,...n},r){const a=Re(n,t),s=a.className,l=s?`${E.footer} ${s}`:E.footer;return d.jsx("div",{ref:r,className:l,...a})});ee.displayName="PanelFooter";const g=Qe;g.Root=v.Root;g.Overlay=v.Overlay;g.Content=v.Content;g.Header=v.Header;g.Title=v.Title;g.CloseButton=v.CloseButton;g.Body=v.Body;g.Stack=v.Stack;g.Footer=ee;try{ee.displayName="PanelFooter",ee.__docgenInfo={description:`Panel footer section with action buttons.
Separated from the body by a divider. Remains fixed at the bottom.
This is a Recursica-specific sub-component; Mantine Drawer does not
natively provide a footer.`,displayName:"PanelFooter",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Panel/Panel.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}try{g.displayName="Panel",g.__docgenInfo={description:"",displayName:"Panel",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Panel/Panel.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}},wrapHeaderText:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/components/Panel/Panel.tsx",name:"RecursicaPanelProps"},{fileName:"mantine-adapter/src/components/Panel/Panel.tsx",name:"RecursicaPanelProps"}],description:"If true, forces the header text to a single line and truncates with an ellipsis.\nNote: While the prop is named `wrapHeaderText` for backward compatibility,\nsetting it to `true` actually PREVENTS wrapping (it forces truncation).",name:"wrapHeaderText",parent:{fileName:"mantine-adapter/src/components/Panel/Panel.tsx",name:"RecursicaPanelProps"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const Jn={title:"UI-Kit/Panel",component:g,tags:["autodocs"],argTypes:{position:{control:"select",options:["left","right","top","bottom"],description:"Side of the screen the panel slides in from."},title:{control:"text",description:"Panel title displayed in the header."},withOverlay:{control:"boolean",description:"Whether to display a background overlay."},withCloseButton:{control:"boolean",description:"Whether to display the close button in the header."},wrapHeaderText:{control:"boolean",description:"If true, forces the header text to a single line and truncates with an ellipsis."},defaultChecked:{table:{disable:!0}},defaultValue:{table:{disable:!0}},suppressContentEditableWarning:{table:{disable:!0}},suppressHydrationWarning:{table:{disable:!0}}},parameters:{layout:"fullscreen",docs:{description:{component:`
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
        `}}}},U={args:{position:"right",title:"Panel Title",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({wrapHeaderText:e,...t})=>{const[n,r]=c.useState(!1);return d.jsxs(d.Fragment,{children:[d.jsx(M,{variant:"solid",onClick:()=>r(!0),children:"Open Panel"}),d.jsxs(g,{...t,opened:n,onClose:()=>r(!1),title:"Panel Title",position:"right",wrapHeaderText:e,children:[d.jsx(pe,{children:"This is the panel body content area. Panels slide in from the edge of the screen to reveal supplementary information, navigation options, or toolsets."}),d.jsxs(g.Footer,{children:[d.jsx(M,{variant:"outline",onClick:()=>r(!1),children:"Cancel"}),d.jsx(M,{variant:"solid",children:"Save"})]})]})]})}},G={args:{position:"left",title:"Navigation",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({withLayer:e,layer:t,...n})=>{const[r,a]=c.useState(!1);return d.jsxs(d.Fragment,{children:[d.jsx(M,{variant:"outline",onClick:()=>a(!0),children:"Open Left Panel"}),d.jsx(g,{...n,opened:r,onClose:()=>a(!1),children:d.jsx(pe,{children:"A panel sliding in from the left, commonly used for navigation menus or sidebars."})})]})}},K={args:{position:"right",title:"Scrollable Panel",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({withLayer:e,layer:t,...n})=>{const[r,a]=c.useState(!1);return d.jsxs(d.Fragment,{children:[d.jsx(M,{variant:"solid",onClick:()=>a(!0),children:"Open Scrollable Panel"}),d.jsxs(g,{...n,opened:r,onClose:()=>a(!1),children:[Array.from({length:20}).map((s,l)=>d.jsxs("p",{style:{marginBottom:"1rem"},children:["Paragraph ",l+1,": This is sample content to demonstrate the scrollable behavior of the panel when content exceeds the viewport height."]},l)),d.jsxs(g.Footer,{children:[d.jsx(M,{variant:"outline",onClick:()=>a(!1),children:"Close"}),d.jsx(M,{variant:"solid",children:"Apply"})]})]})]})}},q={args:{position:"right",title:"This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!0},render:({...e})=>{const[t,n]=c.useState(!1);return d.jsxs(d.Fragment,{children:[d.jsx(M,{variant:"solid",onClick:()=>n(!0),children:"Open Long Title Panel"}),d.jsx(g,{...e,opened:t,onClose:()=>n(!1),children:d.jsx(pe,{children:"Check the header to see if the long title is handled gracefully without pushing the close button off screen."})})]})}};var xe,Se,Ce;U.parameters={...U.parameters,docs:{...(xe=U.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    position: "right",
    title: "Panel Title",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false
  },
  render: ({
    wrapHeaderText,
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)} title="Panel Title" position="right" wrapHeaderText={wrapHeaderText}>
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
}`,...(Ce=(Se=U.parameters)==null?void 0:Se.docs)==null?void 0:Ce.source}}};var Pe,Te,Be;G.parameters={...G.parameters,docs:{...(Pe=G.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  args: {
    position: "left",
    title: "Navigation",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false
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
}`,...(Be=(Te=G.parameters)==null?void 0:Te.docs)==null?void 0:Be.source}}};var _e,Ne,ke;K.parameters={...K.parameters,docs:{...(_e=K.parameters)==null?void 0:_e.docs,source:{originalSource:`{
  args: {
    position: "right",
    title: "Scrollable Panel",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false
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
}`,...(ke=(Ne=K.parameters)==null?void 0:Ne.docs)==null?void 0:ke.source}}};var Oe,Ee,Me;q.parameters={...q.parameters,docs:{...(Oe=q.parameters)==null?void 0:Oe.docs,source:{originalSource:`{
  args: {
    position: "right",
    title: "This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: true
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
}`,...(Me=(Ee=q.parameters)==null?void 0:Ee.docs)==null?void 0:Me.source}}};const er=["Default","LeftPosition","ScrollableContent","LongTitle"];export{U as Default,G as LeftPosition,q as LongTitle,K as ScrollableContent,er as __namedExportsOrder,Jn as default};
