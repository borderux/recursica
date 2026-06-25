import{j as c}from"./iframe-C3SWO55l.js";import{T as n}from"./Toast-B6eWnBDr.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-Ducn9enw.js";import"./factory-Dz1TPLtm.js";import"./CloseButton-CjdKMo9a.js";import"./polymorphic-factory-1ktCJnHi.js";import"./UnstyledButton-DAw-L8mm.js";import"./Loader-DM9HjMTw.js";const T={title:"UI-Kit/Toast",component:n,tags:["autodocs"],parameters:{docs:{description:{component:"The `Toast` component is a standalone visual component wrapping Mantine's `Notification`. Note that this component is visually decoupled from `@mantine/notifications` and is meant to be used when you need to render a static or manually-controlled notification panel. If you need dynamic notification popups, you should use `@mantine/notifications` and configure its provider to use our styles."}}},argTypes:{title:{control:"text",description:"Title displayed above the message body"},children:{control:"text",description:"Main notification message"},withCloseButton:{control:"boolean",description:"Whether the close button is visible"}}},e={args:{variant:"default",title:"Update Available",children:"A new version of the application is available to download. Please restart your browser to apply the latest security patches and feature updates. If you ignore this message, the update will automatically install during your next session.",withCloseButton:!0},render:({withLayer:p,layer:d,...a})=>c.jsx(n,{...a})},t={args:{variant:"default",title:"Action Required",children:"You must complete your profile setup before accessing this feature.",icon:"⚠️"},parameters:{controls:{disable:!0}},render:({withLayer:p,layer:d,...a})=>c.jsx(n,{...a})};var o,r,s;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
}`,...(s=(r=e.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};var i,l,u;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(u=(l=t.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};const A=["Default","WithIcon"];export{e as Default,t as WithIcon,A as __namedExportsOrder,T as default};
