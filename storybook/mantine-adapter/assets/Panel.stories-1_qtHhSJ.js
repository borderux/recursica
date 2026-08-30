import{r as u,j as e}from"./iframe-Hqhg3Da1.js";import{P as r}from"./Panel-BchpNgNR.js";import{B as n}from"./Button-mHh2WNZ7.js";import{T as h}from"./Text-Df8gfVCG.js";import"./preload-helper-Dp1pzeXC.js";import"./OptionalPortal-DtbOE-8d.js";import"./is-element-DYrWi5C8.js";import"./factory-BczmY60U.js";import"./index-CYRVDetO.js";import"./index-OF9b6z9m.js";import"./use-merged-ref-K9nI3EES.js";import"./NativeScrollArea-nIguPg6n.js";import"./get-size-CFz4_vy9.js";import"./use-reduced-motion-DOQvRuob.js";import"./use-id-Dvb_GrVM.js";import"./FocusTrap-B34lFG2z.js";import"./polymorphic-factory-CnqVX0h6.js";import"./CloseButton-CDF38zpp.js";import"./UnstyledButton-Dr1Tl6DG.js";import"./Paper-Cl4eTp9P.js";import"./Transition-WrigpDHF.js";import"./create-safe-context-CjB3hAWP.js";import"./DirectionProvider-C_Pg0eJM.js";import"./ScrollArea-BWeP5WX1.js";import"./floating-ui.react-cF-p8au5.js";import"./to-int-PQE0s6ay.js";import"./create-optional-context-BYEbgx4h.js";import"./Loader-Dt1m2IJh.js";import"./Loader-0CPHMGXy.js";import"./Text-DUXr-bGA.js";const re={title:"UI-Kit/Panel",component:r,tags:["autodocs"],argTypes:{placement:{control:"select",options:["left","right","top","bottom"],description:"Side of the screen the panel slides in from."},title:{control:"text",description:"Panel title displayed in the header."},withOverlay:{control:"boolean",description:"Whether to display a background overlay."},withCloseButton:{control:"boolean",description:"Whether to display the close button in the header."},wrapHeaderText:{control:"boolean",description:"If true, forces the header text to a single line and truncates with an ellipsis."},defaultChecked:{table:{disable:!0}},defaultValue:{table:{disable:!0}},suppressContentEditableWarning:{table:{disable:!0}},suppressHydrationWarning:{table:{disable:!0}}},parameters:{layout:"fullscreen",docs:{description:{component:`
The \`Panel\` component slides in or expands from the edge of the screen to reveal additional content or functionality. Built on Mantine's \`Drawer\`, it enforces Recursica design tokens for styling.

### Anatomy
1. **Header** — Title and close icon, remains fixed on scroll
2. **Divider** — Separates header/footer from content
3. **Body (Slot)** — Scrollable content area for custom content
4. **Footer** — Fixed action buttons (Recursica-specific)

### Usage
\`\`\`tsx
const [opened, { open, close }] = useDisclosure(false);

<Button onClick={open}>Open Panel</Button>
<Panel opened={opened} onClose={close} title="Settings" placement="right">
  Content goes here
  <Panel.Footer>
    <Button variant="outline">Cancel</Button>
    <Button variant="solid">Save</Button>
  </Panel.Footer>
</Panel>
\`\`\`
        `}}}},i={args:{placement:"right",title:"Panel Title",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({wrapHeaderText:s,...l})=>{const[t,o]=u.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"solid",onClick:()=>o(!0),children:"Open Panel"}),e.jsxs(r,{...l,opened:t,onClose:()=>o(!1),title:"Panel Title",placement:"right",wrapHeaderText:s,children:[e.jsx(h,{children:"This is the panel body content area. Panels slide in from the edge of the screen to reveal supplementary information, navigation options, or toolsets."}),e.jsxs(r.Footer,{children:[e.jsx(n,{variant:"outline",onClick:()=>o(!1),children:"Cancel"}),e.jsx(n,{variant:"solid",children:"Save"})]})]})]})}},d={args:{placement:"left",title:"Navigation",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({withLayer:s,layer:l,...t})=>{const[o,a]=u.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"outline",onClick:()=>a(!0),children:"Open Left Panel"}),e.jsx(r,{...t,opened:o,onClose:()=>a(!1),children:e.jsx(h,{children:"A panel sliding in from the left, commonly used for navigation menus or sidebars."})})]})}},p={args:{placement:"right",title:"Scrollable Panel",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({withLayer:s,layer:l,...t})=>{const[o,a]=u.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"solid",onClick:()=>a(!0),children:"Open Scrollable Panel"}),e.jsxs(r,{...t,opened:o,onClose:()=>a(!1),children:[Array.from({length:20}).map((S,m)=>e.jsxs("p",{style:{marginBottom:"1rem"},children:["Paragraph ",m+1,": This is sample content to demonstrate the scrollable behavior of the panel when content exceeds the viewport height."]},m)),e.jsxs(r.Footer,{children:[e.jsx(n,{variant:"outline",onClick:()=>a(!1),children:"Close"}),e.jsx(n,{variant:"solid",children:"Apply"})]})]})]})}},c={args:{placement:"right",title:"This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!0},render:({...s})=>{const[l,t]=u.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"solid",onClick:()=>t(!0),children:"Open Long Title Panel"}),e.jsx(r,{...s,opened:l,onClose:()=>t(!1),children:e.jsx(h,{children:"Check the header to see if the long title is handled gracefully without pushing the close button off screen."})})]})}};var f,g,x;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    placement: "right",
    title: "Panel Title",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false
  },
  render: ({
    wrapHeaderText,
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)} title="Panel Title" placement="right" wrapHeaderText={wrapHeaderText}>
          <Text>
            This is the panel body content area. Panels slide in from the edge
            of the screen to reveal supplementary information, navigation
            options, or toolsets.
          </Text>
          <Panel.Footer>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button variant="solid">Save</Button>
          </Panel.Footer>
        </Panel>
      </>;
  }
}`,...(x=(g=i.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var y,P,v;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    placement: "left",
    title: "Navigation",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="outline" onClick={() => setOpened(true)}>
          Open Left Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)}>
          <Text>
            A panel sliding in from the left, commonly used for navigation menus
            or sidebars.
          </Text>
        </Panel>
      </>;
  }
}`,...(v=(P=d.parameters)==null?void 0:P.docs)==null?void 0:v.source}}};var w,C,b;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    placement: "right",
    title: "Scrollable Panel",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Scrollable Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)}>
          {Array.from({
          length: 20
        }).map((_, i) => <p key={i} style={{
          marginBottom: "1rem"
        }}>
              Paragraph {i + 1}: This is sample content to demonstrate the
              scrollable behavior of the panel when content exceeds the viewport
              height.
            </p>)}
          <Panel.Footer>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Close
            </Button>
            <Button variant="solid">Apply</Button>
          </Panel.Footer>
        </Panel>
      </>;
  }
}`,...(b=(C=p.parameters)==null?void 0:C.docs)==null?void 0:b.source}}};var B,O,T;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    placement: "right",
    title: "This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: true
  },
  render: ({
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Long Title Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)}>
          <Text>
            Check the header to see if the long title is handled gracefully
            without pushing the close button off screen.
          </Text>
        </Panel>
      </>;
  }
}`,...(T=(O=c.parameters)==null?void 0:O.docs)==null?void 0:T.source}}};const ae=["Default","LeftPlacement","ScrollableContent","LongTitle"];export{i as Default,d as LeftPlacement,c as LongTitle,p as ScrollableContent,ae as __namedExportsOrder,re as default};
