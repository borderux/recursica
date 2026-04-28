import{r as E,f as U,j as r,$ as O}from"./iframe-BHhWYZEC.js";import{L as q}from"./Loader-BcO3V0vd.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-BlbtXTyo.js";import"./factory-CVE1eDgt.js";const B="Loader-module__root___6iYOP",s={root:B},a=E.forwardRef(function({variant:o="oval",size:D="default",overStyled:$=!1,...k},T){const I={sm:"small",md:"default",lg:"large",small:"small",default:"default",large:"large"}[D]||"default",m=U(k,$),p={root:s.root},t=m.classNames;if(t&&typeof t=="object"&&!Array.isArray(t)){const g=t;p.root=g.root?`${s.root} ${g.root}`:s.root}const u=m.className,A=u?`${s.root} ${u}`:s.root;return r.jsx(q,{ref:T,type:o,"data-variant":o,"data-size":I,...m,className:A,classNames:p})});a.displayName="Loader";try{a.displayName="Loader",a.__docgenInfo={description:"",displayName:"Loader",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Loader/Loader.tsx",methods:[],props:{variant:{defaultValue:{value:"oval"},declarations:[{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"},{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"}],description:"Map to the component styles defined in variables",name:"variant",parent:{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"},required:!1,tags:{},type:{name:"enum",raw:'"oval" | "bars" | "dots" | undefined',value:[{value:"undefined"},{value:'"oval"'},{value:'"bars"'},{value:'"dots"'}]}},size:{defaultValue:{value:"default"},declarations:[{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"},{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"}],description:"Map to Recursica sizes",name:"size",parent:{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"},required:!1,tags:{},type:{name:"enum",raw:'"sm" | "md" | "lg" | RecursicaSize | undefined',value:[{value:"undefined"},{value:'"small"'},{value:'"default"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"large"'}]}}},tags:{}}}catch{}const G={title:"UI-Kit/Loader",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"The Loader bridges the Recursica UI-Kit `loader` variables to the generic primitive, rendering deterministic sizes and variants visually mapped strictly from the explicit design boundary tokens."}}},argTypes:{variant:{control:"select",options:["oval","bars","dots"],description:"The structural layout variant of the loading indicator"},size:{control:"select",options:["sm","md","lg","small","default","large"],description:"Scales the dimensional and thickness layout constrained to the explicit UI variables"},color:{control:"color",description:"Optional inline dynamic color override spanning the token defaults"},layer:{control:{type:"range",min:0,max:3,step:1},description:"Applies a wrapping context to observe rendering logic externally"}}},n={args:{variant:"oval",size:"default",layer:0},render:({layer:e,...o})=>r.jsx(O,{layer:e??0,style:{padding:"24px"},children:r.jsx(a,{...o})})},i={args:{variant:"oval",size:"default"},render:e=>r.jsx(a,{...e})},l={args:{variant:"bars",size:"large"},render:e=>r.jsx(a,{...e})},d={args:{variant:"dots",size:"sm"},render:e=>r.jsx(a,{...e})},c={args:{variant:"oval",size:"default"},render:e=>r.jsx(O,{layer:2,style:{padding:"24px"},children:r.jsx(a,{...e})})};var v,f,L;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: "oval",
    size: "default",
    layer: 0
  },
  render: ({
    layer,
    ...args
  }) => <Layer layer={layer ?? 0} style={{
    padding: "24px"
  }}>
      <Loader {...args} />
    </Layer>
}`,...(L=(f=n.parameters)==null?void 0:f.docs)==null?void 0:L.source}}};var y,x,z;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    variant: "oval",
    size: "default"
  },
  render: args => <Loader {...args} />
}`,...(z=(x=i.parameters)==null?void 0:x.docs)==null?void 0:z.source}}};var S,h,N;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    variant: "bars",
    size: "large"
  },
  render: args => <Loader {...args} />
}`,...(N=(h=l.parameters)==null?void 0:h.docs)==null?void 0:N.source}}};var _,b,P;d.parameters={...d.parameters,docs:{...(_=d.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    variant: "dots",
    size: "sm"
  },
  render: args => <Loader {...args} />
}`,...(P=(b=d.parameters)==null?void 0:b.docs)==null?void 0:P.source}}};var j,R,w;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    variant: "oval",
    size: "default"
  },
  render: args => <Layer layer={2} style={{
    padding: "24px"
  }}>
      <Loader {...args} />
    </Layer>
}`,...(w=(R=c.parameters)==null?void 0:R.docs)==null?void 0:w.source}}};const H=["Default","StaticOvalDefault","StaticBarsLarge","StaticDotsSmall","LayerTwoOval"];export{n as Default,c as LayerTwoOval,l as StaticBarsLarge,d as StaticDotsSmall,i as StaticOvalDefault,H as __namedExportsOrder,G as default};
