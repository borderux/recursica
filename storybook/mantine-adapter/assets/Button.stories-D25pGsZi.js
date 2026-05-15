import{j as e,$ as V}from"./iframe-alR3zAUJ.js";import{B as u}from"./Button-CfH9wKdx.js";import"./preload-helper-Dp1pzeXC.js";import"./Loader-DIBkbq7s.js";import"./Loader-CK9Om4xw.js";import"./get-size-CgeYFbt0.js";import"./factory-Dof06U1Z.js";import"./polymorphic-factory-hZyKLKPT.js";import"./Transition-DLiW3G4D.js";import"./index-BHCHbyV8.js";import"./index-BAWhfU6I.js";import"./use-reduced-motion-indlnZzm.js";import"./UnstyledButton-CpqG645d.js";const te={title:"UI-Kit/Button",component:u,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","text"],description:"The visual variant of the button"},size:{control:"radio",options:["default","small"],description:"The size of the button"},loading:{control:"boolean",description:"Sets the button to a loading state"},useRecursicaLoader:{control:"boolean",description:"Use the Recursica Loader component instead of the default Mantine loader"},loaderVariant:{control:"select",options:["oval","bars","dots"],description:"The visual variant of the Recursica Loader"},loaderSize:{control:"select",options:[void 0,"sm","md","lg","small","default","large"],description:"The size variant for the loader"}},args:{useRecursicaLoader:!0,loaderVariant:"oval",loaderSize:void 0}},r={args:{children:"Explore Button",variant:"solid",size:"default",disabled:!1},render:({withLayer:t,layer:K,...U})=>e.jsx(u,{...U})},a={args:{children:"Solid Default",variant:"solid",size:"default"}},n={args:{children:"Outline Small",variant:"outline",size:"small"}},o={args:{children:"Text With Icon",variant:"text",size:"default",icon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},s={args:{children:"Layer 1 Solid",variant:"solid",size:"default"},render:t=>e.jsx(V,{layer:1,style:{padding:"24px"},children:e.jsx(u,{...t})})},i={args:{children:"Disabled Solid",variant:"solid",size:"default",disabled:!0}},l={args:{children:"Button as Link",variant:"solid",size:"default",component:"a",href:"https://example.com",target:"_blank"}},d={args:{children:"This is an exceptionally long button label designed to demonstrate how the component handles text overflow by applying an ellipsis rather than breaking the layout or wrapping to multiple lines.",variant:"solid",size:"default"},render:t=>e.jsx("div",{style:{maxWidth:"250px"},children:e.jsx(u,{...t})})},c={args:{children:"Saving Changes",variant:"solid",size:"default",loading:!0},parameters:{docs:{description:{story:"When `loading={true}` is applied, the Button injects the Recursica `<Loader />` component. Per Recursica design rules, placing a Button in a loading state automatically forces the `disabled={true}` state on the underlying element. This ensures the button immediately receives the brand theme disabled opacities without relying solely on semantic logic."}}}};var p,m,h;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(h=(m=r.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var g,y,v;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: "Solid Default",
    variant: "solid",
    size: "default"
  }
}`,...(v=(y=a.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var x,f,b;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: "Outline Small",
    variant: "outline",
    size: "small"
  }
}`,...(b=(f=n.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var S,L,z;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: "Text With Icon",
    variant: "text",
    size: "default",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(z=(L=o.parameters)==null?void 0:L.docs)==null?void 0:z.source}}};var w,B,k;s.parameters={...s.parameters,docs:{...(w=s.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(k=(B=s.parameters)==null?void 0:B.docs)==null?void 0:k.source}}};var T,j,D;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    children: "Disabled Solid",
    variant: "solid",
    size: "default",
    disabled: true
  }
}`,...(D=(j=i.parameters)==null?void 0:j.docs)==null?void 0:D.source}}};var W,R,O;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: "Button as Link",
    variant: "solid",
    size: "default",
    component: "a",
    href: "https://example.com",
    target: "_blank"
  }
}`,...(O=(R=l.parameters)==null?void 0:R.docs)==null?void 0:O.source}}};var P,I,C;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
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
}`,...(C=(I=d.parameters)==null?void 0:I.docs)==null?void 0:C.source}}};var E,_,A;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(A=(_=c.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};const re=["Default","SolidDefault","OutlineSmall","TextWithIcon","LayerOneSolid","DisabledSolid","PolymorphicAsLink","TruncatedLabel","Loading"];export{r as Default,i as DisabledSolid,s as LayerOneSolid,c as Loading,n as OutlineSmall,l as PolymorphicAsLink,a as SolidDefault,o as TextWithIcon,d as TruncatedLabel,re as __namedExportsOrder,te as default};
