import{j as r}from"./iframe-DahVp6_-.js";import{C as s}from"./Chip-1i4tzqcA.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-aDX96fpj.js";import"./factory-D_NNwu8P.js";import"./CheckIcon-COxmPzIn.js";import"./create-optional-context-C3qqW9Z4.js";import"./use-uncontrolled-CVc8Bbkh.js";import"./use-id-CxPB4dVW.js";const K={title:"UI-Kit/Chip",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"The Chip component is used to represent interactive selections, descriptive tags, or dynamic filters natively bounded to Recursica variables. It can be used as a toggleable input, can render a custom leading `icon`, and handles close constraints automatically via the `onRemove` property."}}},argTypes:{error:{control:"boolean",description:"Applies the error state styling dynamically."},disabled:{control:"boolean",description:"Applies disabled token states."},checked:{control:"boolean",description:"Forces the visual selected state."}}},o={args:{children:"Default Chip",error:!1,disabled:!1,checked:!1},render:e=>r.jsx(s,{...e})},n={args:{children:"Unselected",checked:!1},render:e=>r.jsx(s,{...e})},a={args:{children:"Selected",checked:!0},render:e=>r.jsx(s,{...e,onChange:()=>{}})},c={args:{children:"Error",error:!0,checked:!1},render:e=>r.jsx(s,{...e})},t={args:{children:"Error Selected",error:!0,checked:!0},render:e=>r.jsx(s,{...e,onChange:()=>{}})},i={args:{children:"Dismissible",checked:!1,onRemove:()=>console.log("Removal Action Triggered")},render:e=>r.jsx(s,{...e})},d={args:{children:"Leading Icon",checked:!1,icon:r.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("circle",{cx:"12",cy:"12",r:"10"}),r.jsx("path",{d:"M12 8v4"}),r.jsx("path",{d:"M12 16h.01"})]})},render:e=>r.jsx(s,{...e})};var l,p,h;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    children: "Default Chip",
    error: false,
    disabled: false,
    checked: false
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(h=(p=o.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};var g,m,u;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: "Unselected",
    checked: false
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(u=(m=n.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var C,f,k;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    children: "Selected",
    checked: true
  },
  render: (args: ChipStoryProps) => <Chip {...args} onChange={() => {}} />
}`,...(k=(f=a.parameters)==null?void 0:f.docs)==null?void 0:k.source}}};var S,v,x;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: "Error",
    error: true,
    checked: false
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(x=(v=c.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var y,b,j;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: "Error Selected",
    error: true,
    checked: true
  },
  render: (args: ChipStoryProps) => <Chip {...args} onChange={() => {}} />
}`,...(j=(b=t.parameters)==null?void 0:b.docs)==null?void 0:j.source}}};var w,E,R;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    children: "Dismissible",
    checked: false,
    onRemove: () => console.log("Removal Action Triggered")
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(R=(E=i.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};var L,P,D;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    children: "Leading Icon",
    checked: false,
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v4"></path>
        <path d="M12 16h.01"></path>
      </svg>
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(D=(P=d.parameters)==null?void 0:P.docs)==null?void 0:D.source}}};const O=["Default","Unselected","Selected","ErrorState","ErrorSelected","Removable","WithLeadingIcon"];export{o as Default,t as ErrorSelected,c as ErrorState,i as Removable,a as Selected,n as Unselected,d as WithLeadingIcon,O as __namedExportsOrder,K as default};
