import{r as R,q as w,j as c,c as N,t as l,J as $,K as b}from"./iframe-BTksmf0I.js";import{m as h}from"./memoTheme-vMW9oVsi.js";import{c as T}from"./createSimplePaletteValueFilter-bm0fmN_7.js";import{g as U,a as E}from"./generateUtilityClasses-DGi4yQgU.js";import{a as F,s as p}from"./styled-C6tCmiHg.js";function I(r){return U("MuiCircularProgress",r)}E("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","track","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);const s=44,g=b`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,y=b`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`,K=typeof g!="string"?$`
        animation: ${g} 1.4s linear infinite;
      `:null,z=typeof y!="string"?$`
        animation: ${y} 1.4s ease-in-out infinite;
      `:null,A=r=>{const{classes:e,variant:t,color:i,disableShrink:m}=r,u={root:["root",t,`color${l(i)}`],svg:["svg"],track:["track"],circle:["circle",`circle${l(t)}`,m&&"circleDisableShrink"]};return F(u,I,e)},O=p("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:t}=r;return[e.root,e[t.variant],e[`color${l(t.color)}`]]}})(h(({theme:r})=>({display:"inline-block",variants:[{props:{variant:"determinate"},style:{transition:r.transitions.create("transform")}},{props:{variant:"indeterminate"},style:K||{animation:`${g} 1.4s linear infinite`}},...Object.entries(r.palette).filter(T()).map(([e])=>({props:{color:e},style:{color:(r.vars||r).palette[e].main}}))]}))),V=p("svg",{name:"MuiCircularProgress",slot:"Svg"})({display:"block"}),W=p("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(r,e)=>{const{ownerState:t}=r;return[e.circle,e[`circle${l(t.variant)}`],t.disableShrink&&e.circleDisableShrink]}})(h(({theme:r})=>({stroke:"currentColor",variants:[{props:{variant:"determinate"},style:{transition:r.transitions.create("stroke-dashoffset")}},{props:{variant:"indeterminate"},style:{strokeDasharray:"80px, 200px",strokeDashoffset:0}},{props:({ownerState:e})=>e.variant==="indeterminate"&&!e.disableShrink,style:z||{animation:`${y} 1.4s ease-in-out infinite`}}]}))),q=p("circle",{name:"MuiCircularProgress",slot:"Track"})(h(({theme:r})=>({stroke:"currentColor",opacity:(r.vars||r).palette.action.activatedOpacity}))),L=R.forwardRef(function(e,t){const i=w({props:e,name:"MuiCircularProgress"}),{className:m,color:u="primary",disableShrink:D=!1,enableTrackSlot:v=!1,size:d=40,style:M,thickness:a=3.6,value:f=0,variant:x="indeterminate",...j}=i,o={...i,color:u,disableShrink:D,size:d,thickness:a,value:f,variant:x,enableTrackSlot:v},n=A(o),k={},C={},P={};if(x==="determinate"){const S=2*Math.PI*((s-a)/2);k.strokeDasharray=S.toFixed(3),P["aria-valuenow"]=Math.round(f),k.strokeDashoffset=`${((100-f)/100*S).toFixed(3)}px`,C.transform="rotate(-90deg)"}return c.jsx(O,{className:N(n.root,m),style:{width:d,height:d,...C,...M},ownerState:o,ref:t,role:"progressbar",...P,...j,children:c.jsxs(V,{className:n.svg,ownerState:o,viewBox:`${s/2} ${s/2} ${s} ${s}`,children:[v?c.jsx(q,{className:n.track,ownerState:o,cx:s,cy:s,r:(s-a)/2,fill:"none",strokeWidth:a,"aria-hidden":"true"}):null,c.jsx(W,{className:n.circle,style:k,ownerState:o,cx:s,cy:s,r:(s-a)/2,fill:"none",strokeWidth:a})]})})});export{L as C};
