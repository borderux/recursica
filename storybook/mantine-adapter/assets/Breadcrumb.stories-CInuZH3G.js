import{j as a}from"./iframe-ui3vHneJ.js";import{B as o}from"./Breadcrumb-BIAkumTB.js";import{L as f}from"./Link-BWQcuRuE.js";import"./preload-helper-Dp1pzeXC.js";import"./is-element-DFX_OVHe.js";import"./get-size-C3KF_bQQ.js";import"./factory-Bm8Z26Jt.js";import"./polymorphic-factory-BPOocaz7.js";import"./Text-BJRU9r0k.js";const R={title:"UI-Kit/Breadcrumb",component:o,tags:["autodocs"],argTypes:{children:{table:{disable:!0}},items:{control:"object",description:"Array of string labels used to dynamically generate the interactive Breadcrumb nodes.",table:{category:"Story Controls"}},separator:{control:"text",description:"Custom separator between items"}},args:{items:["Home","Components","Breadcrumbs"]},render:({items:t,children:d,...u})=>{const l=t?t.map((g,b)=>a.jsx(f,{href:"#",children:g},b)):d;return a.jsx(o,{children:l,...u})}},r={args:{items:["Dashboard","Settings","Security"]}},e={args:{items:["Root","Branch","Leaf"],separator:"→"}};var s,n,m;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {
    items: ["Dashboard", "Settings", "Security"]
  }
}`,...(m=(n=r.parameters)==null?void 0:n.docs)==null?void 0:m.source}}};var i,c,p;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    items: ["Root", "Branch", "Leaf"],
    separator: "→"
  }
}`,...(p=(c=e.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};const E=["Default","CustomSeparator"];export{e as CustomSeparator,r as Default,E as __namedExportsOrder,R as default};
