import{j as a,e as Q}from"./iframe-C_ymJL69.js";import{R as t}from"./ReadOnlyField-CmK4Xprm.js";import{f as ee}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./AssistiveElement-BX1CLCG3.js";import"./useFormControl-CCBjUjcD.js";import"./memoTheme-DuK-uO2q.js";import"./styled-CVDphjR5.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./FormControlLayout-CxLXgHi1.js";import"./isMuiElement-DGxPhrgs.js";const ye={title:"UI-Kit/ReadOnlyField",component:t,tags:["autodocs"],parameters:{docs:{description:{component:"The ReadOnlyField safely natively wraps data sets bypassing active HTML interaction hooks while natively retaining exact bounding visual layouts defined by internal Design System Tokens. Useful for creating strict data-review profiles or conditional form read-overs."}},controls:{include:["type","labelWithEditIcon","formLayout","labelSize","labelAlignment","labelOptionalText","required"]}},args:{label:"Read Only Label",value:"Fixed Data Set Value",assistiveText:"Helper description text beneath the node.",type:"text"},argTypes:{...ee,type:{control:"select",options:["text","number","boolean","switch","date"]},labelWithEditIcon:{control:"boolean"}}},r={args:{},render:({...e})=>a.jsx(t,{...e})},n={args:{value:"",label:"Empty String Evaluated Automatically (Default 'N/A')"},render:({...e})=>a.jsx(t,{...e})},X=e=>a.jsx(Q,{...e,emptyText:"No Data Found"});X.check=Q.check;const s={args:{value:null,label:"Custom Empty Text Default",emptyValueComponent:X},render:({...e})=>a.jsx(t,{...e})},$=()=>a.jsx("i",{children:"Custom HTML Markup Provided"});$.check=e=>e==="EMPTY_MOCK";const l={args:{value:"EMPTY_MOCK",label:"Custom Logic Evaluation Binding",emptyValueComponent:$},render:({...e})=>a.jsx(t,{...e})},o={args:{formLayout:"stacked",value:"Some fixed readable text"},render:({...e})=>a.jsx(t,{...e})},i={args:{formLayout:"side-by-side",value:"Some fixed readable text mapping horizontally"},render:({...e})=>a.jsx(t,{...e})},d={args:{labelWithEditIcon:!0,required:!0,value:"Editable fixed structure"},render:({...e})=>a.jsx(t,{...e})},p={args:{},render:({...e})=>a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[a.jsx(t,{...e,label:"Text Mapping",type:"text",value:"Standard string output"}),a.jsx(t,{...e,label:"Number Mapping",type:"number",value:123456789e-2}),a.jsx(t,{...e,label:"Date Mapping",type:"date",value:new Date("2026-04-28T12:00:00Z").toLocaleDateString()}),a.jsx(t,{...e,label:"Boolean Mapping (True)",type:"boolean",value:!0}),a.jsx(t,{...e,label:"Boolean Mapping (False)",type:"boolean",value:!1}),a.jsx(t,{...e,label:"Switch Mapping (True -> On)",type:"switch",value:!0}),a.jsx(t,{...e,label:"Switch Mapping (False -> Off)",type:"switch",value:!1})]})};var c,u,m,y,g;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }: any) => <ReadOnlyField {...args} />
}`,...(m=(u=r.parameters)==null?void 0:u.docs)==null?void 0:m.source},description:{story:"Playground story demonstrating standard structural blocks of the ReadOnlyField module dynamically.",...(g=(y=r.parameters)==null?void 0:y.docs)==null?void 0:g.description}}};var b,x,f,v,h;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    value: "",
    label: "Empty String Evaluated Automatically (Default 'N/A')"
  },
  render: ({
    ...args
  }: any) => <ReadOnlyField {...args} />
}`,...(f=(x=n.parameters)==null?void 0:x.docs)==null?void 0:f.source},description:{story:"Shows the default handler replacing missing mapping data directly with 'N/A'.",...(h=(v=n.parameters)==null?void 0:v.docs)==null?void 0:h.description}}};var E,S,O,R,T;s.parameters={...s.parameters,docs:{...(E=s.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    value: null,
    label: "Custom Empty Text Default",
    emptyValueComponent: CustomEmptyTextRenderer
  },
  render: ({
    ...args
  }: any) => <ReadOnlyField {...args} />
}`,...(O=(S=s.parameters)==null?void 0:S.docs)==null?void 0:O.source},description:{story:"Demonstrates overriding the baseline verbiage internally utilizing the exported `EmptyValueRenderer` while inheriting default evaluation checks.",...(T=(R=s.parameters)==null?void 0:R.docs)==null?void 0:T.description}}};var C,F,D,M,j;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    value: "EMPTY_MOCK",
    label: "Custom Logic Evaluation Binding",
    emptyValueComponent: CustomEmptyCheckRenderer
  },
  render: ({
    ...args
  }: any) => <ReadOnlyField {...args} />
}`,...(D=(F=l.parameters)==null?void 0:F.docs)==null?void 0:D.source},description:{story:"Validates a fully overridden emptyValueComponent injecting custom rendering boundaries alongside explicitly tailored validation rules evaluating datasets dynamically.",...(j=(M=l.parameters)==null?void 0:M.docs)==null?void 0:j.description}}};var w,k,L,V,B;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    value: "Some fixed readable text"
  },
  render: ({
    ...args
  }: any) => <ReadOnlyField {...args} />
}`,...(L=(k=o.parameters)==null?void 0:k.docs)==null?void 0:L.source},description:{story:"Validates the core read-only label execution and base default spacing bindings globally.",...(B=(V=o.parameters)==null?void 0:V.docs)==null?void 0:B.description}}};var A,I,N,W,P;i.parameters={...i.parameters,docs:{...(A=i.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    value: "Some fixed readable text mapping horizontally"
  },
  render: ({
    ...args
  }: any) => <ReadOnlyField {...args} />
}`,...(N=(I=i.parameters)==null?void 0:I.docs)==null?void 0:N.source},description:{story:"Binds side-by-side structures globally maintaining correct inline gutter layouts.",...(P=(W=i.parameters)==null?void 0:W.docs)==null?void 0:P.description}}};var _,q,z,K,H;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    labelWithEditIcon: true,
    required: true,
    value: "Editable fixed structure"
  },
  render: ({
    ...args
  }: any) => <ReadOnlyField {...args} />
}`,...(z=(q=d.parameters)==null?void 0:q.docs)==null?void 0:z.source},description:{story:"Tests the fallback structural logic when Edit icon natively overrides required bindings.",...(H=(K=d.parameters)==null?void 0:K.docs)==null?void 0:H.description}}};var Y,U,Z,G,J;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }: any) => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}>
      <ReadOnlyField {...args} label="Text Mapping" type="text" value="Standard string output" />
      <ReadOnlyField {...args} label="Number Mapping" type="number" value={1234567.89} />
      <ReadOnlyField {...args} label="Date Mapping" type="date" value={new Date("2026-04-28T12:00:00Z").toLocaleDateString()} />
      <ReadOnlyField {...args} label="Boolean Mapping (True)" type="boolean" value={true} />
      <ReadOnlyField {...args} label="Boolean Mapping (False)" type="boolean" value={false} />
      <ReadOnlyField {...args} label="Switch Mapping (True -> On)" type="switch" value={true} />
      <ReadOnlyField {...args} label="Switch Mapping (False -> Off)" type="switch" value={false} />
    </div>
}`,...(Z=(U=p.parameters)==null?void 0:U.docs)==null?void 0:Z.source},description:{story:`Demonstrates how the generic ReadOnlyField handles mapping different internal data types.
Currently, all types safely default to string extraction mapping into the text renderer natively.`,...(J=(G=p.parameters)==null?void 0:G.docs)==null?void 0:J.description}}};const ge=["Default","EmptyValue","CustomEmptyText","CustomEmptyRenderer","StackedDefault","SideBySide","WithEditIcon","DataTypes"];export{l as CustomEmptyRenderer,s as CustomEmptyText,p as DataTypes,r as Default,n as EmptyValue,i as SideBySide,o as StackedDefault,d as WithEditIcon,ge as __namedExportsOrder,ye as default};
