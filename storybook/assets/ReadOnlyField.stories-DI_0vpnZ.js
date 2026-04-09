import{j as l}from"./iframe-uF_HBlgp.js";import{R as J}from"./ReadOnlyField-6uBtiOnM.js";import{T as Q,y as z}from"./adapter-common-DIDtRk04.js";import"./preload-helper-Dp1pzeXC.js";import"./filterStylingProps-Cd5Jg4Cp.js";import"./FormControlWrapper-BseOleO6.js";import"./get-size-CyTqK_sX.js";import"./factory-DPW3mWUw.js";import"./polymorphic-factory-CALd9GjX.js";import"./UnstyledButton-BeKfx2Cj.js";import"./use-id-BrQ4L0u5.js";import"./AssistiveElement-D6QK6qk4.js";const de={title:"UI Kit/ReadOnlyField",component:J,tags:["autodocs"],parameters:{docs:{description:{component:"The ReadOnlyField safely natively wraps data sets bypassing active HTML interaction hooks while natively retaining exact bounding visual layouts defined by internal Design System Tokens. Useful for creating strict data-review profiles or conditional form read-overs."}}},args:{label:"Read Only Label",value:"Fixed Data Set Value",assistiveText:"Helper description text beneath the node.",type:"text"},argTypes:{type:{control:"select",options:["text","number"]},labelWithEditIcon:{control:"boolean"}},decorators:[(e,U)=>{const{layer:G=0}=U.args;return l.jsx(Q,{layer:G,children:l.jsx(e,{})})}]},t={args:{},argTypes:{layer:{control:{type:"number",min:0,max:3},table:{category:"Storybook Wrappers"}}}},r={args:{value:"",label:"Empty String Evaluated Automatically (Default 'N/A')"}},H=e=>l.jsx(z,{...e,emptyText:"No Data Found"});H.check=z.check;const a={args:{value:null,label:"Custom Empty Text Default",emptyValueComponent:H}},Y=()=>l.jsx("i",{children:"Custom HTML Markup Provided"});Y.check=e=>e==="EMPTY_MOCK";const o={args:{value:"EMPTY_MOCK",label:"Custom Logic Evaluation Binding",emptyValueComponent:Y}},s={args:{formLayout:"stacked",value:"Some fixed readable text"}},n={args:{formLayout:"side-by-side",value:"Some fixed readable text mapping horizontally"}},i={args:{labelWithEditIcon:!0,required:!0,value:"Editable fixed structure"}};var d,c,m,p,u;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    // layer defined temporarily inline above via mock decorator if proper \`<Layer>\` wrapper isn't natively bound here
  },
  argTypes: {
    layer: {
      control: {
        type: "number",
        min: 0,
        max: 3
      },
      table: {
        category: "Storybook Wrappers"
      }
    } as any
  }
}`,...(m=(c=t.parameters)==null?void 0:c.docs)==null?void 0:m.source},description:{story:"Playground story demonstrating standard structural blocks of the ReadOnlyField module dynamically.",...(u=(p=t.parameters)==null?void 0:p.docs)==null?void 0:u.description}}};var y,g,b,f,v;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    value: "",
    label: "Empty String Evaluated Automatically (Default 'N/A')"
  }
}`,...(b=(g=r.parameters)==null?void 0:g.docs)==null?void 0:b.source},description:{story:"Shows the default handler replacing missing mapping data directly with 'N/A'.",...(v=(f=r.parameters)==null?void 0:f.docs)==null?void 0:v.description}}};var x,h,E,S,C;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    value: null,
    label: "Custom Empty Text Default",
    emptyValueComponent: CustomEmptyTextRenderer
  }
}`,...(E=(h=a.parameters)==null?void 0:h.docs)==null?void 0:E.source},description:{story:"Demonstrates overriding the baseline verbiage internally utilizing the exported `EmptyValueRenderer` while inheriting default evaluation checks.",...(C=(S=a.parameters)==null?void 0:S.docs)==null?void 0:C.description}}};var T,k,R,D,V;o.parameters={...o.parameters,docs:{...(T=o.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    value: "EMPTY_MOCK",
    label: "Custom Logic Evaluation Binding",
    emptyValueComponent: CustomEmptyCheckRenderer
  }
}`,...(R=(k=o.parameters)==null?void 0:k.docs)==null?void 0:R.source},description:{story:"Validates a fully overridden emptyValueComponent injecting custom rendering boundaries alongside explicitly tailored validation rules evaluating datasets dynamically.",...(V=(D=o.parameters)==null?void 0:D.docs)==null?void 0:V.description}}};var L,M,O,w,j;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    value: "Some fixed readable text"
  }
}`,...(O=(M=s.parameters)==null?void 0:M.docs)==null?void 0:O.source},description:{story:"Validates the core read-only label execution and base default spacing bindings globally.",...(j=(w=s.parameters)==null?void 0:w.docs)==null?void 0:j.description}}};var W,F,I,A,B;n.parameters={...n.parameters,docs:{...(W=n.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    value: "Some fixed readable text mapping horizontally"
  }
}`,...(I=(F=n.parameters)==null?void 0:F.docs)==null?void 0:I.source},description:{story:"Binds side-by-side structures globally maintaining correct inline gutter layouts.",...(B=(A=n.parameters)==null?void 0:A.docs)==null?void 0:B.description}}};var P,_,K,N,q;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    labelWithEditIcon: true,
    required: true,
    value: "Editable fixed structure"
  }
}`,...(K=(_=i.parameters)==null?void 0:_.docs)==null?void 0:K.source},description:{story:"Tests the fallback structural logic when Edit icon natively overrides required bindings.",...(q=(N=i.parameters)==null?void 0:N.docs)==null?void 0:q.description}}};const ce=["Default","EmptyValue","CustomEmptyText","CustomEmptyRenderer","StackedDefault","SideBySide","WithEditIcon"];export{o as CustomEmptyRenderer,a as CustomEmptyText,t as Default,r as EmptyValue,n as SideBySide,s as StackedDefault,i as WithEditIcon,ce as __namedExportsOrder,de as default};
