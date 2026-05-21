import{j as e,$ as U}from"./iframe-BYOZEeYD.js";import{B as u}from"./Button-DVlNpg4_.js";import"./preload-helper-Dp1pzeXC.js";import"./Loader-CbiGVmWM.js";import"./styled-BYEb5xEm.js";import"./createSimplePaletteValueFilter-Cbfyuw2F.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./isFocusVisible-B8k4qzLc.js";const X={title:"UI-Kit/Button",component:u,tags:["autodocs"],argTypes:{disabled:{control:"boolean"},variant:{control:"select",options:["solid","outline","text"],description:"The visual variant of the button"},size:{control:"radio",options:["default","small"],description:"The size of the button"},loading:{control:"boolean",description:"Sets the button to a loading state"},useRecursicaLoader:{control:"boolean",description:"Use the Recursica Loader component instead of the default Mantine loader"},loaderVariant:{control:"select",options:["oval","bars","dots"],description:"The visual variant of the Recursica Loader"},loaderSize:{control:"select",options:[void 0,"sm","md","lg","small","default","large"],description:"The size variant for the loader"}},args:{useRecursicaLoader:!0,loaderVariant:"oval",loaderSize:void 0},parameters:{controls:{include:["layer","withLayer","variant","size","children","component","icon","disabled","href","onClick","onChange","value","checked","loading","useRecursicaLoader","loaderVariant","loaderSize"]}}},r={args:{children:"Explore Button",variant:"solid",size:"default",disabled:!1},render:({withLayer:a,layer:K,...A})=>e.jsx(u,{...A})},n={args:{children:"Solid Default",variant:"solid",size:"default"}},t={args:{children:"Outline Small",variant:"outline",size:"small"}},o={args:{children:"Text With Icon",variant:"text",size:"default",icon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},s={args:{children:"Layer 1 Solid",variant:"solid",size:"default"},render:a=>e.jsx(U,{layer:1,style:{padding:"24px"},children:e.jsx(u,{...a})})},i={args:{children:"Disabled Solid",variant:"solid",size:"default",disabled:!0}},l={args:{children:"Button as Link",variant:"solid",size:"default",component:"a",href:"https://example.com",target:"_blank"}},d={args:{children:"This is an exceptionally long button label designed to demonstrate how the component handles text overflow by applying an ellipsis rather than breaking the layout or wrapping to multiple lines.",variant:"solid",size:"default"},render:a=>e.jsx("div",{style:{maxWidth:"250px"},children:e.jsx(u,{...a})})},c={args:{children:"Saving Changes",variant:"solid",size:"default",loading:!0},parameters:{docs:{description:{story:"When `loading={true}` is applied, the Button injects the Recursica `<Loader />` component. Per Recursica design rules, placing a Button in a loading state automatically forces the `disabled={true}` state on the underlying element. This ensures the button immediately receives the brand theme disabled opacities without relying solely on semantic logic."}}}};var p,m,h;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(h=(m=r.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var g,y,v;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default"
  }
}`,...(v=(y=n.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var x,f,b;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small"
  }
}`,...(b=(f=t.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var S,L,z;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(z=(L=o.parameters)==null?void 0:L.docs)==null?void 0:z.source}}};var w,k,B;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(B=(k=s.parameters)==null?void 0:k.docs)==null?void 0:B.source}}};var T,j,D;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true
  }
}`,...(D=(j=i.parameters)==null?void 0:j.docs)==null?void 0:D.source}}};var R,W,O;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    children: "Button as Link",
    variant: "solid",
    size: "default",
    component: "a",
    href: "https://example.com",
    target: "_blank"
  }
}`,...(O=(W=l.parameters)==null?void 0:W.docs)==null?void 0:O.source}}};var C,P,I;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(I=(P=d.parameters)==null?void 0:P.docs)==null?void 0:I.source}}};var E,_,V;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(V=(_=c.parameters)==null?void 0:_.docs)==null?void 0:V.source}}};const Y=["Default","SolidDefault","OutlineSmall","TextWithIcon","LayerOneSolid","DisabledSolid","PolymorphicAsLink","TruncatedLabel","Loading"];export{r as Default,i as DisabledSolid,s as LayerOneSolid,c as Loading,t as OutlineSmall,l as PolymorphicAsLink,n as SolidDefault,o as TextWithIcon,d as TruncatedLabel,Y as __namedExportsOrder,X as default};
