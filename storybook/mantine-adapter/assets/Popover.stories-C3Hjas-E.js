import{j as e}from"./iframe-ui3vHneJ.js";import{P as t}from"./Popover-D3HjIcCy.js";import{B as a}from"./Button-DhHDXJtZ.js";import{T as s}from"./Text-CE9kJIe7.js";import{S as y}from"./Stack-Byhh4Gmj.js";import"./preload-helper-Dp1pzeXC.js";import"./Popover-BdRdQad6.js";import"./OptionalPortal-BV3Ps08z.js";import"./is-element-DFX_OVHe.js";import"./factory-Bm8Z26Jt.js";import"./index-D8T0xS7x.js";import"./index-DrSfN2HQ.js";import"./use-merged-ref-DzAJhlw3.js";import"./get-size-C3KF_bQQ.js";import"./use-resolved-styles-api-CrZ-XoZn.js";import"./DirectionProvider-CvtOTCV8.js";import"./get-floating-position-BbgKbtBB.js";import"./FocusTrap-DAVl_9Lp.js";import"./use-reduced-motion-bxGOEpJk.js";import"./polymorphic-factory-BPOocaz7.js";import"./Transition-CtA3YDge.js";import"./create-safe-context-BRQ5OSXb.js";import"./floating-ui.react-BcXehHo9.js";import"./use-uncontrolled-y4V07OfJ.js";import"./use-id-Cj4dGt-w.js";import"./use-click-outside-DUaKoWMk.js";import"./Loader-V6CCm0QL.js";import"./Loader-CEqmCV_M.js";import"./UnstyledButton-DFZm1ayP.js";import"./Text-BJRU9r0k.js";const X={title:"UI-Kit/Popover",component:t,tags:["autodocs"],parameters:{docs:{description:{component:"The `Popover` component is a composable wrapper around Mantine's Popover. It displays a dropdown panel when the user clicks or interacts with a target element."}}},argTypes:{withBeak:{control:"boolean",description:"Whether to display a beak (arrow) pointing from the dropdown to the target."},position:{control:"select",options:["top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"],description:"Dropdown position relative to target"},defaultOpened:{control:"boolean",description:"Initial opened state"}}},r={args:{withBeak:!0,position:"top"},render:({withLayer:p,layer:d,...o})=>e.jsxs(t,{width:250,...o,children:[e.jsx(t.Target,{children:e.jsx(a,{variant:"solid",children:"Toggle Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{size:"rec-sm",children:"This is the popover content. It can contain any elements you want to display when the user clicks the target."})})]})},n={args:{withBeak:!0,position:"top",defaultOpened:!0},parameters:{controls:{disable:!0}},render:({withLayer:p,layer:d,...o})=>e.jsx(y,{align:"center",justify:"center",style:{padding:"100px"},children:e.jsxs(t,{width:200,...o,children:[e.jsx(t.Target,{children:e.jsx(a,{variant:"solid",children:"Toggle Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{size:"rec-sm",children:"This is a static representation of an opened popover with a beak."})})]})})},i={args:{withBeak:!1,position:"bottom",defaultOpened:!0},parameters:{controls:{disable:!0}},render:({withLayer:p,layer:d,...o})=>e.jsx(y,{align:"center",justify:"center",style:{padding:"100px"},children:e.jsxs(t,{width:200,...o,children:[e.jsx(t.Target,{children:e.jsx(a,{variant:"outline",children:"Bottom Popover"})}),e.jsx(t.Dropdown,{children:e.jsx(s,{size:"rec-sm",children:"This popover is positioned at the bottom and has no beak."})})]})})};var l,c,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
          <Text size="rec-sm">
            This is the popover content. It can contain any elements you want to
            display when the user clicks the target.
          </Text>
        </Popover.Dropdown>
      </Popover>;
  }
}`,...(m=(c=r.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var h,u,g;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    withBeak: true,
    position: "top",
    defaultOpened: true
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
  }: PopoverStoryArgs) => {
    return <Stack align="center" justify="center" style={{
      padding: "100px"
    }}>
        <Popover width={200} {...args}>
          <Popover.Target>
            <Button variant="solid">Toggle Popover</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="rec-sm">
              This is a static representation of an opened popover with a beak.
            </Text>
          </Popover.Dropdown>
        </Popover>
      </Stack>;
  }
}`,...(g=(u=n.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var v,w,x;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    withBeak: false,
    position: "bottom",
    defaultOpened: true
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
  }: PopoverStoryArgs) => {
    return <Stack align="center" justify="center" style={{
      padding: "100px"
    }}>
        <Popover width={200} {...args}>
          <Popover.Target>
            <Button variant="outline">Bottom Popover</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="rec-sm">
              This popover is positioned at the bottom and has no beak.
            </Text>
          </Popover.Dropdown>
        </Popover>
      </Stack>;
  }
}`,...(x=(w=i.parameters)==null?void 0:w.docs)==null?void 0:x.source}}};const Y=["Default","SolidDefault","WithoutBeak"];export{r as Default,n as SolidDefault,i as WithoutBeak,Y as __namedExportsOrder,X as default};
