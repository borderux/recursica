import{j as o}from"./iframe-BTksmf0I.js";import{B as a}from"./Box-DegdBJ9C.js";import"./preload-helper-Dp1pzeXC.js";import"./Box-6ZysN7PH.js";import"./generateUtilityClasses-DGi4yQgU.js";const B={title:"UI-Kit/Box",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"The `Box` component is the foundational layout primitive. It accepts all standard MUI layout properties (like `m`, `mt`, `p`, `px`, etc.), but natively intercepts **Recursica Spacing Tokens** (e.g., `rec-none`, `rec-sm`, `rec-default`, `rec-md`, `rec-lg`, `rec-xl`, `rec-2xl`). This allows developers to use Recursica's strict design tokens seamlessly alongside standard MUI spacing."}},controls:{include:["layer","withLayer","children","component","variant","size","icon","disabled","href","onClick","onChange","value","checked"]}}},e={args:{children:"This is a standard Box",m:"20px"},render:n=>o.jsx(a,{...n,style:{border:"1px solid gray",padding:"10px"}})},r={args:{children:"This Box uses Recursica layout tokens",m:"rec-xl",p:"rec-md"},render:n=>o.jsx("div",{style:{border:"1px dashed #ccc",display:"inline-block"},children:o.jsx(a,{...n,style:{backgroundColor:"rgba(0,0,0,0.1)"}})})},s={args:{component:"section",children:"This Box is rendered as a <section> element",m:"rec-default",p:"rec-lg"}};var c,t,i;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    children: "This is a standard Box",
    m: "20px"
  },
  render: args => <Box {...args} style={{
    border: "1px solid gray",
    padding: "10px"
  }} />
}`,...(i=(t=e.parameters)==null?void 0:t.docs)==null?void 0:i.source}}};var d,l,p;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    children: "This Box uses Recursica layout tokens",
    m: "rec-xl",
    p: "rec-md"
  },
  render: args => <div style={{
    border: "1px dashed #ccc",
    display: "inline-block"
  }}>
      <Box {...args} style={{
      backgroundColor: "rgba(0,0,0,0.1)"
    }} />
    </div>
}`,...(p=(l=r.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var m,u,g;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    component: "section",
    children: "This Box is rendered as a <section> element",
    m: "rec-default",
    p: "rec-lg"
  }
}`,...(g=(u=s.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};const T=["Default","WithRecursicaTokens","Polymorphic"];export{e as Default,s as Polymorphic,r as WithRecursicaTokens,T as __namedExportsOrder,B as default};
