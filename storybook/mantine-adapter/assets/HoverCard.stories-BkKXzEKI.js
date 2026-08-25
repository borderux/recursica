import{j as e}from"./iframe-q_g-lagv.js";import{H as r}from"./HoverCard-Dogx4W_-.js";import{B as s}from"./Button-B1QxIpr6.js";import{T as i}from"./Text-C5E6opMc.js";import{G as y}from"./Group-aFEl3bd1.js";import{S as x}from"./Stack-DKiDJL5y.js";import{A as C}from"./Avatar-DrXsWvYq.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-CHICaA9J.js";import"./Popover-ZLfR0XRJ.js";import"./OptionalPortal-CV2JkxjO.js";import"./is-element-CJjw3CBA.js";import"./index-CKC3laIl.js";import"./index-DFI-f6hd.js";import"./use-merged-ref-BLLg8Jj4.js";import"./get-size-Sn4lhVq-.js";import"./use-resolved-styles-api-BkcUVl7d.js";import"./DirectionProvider-D2IHzrto.js";import"./get-floating-position-DsFZiVRn.js";import"./FocusTrap-CNcPJa5Q.js";import"./use-reduced-motion-CpxCSsIX.js";import"./polymorphic-factory-DwIfLF0y.js";import"./Transition-JQTtmUOG.js";import"./create-safe-context-BjPefawz.js";import"./floating-ui.react-zaQCCjO7.js";import"./use-uncontrolled-DKRvRs0n.js";import"./use-id-C9TR6T4C.js";import"./use-click-outside-DJcSAJwu.js";import"./create-event-handler-C3eq9ghx.js";import"./Loader-B66im5kF.js";import"./Loader-CqmKbCrD.js";import"./UnstyledButton-BA6vmwI6.js";import"./Text-tK8pzW7j.js";import"./Group-Dg78wRFK.js";const oe={title:"UI-Kit/HoverCard",component:r,tags:["autodocs"],argTypes:{position:{control:"select",options:["bottom","bottom-start","bottom-end","top","top-start","top-end","left","left-start","left-end","right","right-start","right-end"],description:"The position of the dropdown relative to the target."},withBeak:{control:"boolean",description:"Whether to display a beak (arrow) pointing to the target. Recursica equivalent of Mantine's withArrow."},offset:{control:"number",description:"Distance in px between the dropdown and the target element."},openDelay:{control:"number",description:"Delay in ms before the dropdown opens on hover."},closeDelay:{control:"number",description:"Delay in ms before the dropdown closes when hover ends."},disabled:{control:"boolean",description:"If set, the hover card dropdown will not be rendered."}},parameters:{layout:"centered",docs:{description:{component:"\nThe `HoverCard` component displays a popover-style dropdown when the user hovers over a target element. It wraps Mantine's composable `HoverCard` while enforcing strict Recursica design token styling.\n\n### Composable API\n\nHoverCard uses a dot-notation composition pattern:\n- `<HoverCard>` — Root container managing open/close state on hover\n- `<HoverCard.Target>` — Wrapper for the trigger element (must be a single element supporting ref)\n- `<HoverCard.Dropdown>` — The popup panel displaying content on hover\n\n### Key Behaviors\n- The dropdown opens when the user hovers over the target and closes when they move away\n- `openDelay` and `closeDelay` control the timing of open/close transitions\n- The dropdown stays open while the user hovers over it, allowing interaction with its content\n        "}}}},t={args:{position:"top",withBeak:!0,offset:5,openDelay:0,closeDelay:150},render:({withLayer:d,layer:p,...o})=>e.jsxs(r,{...o,children:[e.jsx(r.Target,{children:e.jsx(s,{variant:"solid",children:"Hover me"})}),e.jsx(r.Dropdown,{children:e.jsx(i,{children:"This is a hover card with informational content that appears when you hover over the target element."})})]})},n={args:{position:"top",withBeak:!1,offset:5},render:({withLayer:d,layer:p,...o})=>e.jsxs(r,{...o,children:[e.jsx(r.Target,{children:e.jsx(s,{variant:"outline",children:"Without Beak"})}),e.jsx(r.Dropdown,{children:e.jsx(i,{children:"This hover card has the beak disabled, showing a clean dropdown without the pointing indicator."})})]})},a={args:{position:"top",offset:5},render:({withLayer:d,layer:p,...o})=>e.jsxs(r,{...o,children:[e.jsx(r.Target,{children:e.jsx(s,{variant:"solid",children:"User Profile"})}),e.jsx(r.Dropdown,{children:e.jsxs(y,{children:[e.jsx(C,{src:null,alt:"User avatar"}),e.jsxs(x,{children:[e.jsx(i,{children:"Jane Doe"}),e.jsx(i,{children:"Software Engineer at Recursica"})]})]})})]})};var l,c,h;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(f=(w=a.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};const te=["Default","WithoutBeak","RichContent"];export{t as Default,a as RichContent,n as WithoutBeak,te as __namedExportsOrder,oe as default};
