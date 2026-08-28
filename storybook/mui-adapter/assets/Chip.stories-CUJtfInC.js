import{j as r}from"./iframe-Bain31R0.js";import{C as s}from"./Chip-CfDam-pb.js";import"./preload-helper-Dp1pzeXC.js";import"./Chip-Cw_PjuPn.js";import"./createSvgIcon--Z68nxbq.js";import"./memoTheme-C8oOPpFq.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./useSlot-BYP_jPjY.js";import"./mergeSlotProps-DT6hk6s3.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-itiL0CSC.js";import"./ButtonBase-nOQ6vh2E.js";import"./useTimeout-DrzpHnwK.js";import"./useEventCallback-B-qTP8Ut.js";import"./isFocusVisible-B8k4qzLc.js";const Y={title:"UI-Kit/Chip",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"The Chip component is used to represent interactive selections, descriptive tags, or dynamic filters natively bounded to Recursica variables. It can be used as a toggleable input, can render a custom leading `icon`, and handles close constraints automatically via the `onDelete` property."}}},argTypes:{error:{control:"boolean",description:"Applies the error state styling dynamically."},disabled:{control:"boolean",description:"Applies disabled token states."},checked:{control:"boolean",description:"Forces the visual selected state."}}},n={args:{children:"Default Chip",error:!1,disabled:!1,checked:!1},render:e=>r.jsx(s,{...e})},a={args:{children:"Unselected",checked:!1},render:e=>r.jsx(s,{...e})},t={args:{children:"Selected",checked:!0},render:e=>r.jsx(s,{...e,onChange:()=>{}})},c={args:{children:"Error",error:!0,checked:!1},render:e=>r.jsx(s,{...e})},i={args:{children:"Error Selected",error:!0,checked:!0},render:e=>r.jsx(s,{...e,onChange:()=>{}})},d={args:{children:"Dismissible",checked:!1,onDelete:()=>console.log("Removal Action Triggered")},render:e=>r.jsx(s,{...e})},o={args:{children:"Leading Icon",checked:!1,icon:r.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("circle",{cx:"12",cy:"12",r:"10"}),r.jsx("path",{d:"M12 8v4"}),r.jsx("path",{d:"M12 16h.01"})]})},render:e=>r.jsx(s,{...e})},l={args:{...o.args,children:"Leading Icon Selected",checked:!0},render:e=>r.jsx(s,{...e,onChange:()=>{}})};var p,h,g;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    children: "Default Chip",
    error: false,
    disabled: false,
    checked: false
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(g=(h=n.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var m,u,C;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: "Unselected",
    checked: false
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(C=(u=a.parameters)==null?void 0:u.docs)==null?void 0:C.source}}};var S,k,f;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: "Selected",
    checked: true
  },
  render: (args: ChipStoryProps) => <Chip {...args} onChange={() => {}} />
}`,...(f=(k=t.parameters)==null?void 0:k.docs)==null?void 0:f.source}}};var x,v,y;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: "Error",
    error: true,
    checked: false
  },
  render: (args: ChipStoryProps) => <Chip {...args} />
}`,...(y=(v=c.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};var j,b,L;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(E=(w=d.parameters)==null?void 0:w.docs)==null?void 0:E.source}}};var D,P,W;o.parameters={...o.parameters,docs:{...(D=o.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(W=(P=o.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var R,U,A;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    ...WithLeadingIcon.args,
    children: "Leading Icon Selected",
    checked: true
  },
  render: (args: ChipStoryProps) => <Chip {...args} onChange={() => {}} />
}`,...(A=(U=l.parameters)==null?void 0:U.docs)==null?void 0:A.source}}};const Z=["Default","Unselected","Selected","ErrorState","ErrorSelected","Removable","WithLeadingIcon","WithLeadingIconSelected"];export{n as Default,i as ErrorSelected,c as ErrorState,d as Removable,t as Selected,a as Unselected,o as WithLeadingIcon,l as WithLeadingIconSelected,Z as __namedExportsOrder,Y as default};
