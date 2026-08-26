import{j as e}from"./iframe-kI3tYt3h.js";import{P as t}from"./Popover-BO7_VaV-.js";import{B as i}from"./Button-DG5lYdq7.js";import{T as s}from"./Text-oQg2Sae4.js";import"./preload-helper-Dp1pzeXC.js";import"./Tooltip-BGbiljhk.js";import"./useTheme-BdD5xnsz.js";import"./memoTheme-vnNaqsCY.js";import"./useSlot-D-eqD156.js";import"./mergeSlotProps-BmeWBuK6.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-Bad-M5H5.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./useTimeout-DVIYpBIx.js";import"./useControlled-Btadw_Em.js";import"./useEventCallback-CERP1gBm.js";import"./Portal-XVFQAWTB.js";import"./index-CwOocEAv.js";import"./index-C0n0fDq-.js";import"./Grow-Soj-vPNE.js";import"./utils-CbgM1coP.js";import"./Popper-B1ysR2d_.js";import"./ownerDocument-DW-IO8s5.js";import"./useSlotProps-B_AM1lOD.js";import"./isFocusVisible-B8k4qzLc.js";import"./Loader-CTZt_gyy.js";import"./Button-D9t45PsQ.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-CuoLXK1M.js";import"./CircularProgress-DxkR0HpY.js";import"./Typography-CHmlMyx-.js";import"./Typography-DPpL5zmy.js";const Y={title:"UI-Kit/Popover",component:t,tags:["autodocs"],parameters:{controls:{include:["withBeak","position","defaultOpened"]},docs:{description:{component:"The `Popover` component is a composable wrapper around Mui's Tooltip in click-controlled mode. It displays a dropdown panel when the user clicks a target element."}}},argTypes:{withBeak:{control:"boolean",description:"Whether to display a beak (arrow) pointing from the dropdown to the target."},position:{control:"select",options:["top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"],description:"Dropdown position relative to target"},defaultOpened:{control:"boolean",description:"Initial opened state"}}},r={args:{withBeak:!0,position:"top"},render:({withLayer:p,layer:d,...o})=>e.jsxs(t,{width:250,...o,children:[e.jsx(t.Target,{children:e.jsx(i,{variant:"solid",children:"Toggle Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{children:"This is the popover content. It can contain any elements you want to display when the user clicks the target."})})]})},n={args:{withBeak:!0,position:"top",defaultOpened:!0},parameters:{layout:"centered",controls:{disable:!0}},render:({withLayer:p,layer:d,...o})=>e.jsxs(t,{width:200,...o,children:[e.jsx(t.Target,{children:e.jsx(i,{variant:"solid",children:"Toggle Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{children:"This is a static representation of an opened popover with a beak."})})]})},a={args:{withBeak:!1,position:"bottom",defaultOpened:!0},parameters:{layout:"centered",controls:{disable:!0}},render:({withLayer:p,layer:d,...o})=>e.jsxs(t,{width:200,...o,children:[e.jsx(t.Target,{children:e.jsx(i,{variant:"outline",children:"Bottom Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{children:"This popover is positioned at the bottom and has no beak."})})]})};var l,c,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
