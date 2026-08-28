import{j as e}from"./iframe-DwzbXXsg.js";import{P as t}from"./Popover-2bzv18_S.js";import{B as i}from"./Button-D4jdlrvH.js";import{T as s}from"./Text-CmhWL1jq.js";import"./preload-helper-Dp1pzeXC.js";import"./Tooltip-B0wWJuBr.js";import"./useTheme-DrRptafz.js";import"./memoTheme-VNhdAq_e.js";import"./useSlot-D3WXn4hk.js";import"./mergeSlotProps-ESQ19004.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-DIGfaA-o.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./useTimeout-0OGhdP7n.js";import"./useControlled-XPFNiyC5.js";import"./useEventCallback-C68EW9dQ.js";import"./Portal-CHpWCbzb.js";import"./index-C4Fq4A0a.js";import"./index-Cf_VtCzm.js";import"./Grow-qyT4Yn0A.js";import"./utils-S4pfVl09.js";import"./Popper-i44x9jFl.js";import"./ownerDocument-DW-IO8s5.js";import"./useSlotProps-vXS8yeF7.js";import"./isFocusVisible-B8k4qzLc.js";import"./Loader-VTbS13sV.js";import"./Button-C6iL5kXX.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-DrWn9hz0.js";import"./CircularProgress-e0q3-4EL.js";import"./Typography-Bb0626f-.js";import"./Typography-B92I6Oqd.js";const Y={title:"UI-Kit/Popover",component:t,tags:["autodocs"],parameters:{controls:{include:["withBeak","position","defaultOpened"]},docs:{description:{component:"The `Popover` component is a composable wrapper around Mui's Tooltip in click-controlled mode. It displays a dropdown panel when the user clicks a target element."}}},argTypes:{withBeak:{control:"boolean",description:"Whether to display a beak (arrow) pointing from the dropdown to the target."},position:{control:"select",options:["top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"],description:"Dropdown position relative to target"},defaultOpened:{control:"boolean",description:"Initial opened state"}}},r={args:{withBeak:!0,position:"top"},render:({withLayer:p,layer:d,...o})=>e.jsxs(t,{width:250,...o,children:[e.jsx(t.Target,{children:e.jsx(i,{variant:"solid",children:"Toggle Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{children:"This is the popover content. It can contain any elements you want to display when the user clicks the target."})})]})},n={args:{withBeak:!0,position:"top",defaultOpened:!0},parameters:{layout:"centered",controls:{disable:!0}},render:({withLayer:p,layer:d,...o})=>e.jsxs(t,{width:200,...o,children:[e.jsx(t.Target,{children:e.jsx(i,{variant:"solid",children:"Toggle Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{children:"This is a static representation of an opened popover with a beak."})})]})},a={args:{withBeak:!1,position:"bottom",defaultOpened:!0},parameters:{layout:"centered",controls:{disable:!0}},render:({withLayer:p,layer:d,...o})=>e.jsxs(t,{width:200,...o,children:[e.jsx(t.Target,{children:e.jsx(i,{variant:"outline",children:"Bottom Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{children:"This popover is positioned at the bottom and has no beak."})})]})};var l,c,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    withBeak: true,
    position: "top"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PopoverStoryArgs) => {
    return <Popover width={250} {...args}>
        <Popover.Target>
          <Button variant="solid">Toggle Popover</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text>
            This is the popover content. It can contain any elements you want to
            display when the user clicks the target.
          </Text>
        </Popover.Dropdown>
      </Popover>;
  }
}`,...(m=(c=r.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var u,h,g;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    withBeak: true,
    position: "top",
    defaultOpened: true
  },
  parameters: {
    layout: "centered",
    controls: {
      disable: true
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PopoverStoryArgs) => {
    return <Popover width={200} {...args}>
        <Popover.Target>
          <Button variant="solid">Toggle Popover</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text>
            This is a static representation of an opened popover with a beak.
          </Text>
        </Popover.Dropdown>
      </Popover>;
  }
}`,...(g=(h=n.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var v,w,y;a.parameters={...a.parameters,docs:{...(v=a.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    withBeak: false,
    position: "bottom",
    defaultOpened: true
  },
  parameters: {
    layout: "centered",
    controls: {
      disable: true
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PopoverStoryArgs) => {
    return <Popover width={200} {...args}>
        <Popover.Target>
          <Button variant="outline">Bottom Popover</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text>This popover is positioned at the bottom and has no beak.</Text>
        </Popover.Dropdown>
      </Popover>;
  }
}`,...(y=(w=a.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};const Z=["Default","SolidDefault","WithoutBeak"];export{r as Default,n as SolidDefault,a as WithoutBeak,Z as __namedExportsOrder,Y as default};
