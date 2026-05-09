import{r as E,f as U,j as s,$ as D}from"./iframe-CaXTvM-c.js";import{L as q}from"./Loader-BZHYyjEs.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-D647OXYC.js";import"./factory-CNB8C45Y.js";const B="Loader-module__root___6iYOP",n={root:B},a=E.forwardRef(function({variant:r="oval",size:e="default",overStyled:$=!1,...k},T){const I={sm:"small",md:"default",lg:"large",small:"small",default:"default",large:"large"}[e]||"default",m=U(k,$),u={root:n.root},o=m.classNames;if(o&&typeof o=="object"&&!Array.isArray(o)){const g=o;u.root=g.root?`${n.root} ${g.root}`:n.root}const y=m.className,A=y?`${n.root} ${y}`:n.root;return s.jsx(q,{ref:T,type:r,"data-variant":r,"data-size":I,...m,className:A,classNames:u})});a.displayName="Loader";try{a.displayName="Loader",a.__docgenInfo={description:"",displayName:"Loader",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Loader/Loader.tsx",methods:[],props:{variant:{defaultValue:{value:"oval"},declarations:[{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"},{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"}],description:"Map to the component styles defined in variables",name:"variant",parent:{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"},required:!1,tags:{},type:{name:"enum",raw:'"oval" | "bars" | "dots" | undefined',value:[{value:"undefined"},{value:'"oval"'},{value:'"bars"'},{value:'"dots"'}]}},size:{defaultValue:{value:"default"},declarations:[{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"},{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"}],description:"Map to Recursica sizes",name:"size",parent:{fileName:"mantine-adapter/src/components/Loader/Loader.tsx",name:"RecursicaLoaderProps"},required:!1,tags:{},type:{name:"enum",raw:'"sm" | "md" | "lg" | RecursicaSize | undefined',value:[{value:"undefined"},{value:'"small"'},{value:'"default"'},{value:'"sm"'},{value:'"md"'},{value:'"lg"'},{value:'"large"'}]}}},tags:{}}}catch{}const G={title:"UI-Kit/Loader",component:a,tags:["autodocs"],parameters:{docs:{description:{component:"The Loader bridges the Recursica UI-Kit `loader` variables to the generic primitive, rendering deterministic sizes and variants visually mapped strictly from the explicit design boundary tokens."}}},argTypes:{variant:{control:"select",options:["oval","bars","dots"],description:"The structural layout variant of the loading indicator"},size:{control:"select",options:["sm","md","lg","small","default","large"],description:"Scales the dimensional and thickness layout constrained to the explicit UI variables"},color:{control:"color",description:"Optional inline dynamic color override spanning the token defaults"},layer:{control:{type:"range",min:0,max:3,step:1},description:"Applies a wrapping context to observe rendering logic externally"}}},i={args:{variant:"oval",size:"default",layer:0},render:({withLayer:t,layer:r,...e})=>s.jsx(D,{layer:r??0,style:{padding:"24px"},children:s.jsx(a,{...e})})},l={args:{variant:"oval",size:"default"},render:({withLayer:t,layer:r,...e})=>s.jsx(a,{...e})},d={args:{variant:"bars",size:"large"},render:({withLayer:t,layer:r,...e})=>s.jsx(a,{...e})},c={args:{variant:"dots",size:"sm"},render:({withLayer:t,layer:r,...e})=>s.jsx(a,{...e})},p={args:{variant:"oval",size:"default"},render:({withLayer:t,layer:r,...e})=>s.jsx(D,{layer:2,style:{padding:"24px"},children:s.jsx(a,{...e})})};var v,L,f;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: "oval",
    size: "default",
    layer: 0
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Layer layer={layer ?? 0} style={{
    padding: "24px"
  }}>
      <Loader {...args} />
    </Layer>
}`,...(f=(L=i.parameters)==null?void 0:L.docs)==null?void 0:f.source}}};var x,h,z;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    variant: "oval",
    size: "default"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Loader {...args} />
}`,...(z=(h=l.parameters)==null?void 0:h.docs)==null?void 0:z.source}}};var S,b,w;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    variant: "bars",
    size: "large"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Loader {...args} />
}`,...(w=(b=d.parameters)==null?void 0:b.docs)==null?void 0:w.source}}};var N,_,P;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    variant: "dots",
    size: "sm"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Loader {...args} />
}`,...(P=(_=c.parameters)==null?void 0:_.docs)==null?void 0:P.source}}};var j,R,O;p.parameters={...p.parameters,docs:{...(j=p.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    variant: "oval",
    size: "default"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Layer layer={2} style={{
    padding: "24px"
  }}>
      <Loader {...args} />
    </Layer>
}`,...(O=(R=p.parameters)==null?void 0:R.docs)==null?void 0:O.source}}};const H=["Default","StaticOvalDefault","StaticBarsLarge","StaticDotsSmall","LayerTwoOval"];export{i as Default,p as LayerTwoOval,d as StaticBarsLarge,c as StaticDotsSmall,l as StaticOvalDefault,H as __namedExportsOrder,G as default};
