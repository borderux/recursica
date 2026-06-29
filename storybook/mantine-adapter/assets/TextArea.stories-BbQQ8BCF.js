import{T as x}from"./TextArea-CaAAhAGt.js";import{f as S}from"./commonArgTypes-DcjzA9l3.js";import"./iframe-DyBNPiC1.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-BEFaaN92.js";import"./ReadOnlyField-Ce_Eike0.js";import"./get-size-D2StqF49.js";import"./factory-BCJdCO96.js";import"./polymorphic-factory-CUMspToA.js";import"./create-optional-context-4aTJBr7t.js";import"./use-resolved-styles-api-D-Jb7eJi.js";import"./CloseButton-CuQ2F95T.js";import"./UnstyledButton-pll0nim4.js";import"./use-id-Dew4zDnN.js";import"./AssistiveElement-D58-8os0.js";import"./get-env-uyVen0u2.js";import"./InputBase-DSi8urel.js";import"./use-input-props-Dhy0gN2Z.js";const j={title:"UI-Kit/TextArea",component:x,tags:["autodocs"],parameters:{docs:{description:{component:"TextArea provides a multi-line input field, mapping layout explicitly over the standardized FormControlWrapper."}}},args:{label:"Description",assistiveText:"Enter your full description here.",disabled:!1,required:!1,readOnly:!1,autosize:!1},argTypes:{disabled:{control:"boolean"},...S,readOnly:{control:"boolean"},autosize:{control:"boolean"},minRows:{control:"number"},maxRows:{control:"number"},value:{control:"text"},placeholder:{control:"text"}}},e={args:{placeholder:"Type something long..."}},r={args:{label:"Auto-sizing TextArea",autosize:!0,minRows:2,maxRows:6,placeholder:"Type multiple lines here. Watch it grow!"}},a={args:{error:"This field requires a detailed explanation.",value:"Some bad input."}},o={args:{disabled:!0,value:"This content is locked."}},t={args:{label:"Read Only View",readOnly:!0,value:"This text is safely frozen in read-only form."}};var s,i,n;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    placeholder: "Type something long..."
  }
}`,...(n=(i=e.parameters)==null?void 0:i.docs)==null?void 0:n.source}}};var l,p,c;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    label: "Auto-sizing TextArea",
    autosize: true,
    minRows: 2,
    maxRows: 6,
    placeholder: "Type multiple lines here. Watch it grow!"
  }
}`,...(c=(p=r.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var m,d,u;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    error: "This field requires a detailed explanation.",
    value: "Some bad input."
  }
}`,...(u=(d=a.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var g,f,y;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    disabled: true,
    value: "This content is locked."
  }
}`,...(y=(f=o.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var h,T,b;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "Read Only View",
    readOnly: true,
    value: "This text is safely frozen in read-only form."
  }
}`,...(b=(T=t.parameters)==null?void 0:T.docs)==null?void 0:b.source}}};const B=["Default","Autosize","StaticError","StaticDisabled","StaticReadOnly"];export{r as Autosize,e as Default,o as StaticDisabled,a as StaticError,t as StaticReadOnly,B as __namedExportsOrder,j as default};
