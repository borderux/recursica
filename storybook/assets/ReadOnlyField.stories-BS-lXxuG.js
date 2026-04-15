import{j as q,b as z}from"./iframe-d8_mgu_F.js";import{R as U}from"./ReadOnlyField-q6SmYV1m.js";import"./preload-helper-Dp1pzeXC.js";import"./FormControlWrapper-CXOqPfDC.js";import"./get-size-J7CBMG80.js";import"./factory-BnxMGGpV.js";import"./polymorphic-factory-D_h49hYh.js";import"./create-optional-context-CksL04J4.js";import"./UnstyledButton-BAqRjZ2G.js";import"./use-id-D4iUNtas.js";import"./AssistiveElement-Cio2Zk0-.js";const oe={title:"UI Kit/ReadOnlyField",component:U,tags:["autodocs"],parameters:{docs:{description:{component:"The ReadOnlyField safely natively wraps data sets bypassing active HTML interaction hooks while natively retaining exact bounding visual layouts defined by internal Design System Tokens. Useful for creating strict data-review profiles or conditional form read-overs."}}},args:{label:"Read Only Label",value:"Fixed Data Set Value",assistiveText:"Helper description text beneath the node.",type:"text"},argTypes:{type:{control:"select",options:["text","number"]},labelWithEditIcon:{control:"boolean"}}},e={args:{}},t={args:{value:"",label:"Empty String Evaluated Automatically (Default 'N/A')"}},H=n=>q.jsx(z,{...n,emptyText:"No Data Found"});H.check=z.check;const a={args:{value:null,label:"Custom Empty Text Default",emptyValueComponent:H}},Y=()=>q.jsx("i",{children:"Custom HTML Markup Provided"});Y.check=n=>n==="EMPTY_MOCK";const r={args:{value:"EMPTY_MOCK",label:"Custom Logic Evaluation Binding",emptyValueComponent:Y}},s={args:{formLayout:"stacked",value:"Some fixed readable text"}},o={args:{formLayout:"side-by-side",value:"Some fixed readable text mapping horizontally"}},i={args:{labelWithEditIcon:!0,required:!0,value:"Editable fixed structure"}};var l,d,c,u,m;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {}
}`,...(c=(d=e.parameters)==null?void 0:d.docs)==null?void 0:c.source},description:{story:"Playground story demonstrating standard structural blocks of the ReadOnlyField module dynamically.",...(m=(u=e.parameters)==null?void 0:u.docs)==null?void 0:m.description}}};var p,y,g,b,f;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    value: "",
    label: "Empty String Evaluated Automatically (Default 'N/A')"
  }
}`,...(g=(y=t.parameters)==null?void 0:y.docs)==null?void 0:g.source},description:{story:"Shows the default handler replacing missing mapping data directly with 'N/A'.",...(f=(b=t.parameters)==null?void 0:b.docs)==null?void 0:f.description}}};var v,x,E,h,C;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    value: null,
    label: "Custom Empty Text Default",
    emptyValueComponent: CustomEmptyTextRenderer
  }
}`,...(E=(x=a.parameters)==null?void 0:x.docs)==null?void 0:E.source},description:{story:"Demonstrates overriding the baseline verbiage internally utilizing the exported `EmptyValueRenderer` while inheriting default evaluation checks.",...(C=(h=a.parameters)==null?void 0:h.docs)==null?void 0:C.description}}};var S,T,k,R,D;r.parameters={...r.parameters,docs:{...(S=r.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    value: "EMPTY_MOCK",
    label: "Custom Logic Evaluation Binding",
    emptyValueComponent: CustomEmptyCheckRenderer
  }
}`,...(k=(T=r.parameters)==null?void 0:T.docs)==null?void 0:k.source},description:{story:"Validates a fully overridden emptyValueComponent injecting custom rendering boundaries alongside explicitly tailored validation rules evaluating datasets dynamically.",...(D=(R=r.parameters)==null?void 0:R.docs)==null?void 0:D.description}}};var V,L,M,O,w;s.parameters={...s.parameters,docs:{...(V=s.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    value: "Some fixed readable text"
  }
}`,...(M=(L=s.parameters)==null?void 0:L.docs)==null?void 0:M.source},description:{story:"Validates the core read-only label execution and base default spacing bindings globally.",...(w=(O=s.parameters)==null?void 0:O.docs)==null?void 0:w.description}}};var F,I,j,A,B;o.parameters={...o.parameters,docs:{...(F=o.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    value: "Some fixed readable text mapping horizontally"
  }
}`,...(j=(I=o.parameters)==null?void 0:I.docs)==null?void 0:j.source},description:{story:"Binds side-by-side structures globally maintaining correct inline gutter layouts.",...(B=(A=o.parameters)==null?void 0:A.docs)==null?void 0:B.description}}};var P,W,_,K,N;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    labelWithEditIcon: true,
    required: true,
    value: "Editable fixed structure"
  }
}`,...(_=(W=i.parameters)==null?void 0:W.docs)==null?void 0:_.source},description:{story:"Tests the fallback structural logic when Edit icon natively overrides required bindings.",...(N=(K=i.parameters)==null?void 0:K.docs)==null?void 0:N.description}}};const ie=["Default","EmptyValue","CustomEmptyText","CustomEmptyRenderer","StackedDefault","SideBySide","WithEditIcon"];export{r as CustomEmptyRenderer,a as CustomEmptyText,e as Default,t as EmptyValue,o as SideBySide,s as StackedDefault,i as WithEditIcon,ie as __namedExportsOrder,oe as default};
