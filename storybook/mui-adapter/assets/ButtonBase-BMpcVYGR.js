var Pt=Object.defineProperty;var Vt=(n,t,e)=>t in n?Pt(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var ot=(n,t,e)=>Vt(n,typeof t!="symbol"?t+"":t,e);import{r as l,a1 as Bt,R as H,c as y,j as $,p as at,J as Q}from"./iframe-C_ymJL69.js";import{g as lt}from"./generateUtilityClasses-DDbjFgb8.js";import{_ as St,a as wt,b as it,c as Dt,u as Lt}from"./useTimeout-0m_RpfT3.js";import{s as Z,a as Nt}from"./styled-CVDphjR5.js";import{g as jt}from"./generateUtilityClass-BtcU_pBl.js";import{u as st}from"./useForkRef-BlrSiLQa.js";import{u as _}from"./useEventCallback-guZE-voT.js";import{i as rt}from"./isFocusVisible-B8k4qzLc.js";function kt(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function tt(n,t){var e=function(i){return t&&l.isValidElement(i)?t(i):i},a=Object.create(null);return n&&l.Children.map(n,function(o){return o}).forEach(function(o){a[o.key]=e(o)}),a}function $t(n,t){n=n||{},t=t||{};function e(d){return d in t?t[d]:n[d]}var a=Object.create(null),o=[];for(var i in n)i in t?o.length&&(a[i]=o,o=[]):o.push(i);var r,p={};for(var u in t){if(a[u])for(r=0;r<a[u].length;r++){var f=a[u][r];p[a[u][r]]=e(f)}p[u]=e(u)}for(r=0;r<o.length;r++)p[o[r]]=e(o[r]);return p}function k(n,t,e){return e[t]!=null?e[t]:n.props[t]}function vt(n,t){return tt(n.children,function(e){return l.cloneElement(e,{onExited:t.bind(null,e),in:!0,appear:k(e,"appear",n),enter:k(e,"enter",n),exit:k(e,"exit",n)})})}function Ft(n,t,e){var a=tt(n.children),o=$t(t,a);return Object.keys(o).forEach(function(i){var r=o[i];if(l.isValidElement(r)){var p=i in t,u=i in a,f=t[i],d=l.isValidElement(f)&&!f.props.in;u&&(!p||d)?o[i]=l.cloneElement(r,{onExited:e.bind(null,r),in:!0,exit:k(r,"exit",n),enter:k(r,"enter",n)}):!u&&p&&!d?o[i]=l.cloneElement(r,{in:!1}):u&&p&&l.isValidElement(f)&&(o[i]=l.cloneElement(r,{onExited:e.bind(null,r),in:f.props.in,exit:k(r,"exit",n),enter:k(r,"enter",n)}))}}),o}var It=Object.values||function(n){return Object.keys(n).map(function(t){return n[t]})},Ut={component:"div",childFactory:function(t){return t}},et=(function(n){St(t,n);function t(a,o){var i;i=n.call(this,a,o)||this;var r=i.handleExited.bind(kt(i));return i.state={contextValue:{isMounting:!0},handleExited:r,firstRender:!0},i}var e=t.prototype;return e.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},e.componentWillUnmount=function(){this.mounted=!1},t.getDerivedStateFromProps=function(o,i){var r=i.children,p=i.handleExited,u=i.firstRender;return{children:u?vt(o,p):Ft(o,r,p),firstRender:!1}},e.handleExited=function(o,i){var r=tt(this.props.children);o.key in r||(o.props.onExited&&o.props.onExited(i),this.mounted&&this.setState(function(p){var u=Bt({},p.children);return delete u[o.key],{children:u}}))},e.render=function(){var o=this.props,i=o.component,r=o.childFactory,p=wt(o,["component","childFactory"]),u=this.state.contextValue,f=It(this.state.children).map(r);return delete p.appear,delete p.enter,delete p.exit,i===null?H.createElement(it.Provider,{value:u},f):H.createElement(it.Provider,{value:u},H.createElement(i,p,f))},t})(H.Component);et.propTypes={};et.defaultProps=Ut;class G{constructor(){ot(this,"mountEffect",()=>{this.shouldMount&&!this.didMount&&this.ref.current!==null&&(this.didMount=!0,this.mounted.resolve())});this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}static create(){return new G}static use(){const t=Dt(G.create).current,[e,a]=l.useState(!1);return t.shouldMount=e,t.setShouldMount=a,l.useEffect(t.mountEffect,[e]),t}mount(){return this.mounted||(this.mounted=Ot(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}start(...t){this.mount().then(()=>{var e;return(e=this.ref.current)==null?void 0:e.start(...t)})}stop(...t){this.mount().then(()=>{var e;return(e=this.ref.current)==null?void 0:e.stop(...t)})}pulsate(...t){this.mount().then(()=>{var e;return(e=this.ref.current)==null?void 0:e.pulsate(...t)})}}function zt(){return G.use()}function Ot(){let n,t;const e=new Promise((a,o)=>{n=a,t=o});return e.resolve=n,e.reject=t,e}function At(n){const{className:t,classes:e,pulsate:a=!1,rippleX:o,rippleY:i,rippleSize:r,in:p,onExited:u,timeout:f}=n,[d,h]=l.useState(!1),M=y(t,e.ripple,e.rippleVisible,a&&e.ripplePulsate),V={width:r,height:r,top:-(r/2)+i,left:-(r/2)+o},g=y(e.child,d&&e.childLeaving,a&&e.childPulsate);return!p&&!d&&h(!0),l.useEffect(()=>{if(!p&&u!=null){const D=setTimeout(u,f);return()=>{clearTimeout(D)}}},[u,p,f]),$.jsx("span",{className:M,style:V,children:$.jsx("span",{className:g})})}const b=lt("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]),J=550,Xt=80,Yt=Q`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,Kt=Q`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,Wt=Q`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,Ht=Z("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),_t=Z(At,{name:"MuiTouchRipple",slot:"Ripple"})`
  opacity: 0;
  position: absolute;

  &.${b.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${Yt};
    animation-duration: ${J}ms;
    animation-timing-function: ${({theme:n})=>n.transitions.easing.easeInOut};
  }

  &.${b.ripplePulsate} {
    animation-duration: ${({theme:n})=>n.transitions.duration.shorter}ms;
  }

  & .${b.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${b.childLeaving} {
    opacity: 0;
    animation-name: ${Kt};
    animation-duration: ${J}ms;
    animation-timing-function: ${({theme:n})=>n.transitions.easing.easeInOut};
  }

  & .${b.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${Wt};
    animation-duration: 2500ms;
    animation-timing-function: ${({theme:n})=>n.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`,Gt=l.forwardRef(function(t,e){const a=at({props:t,name:"MuiTouchRipple"}),{center:o=!1,classes:i={},className:r,...p}=a,[u,f]=l.useState([]),d=l.useRef(0),h=l.useRef(null);l.useEffect(()=>{h.current&&(h.current(),h.current=null)},[u]);const M=l.useRef(!1),V=Lt(),g=l.useRef(null),D=l.useRef(null),C=l.useCallback(c=>{const{pulsate:E,rippleX:R,rippleY:I,rippleSize:L,cb:z}=c;f(x=>[...x,$.jsx(_t,{classes:{ripple:y(i.ripple,b.ripple),rippleVisible:y(i.rippleVisible,b.rippleVisible),ripplePulsate:y(i.ripplePulsate,b.ripplePulsate),child:y(i.child,b.child),childLeaving:y(i.childLeaving,b.childLeaving),childPulsate:y(i.childPulsate,b.childPulsate)},timeout:J,pulsate:E,rippleX:R,rippleY:I,rippleSize:L},d.current)]),d.current+=1,h.current=z},[i]),v=l.useCallback((c={},E={},R=()=>{})=>{const{pulsate:I=!1,center:L=o||E.pulsate,fakeElement:z=!1}=E;if((c==null?void 0:c.type)==="mousedown"&&M.current){M.current=!1;return}(c==null?void 0:c.type)==="touchstart"&&(M.current=!0);const x=z?null:D.current,B=x?x.getBoundingClientRect():{width:0,height:0,left:0,top:0};let S,T,w;if(L||c===void 0||c.clientX===0&&c.clientY===0||!c.clientX&&!c.touches)S=Math.round(B.width/2),T=Math.round(B.height/2);else{const{clientX:O,clientY:N}=c.touches&&c.touches.length>0?c.touches[0]:c;S=Math.round(O-B.left),T=Math.round(N-B.top)}if(L)w=Math.sqrt((2*B.width**2+B.height**2)/3),w%2===0&&(w+=1);else{const O=Math.max(Math.abs((x?x.clientWidth:0)-S),S)*2+2,N=Math.max(Math.abs((x?x.clientHeight:0)-T),T)*2+2;w=Math.sqrt(O**2+N**2)}c!=null&&c.touches?g.current===null&&(g.current=()=>{C({pulsate:I,rippleX:S,rippleY:T,rippleSize:w,cb:R})},V.start(Xt,()=>{g.current&&(g.current(),g.current=null)})):C({pulsate:I,rippleX:S,rippleY:T,rippleSize:w,cb:R})},[o,C,V]),Y=l.useCallback(()=>{v({},{pulsate:!0})},[v]),F=l.useCallback((c,E)=>{if(V.clear(),(c==null?void 0:c.type)==="touchend"&&g.current){g.current(),g.current=null,V.start(0,()=>{F(c,E)});return}g.current=null,f(R=>R.length>0?R.slice(1):R),h.current=E},[V]);return l.useImperativeHandle(e,()=>({pulsate:Y,start:v,stop:F}),[Y,v,F]),$.jsx(Ht,{className:y(b.root,i.root,r),ref:D,...p,children:$.jsx(et,{component:null,exit:!0,children:u})})});function qt(n){return jt("MuiButtonBase",n)}const Jt=lt("MuiButtonBase",["root","disabled","focusVisible"]),Qt=n=>{const{disabled:t,focusVisible:e,focusVisibleClassName:a,classes:o}=n,r=Nt({root:["root",t&&"disabled",e&&"focusVisible"]},qt,o);return e&&a&&(r.root+=` ${a}`),r},Zt=Z("button",{name:"MuiButtonBase",slot:"Root"})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${Jt.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}}),ue=l.forwardRef(function(t,e){const a=at({props:t,name:"MuiButtonBase"}),{action:o,centerRipple:i=!1,children:r,className:p,component:u="button",disabled:f=!1,disableRipple:d=!1,disableTouchRipple:h=!1,focusRipple:M=!1,focusVisibleClassName:V,LinkComponent:g="a",onBlur:D,onClick:C,onContextMenu:v,onDragLeave:Y,onFocus:F,onFocusVisible:c,onKeyDown:E,onKeyUp:R,onMouseDown:I,onMouseLeave:L,onMouseUp:z,onTouchEnd:x,onTouchMove:B,onTouchStart:S,tabIndex:T=0,TouchRippleProps:w,touchRippleRef:O,type:N,...U}=a,A=l.useRef(null),m=zt(),ut=st(m.ref,O),[j,K]=l.useState(!1);f&&j&&K(!1),l.useImperativeHandle(o,()=>({focusVisible:()=>{K(!0),A.current.focus()}}),[]);const ct=m.shouldMount&&!d&&!f;l.useEffect(()=>{j&&M&&!d&&m.pulsate()},[d,M,j,m]);const pt=P(m,"start",I,h),ft=P(m,"stop",v,h),dt=P(m,"stop",Y,h),ht=P(m,"stop",z,h),mt=P(m,"stop",s=>{j&&s.preventDefault(),L&&L(s)},h),gt=P(m,"start",S,h),bt=P(m,"stop",x,h),Mt=P(m,"stop",B,h),Rt=P(m,"stop",s=>{rt(s.target)||K(!1),D&&D(s)},!1),Et=_(s=>{A.current||(A.current=s.currentTarget),rt(s.target)&&(K(!0),c&&c(s)),F&&F(s)}),q=()=>{const s=A.current;return s?s.tagName==="BUTTON"?!1:!(s.tagName==="A"&&s.href):u&&u!=="button"},xt=_(s=>{M&&!s.repeat&&j&&s.key===" "&&m.stop(s,()=>{m.start(s)}),s.target===s.currentTarget&&q()&&s.key===" "&&s.preventDefault(),E&&E(s),s.target===s.currentTarget&&q()&&s.key==="Enter"&&!f&&(s.preventDefault(),C&&C(s))}),yt=_(s=>{M&&s.key===" "&&j&&!s.defaultPrevented&&m.stop(s,()=>{m.pulsate(s)}),R&&R(s),C&&s.target===s.currentTarget&&q()&&s.key===" "&&!s.defaultPrevented&&!f&&C(s)});let W=u;W==="button"&&(U.href||U.to)&&(W=g);const X={};if(W==="button"){const s=!!U.formAction;X.type=N===void 0&&!s?"button":N,X.disabled=f}else!U.href&&!U.to&&(X.role="button"),f&&(X["aria-disabled"]=f);const Ct=st(e,A),nt={...a,centerRipple:i,component:u,disabled:f,disableRipple:d,disableTouchRipple:h,focusRipple:M,tabIndex:T,focusVisible:j},Tt=Qt(nt);return $.jsxs(Zt,{as:W,className:y(Tt.root,p),ownerState:nt,onBlur:Rt,onClick:C,onContextMenu:ft,onFocus:Et,onKeyDown:xt,onKeyUp:yt,onMouseDown:pt,onMouseLeave:mt,onMouseUp:ht,onDragLeave:dt,onTouchEnd:bt,onTouchMove:Mt,onTouchStart:gt,ref:Ct,tabIndex:f?-1:T,type:N,...X,...U,children:[r,ct?$.jsx(Gt,{ref:ut,center:i,...w}):null]})});function P(n,t,e,a=!1){return _(o=>(e&&e(o),a||n[t](o),!0))}export{ue as B};
