import{j as a,m as E,R as H,f as W}from"./iframe-CPRD1BZ_.js";import{b as k}from"./get-size-lAorsOFx.js";import{f as D,u as G,d as K,B as T,e as O}from"./factory-DllH8HeB.js";import{C as Y}from"./CloseButton-zN3TM6ao.js";import{L as $}from"./Loader-DvAuwtdx.js";import"./preload-helper-Dp1pzeXC.js";import"./polymorphic-factory-cyn4qPiC.js";import"./UnstyledButton-DZIk5CDo.js";var R={root:"m_a513464",icon:"m_a4ceffb",loader:"m_b0920b15",body:"m_a49ed24",title:"m_3feedf16",description:"m_3d733a3a",closeButton:"m_919a4d88"};const Q={withCloseButton:!0},X=O((s,{radius:o,color:e})=>({root:{"--notification-radius":o===void 0?void 0:k(o),"--notification-color":e?E(e,s):void 0}})),h=D((s,o)=>{const e=G("Notification",Q,s),{className:f,color:y,radius:_,loading:c,withCloseButton:n,withBorder:d,title:r,icon:t,children:P,onClose:j,closeButtonProps:A,classNames:C,style:L,styles:I,unstyled:g,vars:S,mod:q,loaderProps:M,role:V,attributes:U,...z}=e,i=K({name:"Notification",classes:R,props:e,className:f,style:L,classNames:C,styles:I,unstyled:g,attributes:U,vars:S,varsResolver:X});return a.jsxs(T,{...i("root"),mod:[{"data-with-icon":!!t||c,"data-with-border":d},q],ref:o,role:V||"alert",...z,children:[t&&!c&&a.jsx("div",{...i("icon"),children:t}),c&&a.jsx($,{size:28,color:y,...M,...i("loader")}),a.jsxs("div",{...i("body"),children:[r&&a.jsx("div",{...i("title"),children:r}),a.jsx(T,{...i("description"),mod:{"data-with-title":!!r},children:P})]}),n&&a.jsx(Y,{iconSize:16,color:"gray",...A,unstyled:g,onClick:j,...i("closeButton")})]})});h.classes=R;h.displayName="@mantine/core/Notification";const F="Toast-module__root___MUvfI",J="Toast-module__icon___VwvE1",Z="Toast-module__loader___8Gxd-",ee="Toast-module__title___-H6R2",te="Toast-module__description___-QwfC",ae="Toast-module__closeButton___vGr7g",oe="Toast-module__body___VLkXA",l={root:F,icon:J,loader:Z,title:ee,description:te,closeButton:ae,body:oe},u=H.forwardRef(function({overStyled:o=!1,variant:e="default",withCloseButton:f=!0,...y},_){const c=W(y,o),n={root:l.root,body:l.body,title:l.title,description:l.description,closeButton:l.closeButton,icon:l.icon,loader:l.loader},d=c.classNames;if(d&&typeof d=="object"&&!Array.isArray(d)){const r=d;Object.keys(r).forEach(t=>{n[t]?n[t]=`${n[t]} ${r[t]}`:n[t]=r[t]})}return a.jsx(h,{ref:_,withCloseButton:f,withBorder:!1,"data-variant":e,classNames:n,loading:!1,...c})});u.displayName="Toast";try{u.displayName="Toast",u.__docgenInfo={description:"",displayName:"Toast",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Toast/Toast.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}},variant:{defaultValue:{value:"default"},declarations:[{fileName:"mantine-adapter/src/components/Toast/Toast.tsx",name:"RecursicaToastProps"},{fileName:"mantine-adapter/src/components/Toast/Toast.tsx",name:"RecursicaToastProps"}],description:"The visual variant of the toast.",name:"variant",parent:{fileName:"mantine-adapter/src/components/Toast/Toast.tsx",name:"RecursicaToastProps"},required:!1,tags:{default:'"default"'},type:{name:"enum",raw:'"default" | undefined',value:[{value:"undefined"},{value:'"default"'}]}},loading:{defaultValue:null,declarations:[{fileName:"mantine-adapter/src/components/Toast/Toast.tsx",name:"RecursicaToastProps"},{fileName:"mantine-adapter/src/components/Toast/Toast.tsx",name:"RecursicaToastProps"}],description:'Loading state is natively unsupported by Recursica UI Kit.\nIf a loading state is required, pass a `<Loader size="sm" />` directly into the `icon` prop.',name:"loading",parent:{fileName:"mantine-adapter/src/components/Toast/Toast.tsx",name:"RecursicaToastProps"},required:!1,tags:{},type:{name:"false | undefined"}}},tags:{}}}catch{}const pe={title:"UI-Kit/Toast",component:u,tags:["autodocs"],parameters:{docs:{description:{component:"The `Toast` component is a standalone visual component wrapping Mantine's `Notification`. Note that this component is visually decoupled from `@mantine/notifications` and is meant to be used when you need to render a static or manually-controlled notification panel. If you need dynamic notification popups, you should use `@mantine/notifications` and configure its provider to use our styles."}}},argTypes:{title:{control:"text",description:"Title displayed above the message body"},children:{control:"text",description:"Main notification message"},withCloseButton:{control:"boolean",description:"Whether the close button is visible"}}},p={args:{variant:"default",title:"Update Available",children:"A new version of the application is available to download. Please restart your browser to apply the latest security patches and feature updates. If you ignore this message, the update will automatically install during your next session.",withCloseButton:!0},render:({withLayer:s,layer:o,...e})=>a.jsx(u,{...e})},m={args:{variant:"default",title:"Action Required",children:"You must complete your profile setup before accessing this feature.",icon:"⚠️"},parameters:{controls:{disable:!0}},render:({withLayer:s,layer:o,...e})=>a.jsx(u,{...e})};var v,b,x;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    variant: "default",
    title: "Update Available",
    children: "A new version of the application is available to download. Please restart your browser to apply the latest security patches and feature updates. If you ignore this message, the update will automatically install during your next session.",
    withCloseButton: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: ToastStoryArgs) => {
    return <Toast {...args} />;
  }
}`,...(x=(b=p.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var w,N,B;m.parameters={...m.parameters,docs:{...(w=m.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    variant: "default",
    title: "Action Required",
    children: "You must complete your profile setup before accessing this feature.",
    icon: "⚠️"
  },
  parameters: {
    controls: {
      disable: true
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: ToastStoryArgs) => {
    return <Toast {...args} />;
  }
}`,...(B=(N=m.parameters)==null?void 0:N.docs)==null?void 0:B.source}}};const me=["Default","WithIcon"];export{p as Default,m as WithIcon,me as __namedExportsOrder,pe as default};
