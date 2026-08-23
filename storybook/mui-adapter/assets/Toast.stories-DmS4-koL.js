import{j as u}from"./iframe-BLiCIbSn.js";import{T as o}from"./Toast-CMonowcx.js";import"./preload-helper-Dp1pzeXC.js";import"./Alert-B5DIVvfO.js";import"./memoTheme-BMHwlbyj.js";import"./useSlot-Bs_Uu9mE.js";import"./mergeSlotProps-DjR-Y3fO.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-DgeiMcJz.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSvgIcon-BXmeBObB.js";import"./Close-BgiKrTDg.js";import"./IconButton-CywJVkS8.js";import"./ButtonBase-CjMfS4uk.js";import"./useTimeout-HOQ3xH8K.js";import"./useEventCallback--Tu1ust1.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-BJ4jvMRt.js";import"./Paper-BLoJ5zsR.js";import"./useTheme-Bc7iDKYP.js";import"./Typography-BYBRiYxT.js";const E={title:"UI-Kit/Toast",component:o,tags:["autodocs"],parameters:{docs:{description:{component:"The `Toast` component is a standalone visual component wrapping Mui's `Alert`. Note that this component is visually decoupled from `@mui/material/Snackbar` and is meant to be used when you need to render a static or manually-controlled notification panel."}}},argTypes:{title:{control:"text",description:"Title displayed above the message body"},children:{control:"text",description:"Main notification message"},withCloseButton:{control:"boolean",description:"Whether the close button is visible"}}},e={args:{variant:"default",title:"Update Available",children:"A new version of the application is available to download. Please restart your browser to apply the latest security patches and feature updates. If you ignore this message, the update will automatically install during your next session.",withCloseButton:!0},render:({withLayer:c,layer:d,...r})=>u.jsx(o,{...r})},t={args:{variant:"default",title:"Action Required",children:"You must complete your profile setup before accessing this feature.",icon:"⚠️"},parameters:{controls:{disable:!0}},render:({withLayer:c,layer:d,...r})=>u.jsx(o,{...r})};var a,n,s;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
