import{j as e}from"./iframe-B9jVSv9g.js";import{H as r}from"./HoverCard-J37dam6o.js";import{B as i}from"./Button-Co6R1U8P.js";import{T as s}from"./Text-Cm9DE_WK.js";import{G as y}from"./Group-ks873wV3.js";import{S as x}from"./Stack-BDqNDm8x.js";import{A as C}from"./Avatar-CnhqyNG7.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-qt3TIjIQ.js";import"./Popover-CqVC4VOh.js";import"./OptionalPortal-CPFosO0n.js";import"./is-element-CH1PuH6d.js";import"./index-526MuFmh.js";import"./index-Car0LSP-.js";import"./use-merged-ref-BJZa-iuk.js";import"./get-size-CZBO4470.js";import"./use-resolved-styles-api-JZ97n6Gy.js";import"./DirectionProvider-Ckfhos9Y.js";import"./get-floating-position-CKejdt3q.js";import"./FocusTrap-nYevfDlu.js";import"./use-reduced-motion-DONktsbQ.js";import"./polymorphic-factory-BaiPjVv6.js";import"./Transition-CmXN8cps.js";import"./create-safe-context-DJT8nTuL.js";import"./use-uncontrolled-9g2CYtsY.js";import"./use-id-Bmpd73cC.js";import"./create-event-handler-C3eq9ghx.js";import"./Loader-Cmrjy8eV.js";import"./UnstyledButton-C0D8UK82.js";import"./Text-Cj3_EhXd.js";import"./Group-DBr2-UOY.js";const $={title:"UI-Kit/HoverCard",component:r,tags:["autodocs"],argTypes:{position:{control:"select",options:["bottom","bottom-start","bottom-end","top","top-start","top-end","left","left-start","left-end","right","right-start","right-end"],description:"The position of the dropdown relative to the target."},withBeak:{control:"boolean",description:"Whether to display a beak (arrow) pointing to the target. Recursica equivalent of Mantine's withArrow."},offset:{control:"number",description:"Distance in px between the dropdown and the target element."},openDelay:{control:"number",description:"Delay in ms before the dropdown opens on hover."},closeDelay:{control:"number",description:"Delay in ms before the dropdown closes when hover ends."},disabled:{control:"boolean",description:"If set, the hover card dropdown will not be rendered."}},parameters:{layout:"centered",docs:{description:{component:"\nThe `HoverCard` component displays a popover-style dropdown when the user hovers over a target element. It wraps Mantine's composable `HoverCard` while enforcing strict Recursica design token styling.\n\n### Composable API\n\nHoverCard uses a dot-notation composition pattern:\n- `<HoverCard>` — Root container managing open/close state on hover\n- `<HoverCard.Target>` — Wrapper for the trigger element (must be a single element supporting ref)\n- `<HoverCard.Dropdown>` — The popup panel displaying content on hover\n\n### Key Behaviors\n- The dropdown opens when the user hovers over the target and closes when they move away\n- `openDelay` and `closeDelay` control the timing of open/close transitions\n- The dropdown stays open while the user hovers over it, allowing interaction with its content\n        "}}}},t={args:{position:"top",withBeak:!0,offset:5,openDelay:0,closeDelay:150},render:({withLayer:d,layer:p,...o})=>e.jsxs(r,{...o,children:[e.jsx(r.Target,{children:e.jsx(i,{variant:"solid",children:"Hover me"})}),e.jsx(r.Dropdown,{children:e.jsx(s,{children:"This is a hover card with informational content that appears when you hover over the target element."})})]})},n={args:{position:"top",withBeak:!1,offset:5},render:({withLayer:d,layer:p,...o})=>e.jsxs(r,{...o,children:[e.jsx(r.Target,{children:e.jsx(i,{variant:"outline",children:"Without Beak"})}),e.jsx(r.Dropdown,{children:e.jsx(s,{children:"This hover card has the beak disabled, showing a clean dropdown without the pointing indicator."})})]})},a={args:{position:"top",offset:5},render:({withLayer:d,layer:p,...o})=>e.jsxs(r,{...o,children:[e.jsx(r.Target,{children:e.jsx(i,{variant:"solid",children:"User Profile"})}),e.jsx(r.Dropdown,{children:e.jsxs(y,{children:[e.jsx(C,{src:null,alt:"User avatar"}),e.jsxs(x,{children:[e.jsx(s,{children:"Jane Doe"}),e.jsx(s,{children:"Software Engineer at Recursica"})]})]})})]})};var l,c,h;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    position: "top",
    withBeak: true,
    offset: 5,
    openDelay: 0,
    closeDelay: 150
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: HoverCardStoryArgs) => {
    return <HoverCard {...args}>
        <HoverCard.Target>
          <Button variant="solid">Hover me</Button>
        </HoverCard.Target>

        <HoverCard.Dropdown>
          <Text>
            This is a hover card with informational content that appears when
            you hover over the target element.
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>;
  }
}`,...(h=(c=t.parameters)==null?void 0:c.docs)==null?void 0:h.source}}};var m,v,u;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    position: "top",
    withBeak: false,
    offset: 5
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: HoverCardStoryArgs) => {
    return <HoverCard {...args}>
        <HoverCard.Target>
          <Button variant="outline">Without Beak</Button>
        </HoverCard.Target>

        <HoverCard.Dropdown>
          <Text>
            This hover card has the beak disabled, showing a clean dropdown
            without the pointing indicator.
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>;
  }
}`,...(u=(v=n.parameters)==null?void 0:v.docs)==null?void 0:u.source}}};var g,w,f;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    position: "top",
    offset: 5
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: HoverCardStoryArgs) => {
    return <HoverCard {...args}>
        <HoverCard.Target>
          <Button variant="solid">User Profile</Button>
        </HoverCard.Target>

        <HoverCard.Dropdown>
          <Group>
            <Avatar src={null} alt="User avatar" />
            <Stack>
              <Text>Jane Doe</Text>
              <Text>Software Engineer at Recursica</Text>
            </Stack>
          </Group>
        </HoverCard.Dropdown>
      </HoverCard>;
  }
}`,...(f=(w=a.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};const ee=["Default","WithoutBeak","RichContent"];export{t as Default,a as RichContent,n as WithoutBeak,ee as __namedExportsOrder,$ as default};
