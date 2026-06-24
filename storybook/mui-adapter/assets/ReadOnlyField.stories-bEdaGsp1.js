import{j as e,e as Q}from"./iframe-ET1O9uy4.js";import{R as a}from"./ReadOnlyField-pnlGCQ3v.js";import"./preload-helper-Dp1pzeXC.js";import"./AssistiveElement-CLd-wGbf.js";import"./useFormControl-D0Dq9yyH.js";import"./memoTheme-DivAIOBF.js";import"./styled-NHfFC7RQ.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./FormControlLayout-GJMygHKi.js";import"./isMuiElement-CYpP1DvT.js";const ce={title:"UI Kit/ReadOnlyField",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"The ReadOnlyField safely natively wraps data sets bypassing active HTML interaction hooks while natively retaining exact bounding visual layouts defined by internal Design System Tokens. Useful for creating strict data-review profiles or conditional form read-overs."}}},args:{label:"Read Only Label",value:"Fixed Data Set Value",assistiveText:"Helper description text beneath the node.",type:"text"},argTypes:{type:{control:"select",options:["text","number"]},labelWithEditIcon:{control:"boolean"}}},t={args:{}},r={args:{value:"",label:"Empty String Evaluated Automatically (Default 'N/A')"}},X=p=>e.jsx(Q,{...p,emptyText:"No Data Found"});X.check=Q.check;const s={args:{value:null,label:"Custom Empty Text Default",emptyValueComponent:X}},$=()=>e.jsx("i",{children:"Custom HTML Markup Provided"});$.check=p=>p==="EMPTY_MOCK";const n={args:{value:"EMPTY_MOCK",label:"Custom Logic Evaluation Binding",emptyValueComponent:$}},o={args:{formLayout:"stacked",value:"Some fixed readable text"}},i={args:{formLayout:"side-by-side",value:"Some fixed readable text mapping horizontally"}},l={args:{labelWithEditIcon:!0,required:!0,value:"Editable fixed structure"}},d={args:{},render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:[e.jsx(a,{label:"Text Mapping",type:"text",value:"Standard string output"}),e.jsx(a,{label:"Number Mapping",type:"number",value:123456789e-2}),e.jsx(a,{label:"Date Mapping",type:"date",value:new Date("2026-04-28T12:00:00Z").toLocaleDateString()}),e.jsx(a,{label:"Boolean Mapping (True)",type:"boolean",value:!0}),e.jsx(a,{label:"Boolean Mapping (False)",type:"boolean",value:!1}),e.jsx(a,{label:"Switch Mapping (True -> On)",type:"switch",value:!0}),e.jsx(a,{label:"Switch Mapping (False -> Off)",type:"switch",value:!1})]})};var c,u,m,y,g;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {}
}`,...(m=(u=t.parameters)==null?void 0:u.docs)==null?void 0:m.source},description:{story:"Playground story demonstrating standard structural blocks of the ReadOnlyField module dynamically.",...(g=(y=t.parameters)==null?void 0:y.docs)==null?void 0:g.description}}};var b,x,v,f,h;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    value: "",
    label: "Empty String Evaluated Automatically (Default 'N/A')"
  }
}`,...(v=(x=r.parameters)==null?void 0:x.docs)==null?void 0:v.source},description:{story:"Shows the default handler replacing missing mapping data directly with 'N/A'.",...(h=(f=r.parameters)==null?void 0:f.docs)==null?void 0:h.description}}};var E,S,T,C,D;s.parameters={...s.parameters,docs:{...(E=s.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    value: null,
    label: "Custom Empty Text Default",
    emptyValueComponent: CustomEmptyTextRenderer
  }
}`,...(T=(S=s.parameters)==null?void 0:S.docs)==null?void 0:T.source},description:{story:"Demonstrates overriding the baseline verbiage internally utilizing the exported `EmptyValueRenderer` while inheriting default evaluation checks.",...(D=(C=s.parameters)==null?void 0:C.docs)==null?void 0:D.description}}};var M,R,O,w,F;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    value: "EMPTY_MOCK",
    label: "Custom Logic Evaluation Binding",
    emptyValueComponent: CustomEmptyCheckRenderer
  }
}`,...(O=(R=n.parameters)==null?void 0:R.docs)==null?void 0:O.source},description:{story:"Validates a fully overridden emptyValueComponent injecting custom rendering boundaries alongside explicitly tailored validation rules evaluating datasets dynamically.",...(F=(w=n.parameters)==null?void 0:w.docs)==null?void 0:F.description}}};var k,j,L,V,B;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    formLayout: "stacked",
    value: "Some fixed readable text"
  }
}`,...(L=(j=o.parameters)==null?void 0:j.docs)==null?void 0:L.source},description:{story:"Validates the core read-only label execution and base default spacing bindings globally.",...(B=(V=o.parameters)==null?void 0:V.docs)==null?void 0:B.description}}};var I,N,A,P,W;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side",
    value: "Some fixed readable text mapping horizontally"
  }
}`,...(A=(N=i.parameters)==null?void 0:N.docs)==null?void 0:A.source},description:{story:"Binds side-by-side structures globally maintaining correct inline gutter layouts.",...(W=(P=i.parameters)==null?void 0:P.docs)==null?void 0:W.description}}};var _,K,q,z,H;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    labelWithEditIcon: true,
    required: true,
    value: "Editable fixed structure"
  }
}`,...(q=(K=l.parameters)==null?void 0:K.docs)==null?void 0:q.source},description:{story:"Tests the fallback structural logic when Edit icon natively overrides required bindings.",...(H=(z=l.parameters)==null?void 0:z.docs)==null?void 0:H.description}}};var Y,U,Z,G,J;d.parameters={...d.parameters,docs:{...(Y=d.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {},
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}>
      <ReadOnlyField label="Text Mapping" type="text" value="Standard string output" />
      <ReadOnlyField label="Number Mapping" type="number" value={1234567.89} />
      <ReadOnlyField label="Date Mapping" type="date" value={new Date("2026-04-28T12:00:00Z").toLocaleDateString()} />
      <ReadOnlyField label="Boolean Mapping (True)" type="boolean" value={true} />
      <ReadOnlyField label="Boolean Mapping (False)" type="boolean" value={false} />
      <ReadOnlyField label="Switch Mapping (True -> On)" type="switch" value={true} />
      <ReadOnlyField label="Switch Mapping (False -> Off)" type="switch" value={false} />
    </div>
}`,...(Z=(U=d.parameters)==null?void 0:U.docs)==null?void 0:Z.source},description:{story:`Demonstrates how the generic ReadOnlyField handles mapping different internal data types.
Currently, all types safely default to string extraction mapping into the text renderer natively.`,...(J=(G=d.parameters)==null?void 0:G.docs)==null?void 0:J.description}}};const ue=["Default","EmptyValue","CustomEmptyText","CustomEmptyRenderer","StackedDefault","SideBySide","WithEditIcon","DataTypes"];export{n as CustomEmptyRenderer,s as CustomEmptyText,d as DataTypes,t as Default,r as EmptyValue,i as SideBySide,o as StackedDefault,l as WithEditIcon,ue as __namedExportsOrder,ce as default};
