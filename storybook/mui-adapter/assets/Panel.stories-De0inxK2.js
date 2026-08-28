import{r as u,j as e}from"./iframe-Bain31R0.js";import{P as r}from"./Panel-bKuXK-Ra.js";import{B as n}from"./Button-DAVT_Vrx.js";import{T as h}from"./Text-CUJ035ww.js";import"./preload-helper-Dp1pzeXC.js";import"./memoTheme-C8oOPpFq.js";import"./useTheme-DfdQqc5m.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./useSlot-BYP_jPjY.js";import"./mergeSlotProps-DT6hk6s3.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-itiL0CSC.js";import"./Modal-DQvfdOPu.js";import"./ownerWindow-HkKU3E4x.js";import"./ownerDocument-DW-IO8s5.js";import"./useEventCallback-B-qTP8Ut.js";import"./createChainedFunction-BO_9K8Jh.js";import"./Portal-DCDNgx_V.js";import"./index-TLVyyQ7L.js";import"./index-DOUe8wrs.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./utils-gQhUfUfP.js";import"./useTimeout-DrzpHnwK.js";import"./mergeSlotProps-tLrn7IGQ.js";import"./debounce-Be36O1Ab.js";import"./Paper-g7HoWqDO.js";import"./Loader-CUZ2IorV.js";import"./Button-rI8nTmZ5.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-nOQ6vh2E.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-C0U6vXLx.js";import"./Typography-BGTTj58W.js";import"./Typography-C3t9DkQB.js";const pe={title:"UI-Kit/Panel",component:r,tags:["autodocs"],argTypes:{placement:{control:"select",options:["left","right","top","bottom"],description:"Side of the screen the panel slides in from."},title:{control:"text",description:"Panel title displayed in the header."},withOverlay:{control:"boolean",description:"Whether to display a background overlay."},withCloseButton:{control:"boolean",description:"Whether to display the close button in the header."},wrapHeaderText:{control:"boolean",description:"If true, forces the header text to a single line and truncates with an ellipsis."},defaultChecked:{table:{disable:!0}},defaultValue:{table:{disable:!0}},suppressContentEditableWarning:{table:{disable:!0}},suppressHydrationWarning:{table:{disable:!0}}},parameters:{layout:"fullscreen",docs:{description:{component:`
The \`Panel\` component slides in or expands from the edge of the screen to reveal additional content or functionality. Built on Mui's \`Drawer\`, it enforces Recursica design tokens for styling.

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
        `}}}},i={args:{placement:"right",title:"Panel Title",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({wrapHeaderText:s,...l})=>{const[t,o]=u.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"solid",onClick:()=>o(!0),children:"Open Panel"}),e.jsxs(r,{...l,opened:t,onClose:()=>o(!1),title:"Panel Title",placement:"right",wrapHeaderText:s,children:[e.jsx(h,{children:"This is the panel body content area. Panels slide in from the edge of the screen to reveal supplementary information, navigation options, or toolsets."}),e.jsxs(r.Footer,{children:[e.jsx(n,{variant:"outline",onClick:()=>o(!1),children:"Cancel"}),e.jsx(n,{variant:"solid",children:"Save"})]})]})]})}},p={args:{placement:"left",title:"Navigation",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({withLayer:s,layer:l,...t})=>{const[o,a]=u.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"outline",onClick:()=>a(!0),children:"Open Left Panel"}),e.jsx(r,{...t,opened:o,onClose:()=>a(!1),children:e.jsx(h,{children:"A panel sliding in from the left, commonly used for navigation menus or sidebars."})})]})}},d={args:{placement:"right",title:"Scrollable Panel",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({withLayer:s,layer:l,...t})=>{const[o,a]=u.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"solid",onClick:()=>a(!0),children:"Open Scrollable Panel"}),e.jsxs(r,{...t,opened:o,onClose:()=>a(!1),children:[Array.from({length:20}).map((S,m)=>e.jsxs("p",{style:{marginBottom:"1rem"},children:["Paragraph ",m+1,": This is sample content to demonstrate the scrollable behavior of the panel when content exceeds the viewport height."]},m)),e.jsxs(r.Footer,{children:[e.jsx(n,{variant:"outline",onClick:()=>a(!1),children:"Close"}),e.jsx(n,{variant:"solid",children:"Apply"})]})]})]})}},c={args:{placement:"right",title:"This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!0},render:({...s})=>{const[l,t]=u.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"solid",onClick:()=>t(!0),children:"Open Long Title Panel"}),e.jsx(r,{...s,opened:l,onClose:()=>t(!1),children:e.jsx(h,{children:"Check the header to see if the long title is handled gracefully without pushing the close button off screen."})})]})}};var f,g,x;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(x=(g=i.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var y,P,v;p.parameters={...p.parameters,docs:{...(y=p.parameters)==null?void 0:y.docs,source:{originalSource:`{
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
}`,...(v=(P=p.parameters)==null?void 0:P.docs)==null?void 0:v.source}}};var w,C,b;d.parameters={...d.parameters,docs:{...(w=d.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(b=(C=d.parameters)==null?void 0:C.docs)==null?void 0:b.source}}};var B,O,T;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`{
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
}`,...(T=(O=c.parameters)==null?void 0:O.docs)==null?void 0:T.source}}};const de=["Default","LeftPlacement","ScrollableContent","LongTitle"];export{i as Default,p as LeftPlacement,c as LongTitle,d as ScrollableContent,de as __namedExportsOrder,pe as default};
