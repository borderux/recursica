import{j as e,g as F}from"./iframe-BTksmf0I.js";import{B as p}from"./Button-B6tE-CZV.js";import"./preload-helper-Dp1pzeXC.js";import"./Loader-HBrhz6pd.js";import"./styled-C6tCmiHg.js";import"./memoTheme-vMW9oVsi.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./ButtonBase-CXnJaOVv.js";import"./useTimeout-BqZDULXQ.js";import"./useForkRef-Dgq5iXaA.js";import"./useEventCallback-CuwkRmbk.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-BT6K5luT.js";const se={title:"UI-Kit/Button",component:p,tags:["autodocs"],argTypes:{disabled:{control:"boolean"},variant:{control:"select",options:["solid","outline","text"],description:"The visual variant of the button"},size:{control:"radio",options:["default","small"],description:"The size of the button"},loading:{control:"boolean",description:"Sets the button to a loading state"},useRecursicaLoader:{control:"boolean",description:"Use the Recursica Loader component instead of the default Mantine loader"},loaderVariant:{control:"select",options:["oval","bars","dots"],description:"The visual variant of the Recursica Loader"},loaderSize:{control:"select",options:[void 0,"sm","md","lg","small","default","large"],description:"The size variant for the loader"}},args:{useRecursicaLoader:!0,loaderVariant:"oval",loaderSize:void 0}},n={args:{children:"Explore Button",variant:"solid",size:"default",disabled:!1},render:({withLayer:r,layer:G,...q})=>e.jsx(p,{...q})},t={args:{children:"Solid Default",variant:"solid",size:"default"}},a={args:{children:"Outline Small",variant:"outline",size:"small"}},o={args:{children:"Text With Icon",variant:"text",size:"default",icon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},s={args:{variant:"solid",size:"default","aria-label":"Search",icon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},i={args:{children:"Layer 1 Solid",variant:"solid",size:"default"},render:r=>e.jsx(F,{layer:1,style:{padding:"24px"},children:e.jsx(p,{...r})})},l={args:{children:"Disabled Solid",variant:"solid",size:"default",disabled:!0}},d={args:{children:"Button as Link",variant:"solid",size:"default",component:"a",href:"https://example.com",target:"_blank"}},c={args:{children:"This is an exceptionally long button label designed to demonstrate how the component handles text overflow by applying an ellipsis rather than breaking the layout or wrapping to multiple lines.",variant:"solid",size:"default"},render:r=>e.jsx("div",{style:{maxWidth:"250px"},children:e.jsx(p,{...r})})},u={args:{children:"Saving Changes",variant:"solid",size:"default",loading:!0},parameters:{docs:{description:{story:"When `loading={true}` is applied, the Button injects the Recursica `<Loader />` component. Per Recursica design rules, placing a Button in a loading state automatically forces the `disabled={true}` state on the underlying element. This ensures the button immediately receives the brand theme disabled opacities without relying solely on semantic logic."}}}};var m,h,g;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: "Explore Button",
    variant: "solid",
    size: "default",
    disabled: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <Button {...args} />;
  }
}`,...(g=(h=n.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var y,x,v;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default"
  }
}`,...(v=(x=t.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var f,b,S;a.parameters={...a.parameters,docs:{...(f=a.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small"
  }
}`,...(S=(b=a.parameters)==null?void 0:b.docs)==null?void 0:S.source}}};var w,L,z;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(z=(L=o.parameters)==null?void 0:L.docs)==null?void 0:z.source}}};var k,B,j;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    variant: "solid",
    size: "default",
    "aria-label": "Search",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(j=(B=s.parameters)==null?void 0:B.docs)==null?void 0:j.source}}};var T,W,D;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    children: "Layer 1 Solid",
    variant: "solid",
    size: "default"
  },
  render: (args: ButtonStoryProps) => <Layer layer={1} style={{
    padding: "24px"
  }}>
      <Button {...args} />
    </Layer>
}`,...(D=(W=i.parameters)==null?void 0:W.docs)==null?void 0:D.source}}};var O,R,I;l.parameters={...l.parameters,docs:{...(O=l.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true
  }
}`,...(I=(R=l.parameters)==null?void 0:R.docs)==null?void 0:I.source}}};var C,P,E;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    children: "Button as Link",
    variant: "solid",
    size: "default",
    component: "a",
    href: "https://example.com",
    target: "_blank"
  }
}`,...(E=(P=d.parameters)==null?void 0:P.docs)==null?void 0:E.source}}};var _,A,U;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    children: "This is an exceptionally long button label designed to demonstrate how the component handles text overflow by applying an ellipsis rather than breaking the layout or wrapping to multiple lines.",
    variant: "solid",
    size: "default"
  },
  render: (args: ButtonStoryProps) => <div style={{
    maxWidth: "250px"
  }}>
      <Button {...args} />
    </div>
}`,...(U=(A=c.parameters)==null?void 0:A.docs)==null?void 0:U.source}}};var V,K,M;u.parameters={...u.parameters,docs:{...(V=u.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: "Saving Changes",
    variant: "solid",
    size: "default",
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: "When \`loading={true}\` is applied, the Button injects the Recursica \`<Loader />\` component. Per Recursica design rules, placing a Button in a loading state automatically forces the \`disabled={true}\` state on the underlying element. This ensures the button immediately receives the brand theme disabled opacities without relying solely on semantic logic."
      }
    }
  }
}`,...(M=(K=u.parameters)==null?void 0:K.docs)==null?void 0:M.source}}};const ie=["Default","SolidDefault","OutlineSmall","TextWithIcon","IconOnly","LayerOneSolid","DisabledSolid","PolymorphicAsLink","TruncatedLabel","Loading"];export{n as Default,l as DisabledSolid,s as IconOnly,i as LayerOneSolid,u as Loading,a as OutlineSmall,d as PolymorphicAsLink,t as SolidDefault,o as TextWithIcon,c as TruncatedLabel,ie as __namedExportsOrder,se as default};
