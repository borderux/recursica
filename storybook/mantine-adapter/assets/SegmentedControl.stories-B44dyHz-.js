import{j as e}from"./iframe-CE_LlejV.js";import{S as r}from"./SegmentedControl-7hWs9RvL.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-C83oZ-QB.js";import"./factory-BncmibqV.js";import"./get-env-uyVen0u2.js";import"./to-int-PQE0s6ay.js";import"./use-merged-ref-h-rj-TRM.js";import"./use-id-C9bbnVWb.js";import"./use-uncontrolled-0xYoDpRb.js";const M={title:"UI-Kit/SegmentedControl",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"SegmentedControl provides a linear set of two or more segments, each of which functions as a mutually exclusive button."}}},argTypes:{orientation:{control:"radio",options:["horizontal","vertical"]},fullWidth:{control:"boolean"},disabled:{table:{disable:!0}},data:{table:{disable:!0}},defaultChecked:{table:{disable:!0}}}},t={args:{data:["React","Angular","Vue","Svelte"],orientation:"horizontal",fullWidth:!1},render:({withLayer:l,layer:i,...n})=>e.jsx(r,{...n})},a={args:{data:["Daily","Weekly","Monthly"],fullWidth:!0},render:({withLayer:l,layer:i,...n})=>e.jsx(r,{...n})},s={args:{data:["Option 1","Option 2","Option 3"],orientation:"vertical"},render:({withLayer:l,layer:i,...n})=>e.jsx(r,{...n})},c=()=>e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),o={args:{data:[{value:"daily",label:e.jsxs(e.Fragment,{children:[e.jsx(c,{}),e.jsx("span",{children:"Daily"})]})},{value:"weekly",label:e.jsxs(e.Fragment,{children:[e.jsx(c,{}),e.jsx("span",{children:"Weekly"})]})},{value:"monthly",label:e.jsxs(e.Fragment,{children:[e.jsx(c,{}),e.jsx("span",{children:"Monthly"})]})}]},render:({withLayer:l,layer:i,...n})=>e.jsx(r,{...n})};var d,p,u;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    data: ["React", "Angular", "Vue", "Svelte"],
    orientation: "horizontal",
    fullWidth: false
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(u=(p=t.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};var y,m,h;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    data: ["Daily", "Weekly", "Monthly"],
    fullWidth: true
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(h=(m=a.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var g,x,v;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    data: ["Option 1", "Option 2", "Option 3"],
    orientation: "vertical"
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(v=(x=s.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var b,j,f;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    data: [{
      value: "daily",
      label: <>
            <CheckIcon />
            <span>Daily</span>
          </>
    }, {
      value: "weekly",
      label: <>
            <CheckIcon />
            <span>Weekly</span>
          </>
    }, {
      value: "monthly",
      label: <>
            <CheckIcon />
            <span>Monthly</span>
          </>
    }]
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(f=(j=o.parameters)==null?void 0:j.docs)==null?void 0:f.source}}};const V=["Default","FullWidth","Vertical","WithIcons"];export{t as Default,a as FullWidth,s as Vertical,o as WithIcons,V as __namedExportsOrder,M as default};
