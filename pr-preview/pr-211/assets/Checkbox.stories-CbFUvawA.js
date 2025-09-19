import{r as y,j as l,p as me,g as O,c as ke}from"./iframe-CaYtvSrb.js";import{c as D,g as F,b as Ce}from"./Typography.css.ts.vanilla-BTGOHLvo.js";import{T as Z}from"./Typography-BhyNJLrw.js";import{I as ee}from"./Icon-P8eDKGJe.js";import{g as fe,G as Re}from"./Group-HehgeNYv.js";import{f as B,u as E,a as H}from"./polymorphic-factory-BpB2RHWM.js";import{B as N,e as $e}from"./Box-DI5237On.js";import{I as Te,a as Oe,b as We}from"./InputsGroupFieldset-HapVOMKu.js";import{U as Be}from"./UnstyledButton-C-YKXJpa.js";import{c as Ee}from"./create-optional-context-DsJxXQb7.js";import{u as ve}from"./use-uncontrolled-B6Yp00Ct.js";import{I as ye}from"./Input-DZyKGPx9.js";import{C as ge}from"./CheckIcon-WEeZAPby.js";import{u as Ue}from"./use-id-CLb0k7dv.js";import"./preload-helper-CZ_saIiD.js";const _e=y.createContext(null),Ae=_e.Provider,Se=()=>y.useContext(_e),[De,Fe]=Ee();var je={card:"m_26775b0a"};const He={withBorder:!0},Je=D((e,{radius:o})=>({card:{"--card-radius":F(o)}})),J=B((e,o)=>{const a=E("CheckboxCard",He,e),{classNames:n,className:t,style:s,styles:r,unstyled:c,vars:u,checked:p,mod:i,withBorder:k,value:f,onClick:x,defaultChecked:C,onChange:m,attributes:g,..._}=a,S=H({name:"CheckboxCard",classes:je,props:a,className:t,style:s,classNames:n,styles:r,unstyled:c,attributes:g,vars:u,varsResolver:Je,rootSelector:"card"}),d=Se(),j=typeof p=="boolean"?p:d?d.value.includes(f||""):void 0,[b,v]=ve({value:j,defaultValue:C,finalValue:!1,onChange:m});return l.jsx(De,{value:{checked:b},children:l.jsx(Be,{ref:o,mod:[{"with-border":k,checked:b},i],...S("card"),..._,role:"checkbox","aria-checked":b,onClick:z=>{x==null||x(z),d==null||d.onChange(f||""),v(!b)}})})});J.displayName="@mantine/core/CheckboxCard";J.classes=je;const U=B((e,o)=>{const{value:a,defaultValue:n,onChange:t,size:s,wrapperProps:r,children:c,readOnly:u,...p}=E("CheckboxGroup",null,e),[i,k]=ve({value:a,defaultValue:n,finalValue:[],onChange:t}),f=x=>{const C=typeof x=="string"?x:x.currentTarget.value;!u&&k(i.includes(C)?i.filter(m=>m!==C):[...i,C])};return l.jsx(Ae,{value:{value:i,onChange:f,size:s},children:l.jsx(ye.Wrapper,{size:s,ref:o,...r,...p,labelElement:"div",__staticSelector:"CheckboxGroup",children:l.jsx(Te,{role:"group",children:c})})})});U.classes=ye.Wrapper.classes;U.displayName="@mantine/core/CheckboxGroup";var Le={indicator:"m_5e5256ee",icon:"m_1b1c543a","indicator--outline":"m_76e20374"};const Ke={icon:ge},Me=D((e,{radius:o,color:a,size:n,iconColor:t,variant:s,autoContrast:r})=>{const c=me({color:a||e.primaryColor,theme:e}),u=c.isThemeColor&&c.shade===void 0?`var(--mantine-color-${c.color}-outline)`:c.color;return{indicator:{"--checkbox-size":Ce(n,"checkbox-size"),"--checkbox-radius":o===void 0?void 0:F(o),"--checkbox-color":s==="outline"?u:O(a,e),"--checkbox-icon-color":t?O(t,e):fe(r,e)?ke({color:a,theme:e,autoContrast:r}):void 0}}}),K=B((e,o)=>{const a=E("CheckboxIndicator",Ke,e),{classNames:n,className:t,style:s,styles:r,unstyled:c,vars:u,icon:p,indeterminate:i,radius:k,color:f,iconColor:x,autoContrast:C,checked:m,mod:g,variant:_,disabled:S,attributes:d,...j}=a,b=H({name:"CheckboxIndicator",classes:Le,props:a,className:t,style:s,classNames:n,styles:r,unstyled:c,attributes:d,vars:u,varsResolver:Me,rootSelector:"indicator"}),v=Fe(),z=typeof m=="boolean"||typeof i=="boolean"?m||i:(v==null?void 0:v.checked)||!1;return l.jsx(N,{ref:o,...b("indicator",{variant:_}),variant:_,mod:[{checked:z,disabled:S},g],...j,children:l.jsx(p,{indeterminate:i,...b("icon")})})});K.displayName="@mantine/core/CheckboxIndicator";K.classes=Le;var Ie={root:"m_bf2d988c",inner:"m_26062bec",input:"m_26063560",icon:"m_bf295423","input--outline":"m_215c4542"};const Qe={labelPosition:"right",icon:ge},Xe=D((e,{radius:o,color:a,size:n,iconColor:t,variant:s,autoContrast:r})=>{const c=me({color:a||e.primaryColor,theme:e}),u=c.isThemeColor&&c.shade===void 0?`var(--mantine-color-${c.color}-outline)`:c.color;return{root:{"--checkbox-size":Ce(n,"checkbox-size"),"--checkbox-radius":o===void 0?void 0:F(o),"--checkbox-color":s==="outline"?u:O(a,e),"--checkbox-icon-color":t?O(t,e):fe(r,e)?ke({color:a,theme:e,autoContrast:r}):void 0}}}),w=B((e,o)=>{const a=E("Checkbox",Qe,e),{classNames:n,className:t,style:s,styles:r,unstyled:c,vars:u,color:p,label:i,id:k,size:f,radius:x,wrapperProps:C,checked:m,labelPosition:g,description:_,error:S,disabled:d,variant:j,indeterminate:b,icon:v,rootRef:z,iconColor:oo,onChange:P,autoContrast:ao,mod:ze,attributes:Ne,...Pe}=a,L=Se(),Ve=f||(L==null?void 0:L.size),V=H({name:"Checkbox",props:a,classes:Ie,className:t,style:s,classNames:n,styles:r,unstyled:c,attributes:Ne,vars:u,varsResolver:Xe}),{styleProps:qe,rest:M}=$e(Pe),Q=Ue(k),X=L?{checked:L.value.includes(M.value),onChange:Y=>{L.onChange(Y),P==null||P(Y)}}:{},Ge=y.useRef(null),I=o||Ge;return y.useEffect(()=>{I&&"current"in I&&I.current&&(I.current.indeterminate=b||!1)},[b,I]),l.jsx(Oe,{...V("root"),__staticSelector:"Checkbox",__stylesApiProps:a,id:Q,size:Ve,labelPosition:g,label:i,description:_,error:S,disabled:d,classNames:n,styles:r,unstyled:c,"data-checked":X.checked||m||void 0,variant:j,ref:z,mod:ze,...qe,...C,children:l.jsxs(N,{...V("inner"),mod:{"data-label-position":g},children:[l.jsx(N,{component:"input",id:Q,ref:I,checked:m,disabled:d,mod:{error:!!S,indeterminate:b},...V("input",{focusable:!0,variant:j}),onChange:P,...M,...X,type:"checkbox"}),l.jsx(v,{indeterminate:b,...V("icon")})]})})});w.classes={...Ie,...We};w.displayName="@mantine/core/Checkbox";w.Group=U;w.Indicator=K;w.Card=J;var h={group:"recursica-1uqzeep7",groupLabel:"recursica-1uqzeep8",label:"recursica-1uqzeep2",root:"recursica-1uqzeep0",labelWrapper:"recursica-1uqzeep3",body:"recursica-1uqzeep1",hideLabel:"recursica-1uqzeep9",input:"recursica-1uqzeep4",inner:"recursica-1uqzeep6",icon:"recursica-1uqzeep5"};const Ye=({indeterminate:e,...o})=>e?l.jsx(N,{...o,w:16,children:l.jsx(ee,{name:"minus_outline",size:16})}):l.jsx(N,{...o,w:16,children:l.jsx(ee,{name:"check_outline",size:16})}),Ze=y.forwardRef(({labelPlacement:e="top",...o},a)=>l.jsx(U,{...o,ref:a,"data-label-placement":e,label:l.jsx(eo,{label:o.label,optional:o.optional}),classNames:{root:h.group}})),eo=y.forwardRef((e,o)=>l.jsxs(Re,{ref:o,...e,className:h.groupLabel,children:[l.jsx(Z,{variant:"body-2/normal",color:"form/label/color/default-color",children:e.label}),e.optional&&l.jsx(Z,{variant:"caption",color:"form/label/color/default-color",as:"span",opacity:.84,children:"(optional)"})]})),we=y.forwardRef(({showLabel:e=!0,...o},a)=>l.jsx(w,{...o,ref:a,label:e?o.label:void 0,"aria-label":e?void 0:o.label,icon:Ye,classNames:{root:h.root,label:h.label,labelWrapper:`${h.labelWrapper} ${e?"":h.hideLabel}`,body:h.body,input:h.input,inner:h.inner,icon:h.icon}}));we.Group=Ze;const W=we;try{W.displayName="Checkbox",W.__docgenInfo={description:"",displayName:"Checkbox",props:{label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},showLabel:{defaultValue:{value:"true"},description:`Whether to show the label text next to the checkbox.
If false, the label will be hidden and only the checkbox will be visible.
This is useful for cases where the checkbox is used as a toggle without a label.`,name:"showLabel",required:!1,type:{name:"boolean | undefined"}}}}}catch{}function A({checkboxes:e,label:o,optional:a,defaultValue:n,value:t,labelPlacement:s}){return l.jsx(W.Group,{label:o,optional:a,defaultValue:n,value:t,labelPlacement:s,children:e.map(({value:r,label:c,disabled:u,indeterminate:p,checked:i,showLabel:k})=>l.jsx(W,{value:r,label:c,disabled:u,showLabel:k,indeterminate:p,checked:i},r))})}try{A.displayName="CheckboxStoryComponent",A.__docgenInfo={description:"",displayName:"CheckboxStoryComponent",props:{checkboxes:{defaultValue:null,description:"",name:"checkboxes",required:!0,type:{name:"CheckboxStory[]"}},label:{defaultValue:null,description:"",name:"label",required:!0,type:{name:"string"}},optional:{defaultValue:null,description:"",name:"optional",required:!1,type:{name:"boolean | undefined"}},defaultValue:{defaultValue:null,description:"",name:"defaultValue",required:!1,type:{name:"string[] | undefined"}},value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"string[] | undefined"}},labelPlacement:{defaultValue:null,description:"",name:"labelPlacement",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"left"'},{value:'"top"'}]}}}}}catch{}const fo={title:"Checkbox",component:A,decorators:[],parameters:{layout:"centered"},tags:["autodocs"],args:{}},q={args:{label:"Select your option",checkboxes:[{value:"checkbox1",label:"Checkbox 1"},{value:"checkbox2",label:"Checkbox 2 Lorem ipsum dolor sit amet"},{value:"checkbox3",label:"Checkbox 3",disabled:!0}]}},G={args:{label:"Select your option",optional:!0,checkboxes:[{value:"checkbox1",label:"Checkbox 1"},{value:"checkbox2",label:"Checkbox 2 Lorem ipsum dolor sit amet"},{value:"checkbox3",label:"Checkbox 3",disabled:!0}]}},R={args:{label:"Select your option",value:["checkbox1","checkbox2","checkbox4","checkbox5"],checkboxes:[{value:"checkbox1",label:"Checkbox 1"},{value:"checkbox2",label:"Checkbox 2 Lorem ipsum dolor sit amet",indeterminate:!0},{value:"checkbox3",label:"Checkbox 3"},{value:"checkbox4",label:"Checkbox 4",disabled:!0},{value:"checkbox5",label:"Checkbox 5",indeterminate:!0,disabled:!0},{value:"checkbox6",label:"Checkbox 6",disabled:!0}]}},$={args:{label:"Select your option",optional:!0,checkboxes:[{value:"checkbox1",label:"Checkbox 1",showLabel:!1},{value:"checkbox2",label:"Checkbox 2 Lorem ipsum dolor sit amet",showLabel:!1},{value:"checkbox3",label:"Checkbox 3",disabled:!0,showLabel:!1}]}},T={args:{label:"Select your option",optional:!0,labelPlacement:"top",checkboxes:[{value:"checkbox1",label:"Checkbox 1"},{value:"checkbox2",label:"Checkbox 2 with longer text"},{value:"checkbox3",label:"Checkbox 3",disabled:!0}]}};var oe,ae,le;q.parameters={...q.parameters,docs:{...(oe=q.parameters)==null?void 0:oe.docs,source:{originalSource:`{
  args: {
    label: "Select your option",
    checkboxes: [{
      value: "checkbox1",
      label: "Checkbox 1"
    }, {
      value: "checkbox2",
      label: "Checkbox 2 Lorem ipsum dolor sit amet"
    }, {
      value: "checkbox3",
      label: "Checkbox 3",
      disabled: true
    }]
  }
}`,...(le=(ae=q.parameters)==null?void 0:ae.docs)==null?void 0:le.source}}};var ce,re,te;G.parameters={...G.parameters,docs:{...(ce=G.parameters)==null?void 0:ce.docs,source:{originalSource:`{
  args: {
    label: "Select your option",
    optional: true,
    checkboxes: [{
      value: "checkbox1",
      label: "Checkbox 1"
    }, {
      value: "checkbox2",
      label: "Checkbox 2 Lorem ipsum dolor sit amet"
    }, {
      value: "checkbox3",
      label: "Checkbox 3",
      disabled: true
    }]
  }
}`,...(te=(re=G.parameters)==null?void 0:re.docs)==null?void 0:te.source}}};var ne,se,ie;R.parameters={...R.parameters,docs:{...(ne=R.parameters)==null?void 0:ne.docs,source:{originalSource:`{
  args: {
    label: "Select your option",
    value: ["checkbox1", "checkbox2", "checkbox4", "checkbox5"],
    checkboxes: [{
      value: "checkbox1",
      label: "Checkbox 1"
    }, {
      value: "checkbox2",
      label: "Checkbox 2 Lorem ipsum dolor sit amet",
      indeterminate: true
    }, {
      value: "checkbox3",
      label: "Checkbox 3"
    }, {
      value: "checkbox4",
      label: "Checkbox 4",
      disabled: true
    }, {
      value: "checkbox5",
      label: "Checkbox 5",
      indeterminate: true,
      disabled: true
    }, {
      value: "checkbox6",
      label: "Checkbox 6",
      disabled: true
    }]
  }
}`,...(ie=(se=R.parameters)==null?void 0:se.docs)==null?void 0:ie.source}}};var ue,be,de;$.parameters={...$.parameters,docs:{...(ue=$.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    label: "Select your option",
    optional: true,
    checkboxes: [{
      value: "checkbox1",
      label: "Checkbox 1",
      showLabel: false
    }, {
      value: "checkbox2",
      label: "Checkbox 2 Lorem ipsum dolor sit amet",
      showLabel: false
    }, {
      value: "checkbox3",
      label: "Checkbox 3",
      disabled: true,
      showLabel: false
    }]
  }
}`,...(de=(be=$.parameters)==null?void 0:be.docs)==null?void 0:de.source}}};var he,pe,xe;T.parameters={...T.parameters,docs:{...(he=T.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    label: "Select your option",
    optional: true,
    labelPlacement: "top",
    checkboxes: [{
      value: "checkbox1",
      label: "Checkbox 1"
    }, {
      value: "checkbox2",
      label: "Checkbox 2 with longer text"
    }, {
      value: "checkbox3",
      label: "Checkbox 3",
      disabled: true
    }]
  }
}`,...(xe=(pe=T.parameters)==null?void 0:pe.docs)==null?void 0:xe.source}}};const vo=["Default","Optional","Controlled","NoLabel","LabelOnLeft"];export{R as Controlled,q as Default,T as LabelOnLeft,$ as NoLabel,G as Optional,vo as __namedExportsOrder,fo as default};
