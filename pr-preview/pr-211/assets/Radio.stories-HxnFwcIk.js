import{j as r,a as ae,p as ye,g as $,c as ve,r as H,i as oe}from"./iframe-CaYtvSrb.js";import{T as re}from"./Typography-BhyNJLrw.js";import{c as K,g as J,b as E}from"./Typography.css.ts.vanilla-BTGOHLvo.js";import{g as Re,G as ze}from"./Group-HehgeNYv.js";import{f as q,u as D,a as M}from"./polymorphic-factory-BpB2RHWM.js";import{B as W,e as Ne}from"./Box-DI5237On.js";import{I as Ve,a as Ge}from"./InputsGroupFieldset-HapVOMKu.js";import{u as Pe}from"./DirectionProvider-DWDc5vGv.js";import{U as Ae}from"./UnstyledButton-C-YKXJpa.js";import{c as he}from"./create-optional-context-DsJxXQb7.js";import{I as ge}from"./Input-DZyKGPx9.js";import{u as _e}from"./use-id-CLb0k7dv.js";import{u as $e}from"./use-uncontrolled-B6Yp00Ct.js";import"./preload-helper-CZ_saIiD.js";const[Ee,we]=he(),[Te,qe]=he();var xe={card:"m_9dc8ae12"};const De={withBorder:!0},Be=K((e,{radius:a})=>({card:{"--card-radius":J(a)}})),Q=q((e,a)=>{const o=D("RadioCard",De,e),{classNames:s,className:i,style:t,styles:n,unstyled:l,vars:m,checked:R,mod:x,withBorder:C,value:h,onClick:g,name:y,onKeyDown:f,attributes:z,...j}=o,S=M({name:"RadioCard",classes:xe,props:o,className:i,style:t,classNames:s,styles:n,unstyled:l,attributes:z,vars:m,varsResolver:Be,rootSelector:"card"}),{dir:_}=Pe(),d=we(),v=typeof R=="boolean"?R:(d==null?void 0:d.value)===h||!1,N=y||(d==null?void 0:d.name),I=p=>{if(f==null||f(p),["ArrowDown","ArrowUp","ArrowLeft","ArrowRight"].includes(p.nativeEvent.code)){p.preventDefault();const u=Array.from(document.querySelectorAll(`[role="radio"][name="${N||"__mantine"}"]`)),L=u.findIndex(O=>O===p.target),b=L+1>=u.length?0:L+1,c=L-1<0?u.length-1:L-1;p.nativeEvent.code==="ArrowDown"&&(u[b].focus(),u[b].click()),p.nativeEvent.code==="ArrowUp"&&(u[c].focus(),u[c].click()),p.nativeEvent.code==="ArrowLeft"&&(u[_==="ltr"?c:b].focus(),u[_==="ltr"?c:b].click()),p.nativeEvent.code==="ArrowRight"&&(u[_==="ltr"?b:c].focus(),u[_==="ltr"?b:c].click())}};return r.jsx(Te,{value:{checked:v},children:r.jsx(Ae,{ref:a,mod:[{"with-border":C,checked:v},x],...S("card"),...j,role:"radio","aria-checked":v,name:N,onClick:p=>{g==null||g(p),d==null||d.onChange(h||"")},onKeyDown:I})})});Q.displayName="@mantine/core/RadioCard";Q.classes=xe;const B=q((e,a)=>{const{value:o,defaultValue:s,onChange:i,size:t,wrapperProps:n,children:l,name:m,readOnly:R,...x}=D("RadioGroup",null,e),C=_e(m),[h,g]=$e({value:o,defaultValue:s,finalValue:"",onChange:i}),y=f=>!R&&g(typeof f=="string"?f:f.currentTarget.value);return r.jsx(Ee,{value:{value:h,onChange:y,size:t,name:C},children:r.jsx(ge.Wrapper,{size:t,ref:a,...n,...x,labelElement:"div",__staticSelector:"RadioGroup",children:r.jsx(Ve,{role:"radiogroup",children:l})})})});B.classes=ge.Wrapper.classes;B.displayName="@mantine/core/RadioGroup";function Ce({size:e,style:a,...o}){return r.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 5 5",style:{width:ae(e),height:ae(e),...a},"aria-hidden":!0,...o,children:r.jsx("circle",{cx:"2.5",cy:"2.5",r:"2.5",fill:"currentColor"})})}var je={indicator:"m_717d7ff6",icon:"m_3e4da632","indicator--outline":"m_2980836c"};const Oe={icon:Ce},Ue=K((e,{radius:a,color:o,size:s,iconColor:i,variant:t,autoContrast:n})=>{const l=ye({color:o||e.primaryColor,theme:e}),m=l.isThemeColor&&l.shade===void 0?`var(--mantine-color-${l.color}-outline)`:l.color;return{indicator:{"--radio-size":E(s,"radio-size"),"--radio-radius":a===void 0?void 0:J(a),"--radio-color":t==="outline"?m:$(o,e),"--radio-icon-size":E(s,"radio-icon-size"),"--radio-icon-color":i?$(i,e):Re(n,e)?ve({color:o,theme:e,autoContrast:n}):void 0}}}),X=q((e,a)=>{const o=D("RadioIndicator",Oe,e),{classNames:s,className:i,style:t,styles:n,unstyled:l,vars:m,icon:R,radius:x,color:C,iconColor:h,autoContrast:g,checked:y,mod:f,variant:z,disabled:j,attributes:S,..._}=o,d=M({name:"RadioIndicator",classes:je,props:o,className:i,style:t,classNames:s,styles:n,unstyled:l,attributes:S,vars:m,varsResolver:Ue,rootSelector:"indicator"}),v=qe(),N=typeof y=="boolean"?y:(v==null?void 0:v.checked)||!1;return r.jsx(W,{ref:a,...d("indicator",{variant:z}),variant:z,mod:[{checked:N,disabled:j},f],..._,children:r.jsx(R,{...d("icon")})})});X.displayName="@mantine/core/RadioIndicator";X.classes=je;var Se={root:"m_f3f1af94",inner:"m_89c4f5e4",icon:"m_f3ed6b2b",radio:"m_8a3dbb89","radio--outline":"m_1bfe9d39"};const We={labelPosition:"right"},Fe=K((e,{size:a,radius:o,color:s,iconColor:i,variant:t,autoContrast:n})=>{const l=ye({color:s||e.primaryColor,theme:e}),m=l.isThemeColor&&l.shade===void 0?`var(--mantine-color-${l.color}-outline)`:l.color;return{root:{"--radio-size":E(a,"radio-size"),"--radio-radius":o===void 0?void 0:J(o),"--radio-color":t==="outline"?m:$(s,e),"--radio-icon-color":i?$(i,e):Re(n,e)?ve({color:s,theme:e,autoContrast:n}):void 0,"--radio-icon-size":E(a,"radio-icon-size")}}}),k=q((e,a)=>{const o=D("Radio",We,e),{classNames:s,className:i,style:t,styles:n,unstyled:l,vars:m,id:R,size:x,label:C,labelPosition:h,description:g,error:y,radius:f,color:z,variant:j,disabled:S,wrapperProps:_,icon:d=Ce,rootRef:v,iconColor:N,onChange:I,mod:p,attributes:u,...L}=o,b=M({name:"Radio",classes:Se,props:o,className:i,style:t,classNames:s,styles:n,unstyled:l,attributes:u,vars:m,varsResolver:Fe}),c=we(),O=(c==null?void 0:c.size)??x,Le=o.size?x:O,{styleProps:ke,rest:U}=Ne(L),Y=_e(R),Z=c?{checked:c.value===U.value,name:U.name??c.name,onChange:ee=>{c.onChange(ee),I==null||I(ee)}}:{};return r.jsx(Ge,{...b("root"),__staticSelector:"Radio",__stylesApiProps:o,id:Y,size:Le,labelPosition:h,label:C,description:g,error:y,disabled:S,classNames:s,styles:n,unstyled:l,"data-checked":Z.checked||void 0,variant:j,ref:v,mod:p,...ke,..._,children:r.jsxs(W,{...b("inner"),mod:{"label-position":h},children:[r.jsx(W,{...b("radio",{focusable:!0,variant:j}),onChange:I,...U,...Z,component:"input",mod:{error:!!y},ref:a,id:Y,disabled:S,type:"radio"}),r.jsx(d,{...b("icon"),"aria-hidden":!0})]})})});k.classes=Se;k.displayName="@mantine/core/Radio";k.Group=B;k.Card=Q;k.Indicator=X;var w={group:"recursica-l8ylja6",groupLabel:"recursica-l8ylja7",label:"recursica-l8ylja4",labelWrapper:"recursica-l8ylja5",body:"recursica-l8ylja1",radio:"recursica-l8ylja2",inner:"recursica-l8ylja3",icon:"recursica-l8ylja8"};const He=H.forwardRef((e,a)=>r.jsxs(ze,{ref:a,...e,className:w.groupLabel,children:[r.jsx(re,{variant:"body-2/normal",color:"form/label/color/default-color",children:e.label}),e.optional&&r.jsx(re,{variant:"caption",color:"form/label/color/default-color",as:"span",opacity:.84,children:"(optional)"})]})),Ke=H.forwardRef(({...e},a)=>r.jsx(B,{...e,ref:a,label:r.jsx(He,{label:e.label,optional:e.optional}),classNames:{root:w.group}})),Ie=H.forwardRef(({showLabel:e=!0,...a},o)=>r.jsx(k,{...a,ref:o,label:e?a.label:void 0,"aria-label":a.label,style:{"--radio-icon-size":oe["radio/size/dot"],"--radio-size":oe["radio/size/width"]},classNames:{label:w.label,labelWrapper:w.labelWrapper,body:w.body,radio:w.radio,inner:w.inner,icon:w.icon}}));Ie.Group=Ke;const T=Ie;try{T.displayName="Radio",T.__docgenInfo={description:"",displayName:"Radio",props:{showLabel:{defaultValue:{value:"true"},description:"If true, the label will be hidden and the radio will be shown as a standalone item.",name:"showLabel",required:!1,type:{name:"boolean | undefined"}},label:{defaultValue:null,description:"The label for the radio.",name:"label",required:!0,type:{name:"string"}}}}}catch{}function F({radios:e,label:a,optional:o,defaultValue:s}){return r.jsx(T.Group,{name:"favoriteFramework",label:a,optional:o,defaultValue:s,children:e.map(({value:i,label:t,disabled:n,showLabel:l})=>r.jsx(T,{value:i,label:t,disabled:n,showLabel:l},i))})}try{F.displayName="RadioStoryComponent",F.__docgenInfo={description:"",displayName:"RadioStoryComponent",props:{radios:{defaultValue:null,description:"",name:"radios",required:!0,type:{name:"RadioStory[]"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},optional:{defaultValue:null,description:"",name:"optional",required:!1,type:{name:"boolean | undefined"}},defaultValue:{defaultValue:null,description:"",name:"defaultValue",required:!1,type:{name:"string | undefined"}}}}}catch{}const ta={title:"Radio",component:F,decorators:[],parameters:{layout:"centered"},tags:["autodocs"],args:{}},V={args:{label:"Select your radio option",radios:[{value:"rad1",label:"Radio 1",showLabel:!1},{value:"rad2",label:"Radio 2 Lorem ipsum dolor sit amet",showLabel:!1},{value:"rad3",label:"Radio 3",disabled:!0,showLabel:!1}]}},G={args:{label:"Select your radio option",radios:[{value:"rad1",label:"Radio 1"},{value:"rad2",label:"Radio 2 Lorem ipsum dolor sit amet"},{value:"rad3",label:"Radio 3",disabled:!0}]}},P={args:{label:"Select your radio option",optional:!0,radios:[{value:"rad1",label:"Radio 1"},{value:"rad2",label:"Radio 2 Lorem ipsum dolor sit amet"},{value:"rad3",label:"Radio 3",disabled:!0}]}},A={args:{label:"Select your radio option",defaultValue:"rad3",radios:[{value:"rad1",label:"Radio 1"},{value:"rad2",label:"Radio 2 Lorem ipsum dolor sit amet"},{value:"rad3",label:"Radio 3",disabled:!0}]}};var le,se,ie;V.parameters={...V.parameters,docs:{...(le=V.parameters)==null?void 0:le.docs,source:{originalSource:`{
  args: {
    label: "Select your radio option",
    radios: [{
      value: "rad1",
      label: "Radio 1",
      showLabel: false
    }, {
      value: "rad2",
      label: "Radio 2 Lorem ipsum dolor sit amet",
      showLabel: false
    }, {
      value: "rad3",
      label: "Radio 3",
      disabled: true,
      showLabel: false
    }]
  }
}`,...(ie=(se=V.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};var ne,te,de;G.parameters={...G.parameters,docs:{...(ne=G.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    label: "Select your radio option",
    radios: [{
      value: "rad1",
      label: "Radio 1"
    }, {
      value: "rad2",
      label: "Radio 2 Lorem ipsum dolor sit amet"
    }, {
      value: "rad3",
      label: "Radio 3",
      disabled: true
    }]
  }
}`,...(de=(te=G.parameters)==null?void 0:te.docs)==null?void 0:de.source}}};var ce,ue,pe;P.parameters={...P.parameters,docs:{...(ce=P.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    label: "Select your radio option",
    optional: true,
    radios: [{
      value: "rad1",
      label: "Radio 1"
    }, {
      value: "rad2",
      label: "Radio 2 Lorem ipsum dolor sit amet"
    }, {
      value: "rad3",
      label: "Radio 3",
      disabled: true
    }]
  }
}`,...(pe=(ue=P.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var me,be,fe;A.parameters={...A.parameters,docs:{...(me=A.parameters)==null?void 0:me.docs,source:{originalSource:`{
  args: {
    label: "Select your radio option",
    defaultValue: "rad3",
    radios: [{
      value: "rad1",
      label: "Radio 1"
    }, {
      value: "rad2",
      label: "Radio 2 Lorem ipsum dolor sit amet"
    }, {
      value: "rad3",
      label: "Radio 3",
      disabled: true
    }]
  }
}`,...(fe=(be=A.parameters)==null?void 0:be.docs)==null?void 0:fe.source}}};const da=["HideLabel","Default","Optional","Controlled"];export{A as Controlled,G as Default,V as HideLabel,P as Optional,da as __namedExportsOrder,ta as default};
