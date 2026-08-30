import{j as r}from"./iframe-DR-INLC0.js";import{C as s}from"./Chip-REQNHWVb.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-D0EXS9U1.js";import"./factory-DITFcJHQ.js";import"./CheckIcon-CPYX7hl8.js";import"./create-optional-context-CYjrubmi.js";import"./use-uncontrolled-qN_0vGE3.js";import"./use-id-7hhaRI77.js";const G={title:"UI-Kit/Chip",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"The Chip component is used to represent interactive selections, descriptive tags, or dynamic filters natively bounded to Recursica variables. It can be used as a toggleable input, can render a custom leading `icon`, and handles close constraints automatically via the `onDelete` property."}}},argTypes:{error:{control:"boolean",description:"Applies the error state styling dynamically."},disabled:{control:"boolean",description:"Applies disabled token states."},checked:{control:"boolean",description:"Forces the visual selected state."}}},o={args:{children:"Default Chip",error:!1,disabled:!1,checked:!1},render:e=>r.jsx(s,{...e})},a={args:{children:"Unselected",checked:!1},render:e=>r.jsx(s,{...e})},c={args:{children:"Selected",checked:!0},render:e=>r.jsx(s,{...e,onChange:()=>{}})},t={args:{children:"Error",error:!0,checked:!1},render:e=>r.jsx(s,{...e})},i={args:{children:"Error Selected",error:!0,checked:!0},render:e=>r.jsx(s,{...e,onChange:()=>{}})},d={args:{children:"Dismissible",checked:!1,onDelete:()=>console.log("Removal Action Triggered")},render:e=>r.jsx(s,{...e})},n={args:{children:"Leading Icon",checked:!1,icon:r.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("circle",{cx:"12",cy:"12",r:"10"}),r.jsx("path",{d:"M12 8v4"}),r.jsx("path",{d:"M12 16h.01"})]})},render:e=>r.jsx(s,{...e})},l={args:{...n.args,children:"Leading Icon Selected",checked:!0},render:e=>r.jsx(s,{...e,onChange:()=>{}})};var p,h,g;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Default Chip",
    error: false,
    disabled: false,
    checked: false
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(g=(h=o.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var m,u,C;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: "Unselected",
    checked: false
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(C=(u=a.parameters)==null?void 0:u.docs)==null?void 0:C.source}}};var S,k,f;c.parameters={...c.parameters,docs:{...(S=c.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: "Selected",
    checked: true
  },
  render: (args: ChipStoryProps) => <Chip {...args} onChange={() => {}} />
}`,...(f=(k=c.parameters)==null?void 0:k.docs)==null?void 0:f.source}}};var x,v,y;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: "Error",
    error: true,
    checked: false
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(y=(v=t.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var j,b,L;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: "Error Selected",
    error: true,
    checked: true
  },
  render: (args: ChipStoryProps) => <Chip {...args} onChange={() => {}} />
}`,...(L=(b=i.parameters)==null?void 0:b.docs)==null?void 0:L.source}}};var I,w,E;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    children: "Dismissible",
    checked: false,
    onDelete: () => console.log("Removal Action Triggered")
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(E=(w=d.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};var D,P,W;n.parameters={...n.parameters,docs:{...(D=n.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(W=(P=n.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var R,U,A;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    ...WithLeadingIcon.args,
    children: "Leading Icon Selected",
    checked: true
  },
  render: (args: ChipStoryProps) => <Chip {...args} onChange={() => {}} />
}`,...(A=(U=l.parameters)==null?void 0:U.docs)==null?void 0:A.source}}};const H=["Default","Unselected","Selected","ErrorState","ErrorSelected","Removable","WithLeadingIcon","WithLeadingIconSelected"];export{o as Default,i as ErrorSelected,t as ErrorState,d as Removable,c as Selected,a as Unselected,n as WithLeadingIcon,l as WithLeadingIconSelected,H as __namedExportsOrder,G as default};
