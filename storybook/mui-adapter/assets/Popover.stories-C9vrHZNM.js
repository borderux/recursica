import{j as e}from"./iframe-wfJiKc8C.js";import{P as t}from"./Popover-Bw1VV6i5.js";import{B as i}from"./Button-BX3zeU7H.js";import{T as s}from"./Text-BKm1KGp1.js";import"./preload-helper-Dp1pzeXC.js";import"./Tooltip-DgrmtwZH.js";import"./useTheme-BiDiCxJp.js";import"./memoTheme-iVEvjh8n.js";import"./useSlot-knGKi0PF.js";import"./mergeSlotProps-BTmfZoz3.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-DibPUPK5.js";import"./useTimeout-BM-ogh58.js";import"./useControlled-CXSN1Hj0.js";import"./useEventCallback-CHP4WYYC.js";import"./Portal-BpZ_aCk4.js";import"./index-DtifbQAO.js";import"./index-C23pUOkb.js";import"./Grow-DxqWXsct.js";import"./utils-CEWKcq0X.js";import"./Popper-BBzBCNb8.js";import"./ownerDocument-DW-IO8s5.js";import"./useSlotProps-DedG3jUX.js";import"./isFocusVisible-B8k4qzLc.js";import"./Loader-BM4__DSu.js";import"./Button-jSPbgPfa.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-Dj6rRb9P.js";import"./CircularProgress-DxN5TrBK.js";import"./Typography-C2vuKXfB.js";import"./Typography-CDtn7TZW.js";const X={title:"UI-Kit/Popover",component:t,tags:["autodocs"],parameters:{controls:{include:["withBeak","position","defaultOpened"]},docs:{description:{component:"The `Popover` component is a composable wrapper around Mui's Tooltip in click-controlled mode. It displays a dropdown panel when the user clicks a target element."}}},argTypes:{withBeak:{control:"boolean",description:"Whether to display a beak (arrow) pointing from the dropdown to the target."},position:{control:"select",options:["top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"],description:"Dropdown position relative to target"},defaultOpened:{control:"boolean",description:"Initial opened state"}}},r={args:{withBeak:!0,position:"top"},render:({withLayer:p,layer:d,...o})=>e.jsxs(t,{width:250,...o,children:[e.jsx(t.Target,{children:e.jsx(i,{variant:"solid",children:"Toggle Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{children:"This is the popover content. It can contain any elements you want to display when the user clicks the target."})})]})},n={args:{withBeak:!0,position:"top",defaultOpened:!0},parameters:{layout:"centered",controls:{disable:!0}},render:({withLayer:p,layer:d,...o})=>e.jsxs(t,{width:200,...o,children:[e.jsx(t.Target,{children:e.jsx(i,{variant:"solid",children:"Toggle Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{children:"This is a static representation of an opened popover with a beak."})})]})},a={args:{withBeak:!1,position:"bottom",defaultOpened:!0},parameters:{layout:"centered",controls:{disable:!0}},render:({withLayer:p,layer:d,...o})=>e.jsxs(t,{width:200,...o,children:[e.jsx(t.Target,{children:e.jsx(i,{variant:"outline",children:"Bottom Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{children:"This popover is positioned at the bottom and has no beak."})})]})};var l,c,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(y=(w=a.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};const Y=["Default","SolidDefault","WithoutBeak"];export{r as Default,n as SolidDefault,a as WithoutBeak,Y as __namedExportsOrder,X as default};
