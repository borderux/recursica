import{j as t}from"./iframe-DahVp6_-.js";import{T as r}from"./Tooltip-DwVM2pKI.js";import{B as s}from"./Button-BMJ1S8_G.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-D_NNwu8P.js";import"./OptionalPortal--mXzeJ94.js";import"./is-element-BmP6DfN4.js";import"./index-B841QEH0.js";import"./index-BNvs_OV3.js";import"./use-merged-ref-u8HO_v_P.js";import"./get-size-aDX96fpj.js";import"./get-floating-position-B3u6DCdV.js";import"./DirectionProvider-CrZlQkVf.js";import"./Transition-BGYkaghW.js";import"./use-reduced-motion-BKregIUg.js";import"./get-style-object-DUJZA7T_.js";import"./use-id-CxPB4dVW.js";import"./Loader-C7A4UnCQ.js";import"./Loader-DvCGEUJR.js";import"./polymorphic-factory-CoDbakTI.js";import"./UnstyledButton-CdpaQdNN.js";const G={title:"UI-Kit/Tooltip",component:r,tags:["autodocs"],argTypes:{label:{control:"text",description:"Content displayed inside the tooltip."},position:{control:"select",options:["bottom","bottom-start","bottom-end","top","top-start","top-end","left","left-start","left-end","right","right-start","right-end"],description:"The position of the tooltip relative to the target."},withBeak:{control:"boolean",description:"Whether to display a beak (arrow) pointing to the target. Recursica equivalent of Mantine's withArrow."},offset:{control:"number",description:"Distance in px between the tooltip and the target element."},openDelay:{control:"number",description:"Delay in ms before the tooltip opens on hover."},closeDelay:{control:"number",description:"Delay in ms before the tooltip closes when hover ends."},disabled:{control:"boolean",description:"If set, the tooltip will not be rendered."},opened:{control:"boolean",description:"Force the tooltip to stay open. Useful for inspecting styling."},defaultChecked:{table:{disable:!0}},defaultValue:{table:{disable:!0}},suppressContentEditableWarning:{table:{disable:!0}},suppressHydrationWarning:{table:{disable:!0}}},parameters:{layout:"centered",docs:{description:{component:'\nThe `Tooltip` component displays a floating label when the user hovers over or focuses a target element. It wraps Mantine\'s `Tooltip` while enforcing strict Recursica design token styling.\n\n### API\n\nUnlike `HoverCard`, Tooltip is a single component — content is passed via the `label` prop:\n```tsx\n<Tooltip label="Helpful text" withBeak>\n  <Button>Hover me</Button>\n</Tooltip>\n```\n\n### Static Sub-Components\n- `Tooltip.Floating` — A tooltip that follows the cursor position\n- `Tooltip.Group` — Groups multiple tooltips to share hover delay\n\n### Key Behaviors\n- The beak (arrow) is shown by default (`withBeak={true}`)\n- Supports `openDelay` and `closeDelay` for timing control\n- Set `multiline` to allow text wrapping within max-width\n        '}}}},o={args:{label:"This is a helpful tooltip",position:"top",withBeak:!0,offset:5,openDelay:0,closeDelay:0,disabled:!1},render:({withLayer:a,layer:l,...e})=>t.jsx(r,{...e,children:t.jsx(s,{variant:"solid",children:"Hover me"})})},n={args:{label:"Tooltip without a beak indicator",position:"top",withBeak:!1,offset:5},render:({withLayer:a,layer:l,...e})=>t.jsx(r,{...e,children:t.jsx(s,{variant:"outline",children:"Without Beak"})})},i={args:{label:"This is a longer tooltip message that demonstrates how text wraps within the maximum width defined by the design system.",position:"top",withBeak:!0,opened:!0,offset:5},render:({withLayer:a,layer:l,...e})=>t.jsx(r,{...e,children:t.jsx(s,{variant:"solid",children:"Long Content"})})};var p,d,u;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    label: "This is a helpful tooltip",
    position: "top",
    withBeak: true,
    offset: 5,
    openDelay: 0,
    closeDelay: 0,
    disabled: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: TooltipStoryArgs) => {
    return <Tooltip {...args as TooltipProps}>
        <Button variant="solid">Hover me</Button>
      </Tooltip>;
  }
}`,...(u=(d=o.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var h,c,m;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "Tooltip without a beak indicator",
    position: "top",
    withBeak: false,
    offset: 5
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: TooltipStoryArgs) => {
    return <Tooltip {...args as TooltipProps}>
        <Button variant="outline">Without Beak</Button>
      </Tooltip>;
  }
}`,...(m=(c=n.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var g,f,b;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    label: "This is a longer tooltip message that demonstrates how text wraps within the maximum width defined by the design system.",
    position: "top",
    withBeak: true,
    opened: true,
    offset: 5
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: TooltipStoryArgs) => {
    return <Tooltip {...args as TooltipProps}>
        <Button variant="solid">Long Content</Button>
      </Tooltip>;
  }
}`,...(b=(f=i.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};const K=["Default","WithoutBeak","LongContent"];export{o as Default,i as LongContent,n as WithoutBeak,K as __namedExportsOrder,G as default};
