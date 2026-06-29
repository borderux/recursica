import{j as u}from"./iframe-Dl77tjwe.js";import{T as o}from"./Toast-B2tsxt3z.js";import"./preload-helper-Dp1pzeXC.js";import"./memoTheme-DvWC-XAq.js";import"./styled-BeaoawdT.js";import"./useSlot-BZ44NFKQ.js";import"./mergeSlotProps-D9EiCGal.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-DAouldD7.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSvgIcon-BfZP2px1.js";import"./Close-D6ncTLwB.js";import"./IconButton-BunLpcmO.js";import"./ButtonBase-B93CeWsz.js";import"./useTimeout-fPlHoj8x.js";import"./useEventCallback-B8tXGAq7.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-BKEz5Z73.js";import"./Paper-DZZiDZrW.js";import"./useTheme-Bpu9SXfZ.js";import"./Typography-CExFFrzA.js";const E={title:"UI-Kit/Toast",component:o,tags:["autodocs"],parameters:{docs:{description:{component:"The `Toast` component is a standalone visual component wrapping Mui's `Alert`. Note that this component is visually decoupled from `@mui/material/Snackbar` and is meant to be used when you need to render a static or manually-controlled notification panel."}}},argTypes:{title:{control:"text",description:"Title displayed above the message body"},children:{control:"text",description:"Main notification message"},withCloseButton:{control:"boolean",description:"Whether the close button is visible"}}},e={args:{variant:"default",title:"Update Available",children:"A new version of the application is available to download. Please restart your browser to apply the latest security patches and feature updates. If you ignore this message, the update will automatically install during your next session.",withCloseButton:!0},render:({withLayer:c,layer:d,...r})=>u.jsx(o,{...r})},t={args:{variant:"default",title:"Action Required",children:"You must complete your profile setup before accessing this feature.",icon:"⚠️"},parameters:{controls:{disable:!0}},render:({withLayer:c,layer:d,...r})=>u.jsx(o,{...r})};var a,n,s;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
}`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var i,l,p;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(p=(l=t.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};const M=["Default","WithIcon"];export{e as Default,t as WithIcon,M as __namedExportsOrder,E as default};
