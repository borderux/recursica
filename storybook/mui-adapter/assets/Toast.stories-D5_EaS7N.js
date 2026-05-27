import{j as u}from"./iframe-C_ymJL69.js";import{T as r}from"./Toast-DCiNGD7P.js";import"./preload-helper-Dp1pzeXC.js";import"./useTimeout-0m_RpfT3.js";import"./useEventCallback-guZE-voT.js";import"./mergeSlotProps-NJnF42jJ.js";import"./isHostComponent-DVu5iVWx.js";import"./useTheme-CMzaj5Wq.js";import"./styled-CVDphjR5.js";import"./memoTheme-DuK-uO2q.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./useSlot-da_fafqN.js";import"./useForkRef-BlrSiLQa.js";import"./getReactElementRef-DmRxRqpB.js";import"./ownerDocument-DW-IO8s5.js";import"./contains-B5PScIlI.js";import"./Paper-CMrUORMw.js";import"./Grow-ChS_8--H.js";import"./utils-D7EB2s5D.js";import"./index-D45m0UCw.js";import"./index-BrMYl9zD.js";const E={title:"UI-Kit/Toast",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"The `Toast` component is a standalone visual component wrapping Mantine's `Notification`. Note that this component is visually decoupled from `@mantine/notifications` and is meant to be used when you need to render a static or manually-controlled notification panel. If you need dynamic notification popups, you should use `@mantine/notifications` and configure its provider to use our styles."}}},argTypes:{title:{control:"text",description:"Title displayed above the message body"},children:{control:"text",description:"Main notification message"},withCloseButton:{control:"boolean",description:"Whether the close button is visible"}}},t={args:{variant:"default",title:"Update Available",children:"A new version of the application is available to download. Please restart your browser to apply the latest security patches and feature updates. If you ignore this message, the update will automatically install during your next session.",withCloseButton:!0},render:({withLayer:c,layer:d,...o})=>u.jsx(r,{...o})},e={args:{variant:"default",title:"Action Required",children:"You must complete your profile setup before accessing this feature.",icon:"⚠️"},parameters:{controls:{disable:!0}},render:({withLayer:c,layer:d,...o})=>u.jsx(r,{...o})};var a,n,i;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
}`,...(i=(n=t.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};var s,l,p;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
}`,...(p=(l=e.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};const M=["Default","WithIcon"];export{t as Default,e as WithIcon,M as __namedExportsOrder,E as default};
