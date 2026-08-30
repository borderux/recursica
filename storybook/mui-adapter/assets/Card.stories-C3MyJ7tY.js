import{j as e,h as d}from"./iframe-4oz2vDEb.js";import{C as r}from"./Card-Ozy2tLTd.js";import{B as y}from"./Button-CtTGpGVG.js";import{G as u}from"./Group-Ce3bIxOO.js";import{T as n}from"./Text-0R3I1RGL.js";import"./preload-helper-Dp1pzeXC.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./memoTheme-DYm0d07S.js";import"./Paper-C4KOzltl.js";import"./useTheme-DOCNIex3.js";import"./Loader-g1VNCh7M.js";import"./Button-DbTPS29q.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./ButtonBase-DFDhNXBe.js";import"./useTimeout-CPSYxtd6.js";import"./useForkRef-Bvs5Kkb7.js";import"./useEventCallback-D7tIRzRk.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-DPe7o8A7.js";import"./Stack-Bf9ndvkE.js";import"./styled-DE_zNdRJ.js";import"./useThemeProps-puXN0LHz.js";import"./Typography-BCLUH7Xx.js";import"./Typography-CZAgeFNT.js";const O={title:"UI-Kit/Card",component:r,subcomponents:{"Card.Header":r.Header,"Card.Content":r.Content,"Card.Footer":r.Footer,"Card.Section":r.Section},tags:["autodocs"],parameters:{docs:{description:{component:"The Card component acts as the foundational padded surface for grouping related information. It relies on standard internal compositional nodes (`Card.Header`, `Card.Content`, `Card.Footer`) mapped directly to the active Recursica design tokens to enforce layout gaps and margins seamlessly. Use the provided dot-notation wrappers rather than building ad-hoc generic sections."}}},argTypes:{}},a={args:{},render:({...t})=>e.jsx("div",{style:{padding:"48px",backgroundColor:"#e9ecef"},children:e.jsx(d,{layer:0,children:e.jsxs(r,{...t,children:[e.jsx(r.Header,{children:"Customer Activity Report"}),e.jsxs(r.Content,{children:[e.jsx(n,{children:"Card inner section content body. Notice how this acts as padded content natively based on the overarching properties. Recursica's vertical gutter governs vertical spacing between siblings in the flex container."}),e.jsx(n,{children:"Another section showing the vertical gutter spacing."})]}),e.jsx(r.Footer,{children:e.jsxs(u,{justify:"space-between",align:"center",children:[e.jsx(n,{variant:"caption",children:"Generated today"}),e.jsx(y,{variant:"solid",children:"View Details"})]})})]})})})},o={args:{},render:({...t})=>e.jsx("div",{style:{padding:"48px",backgroundColor:"#e9ecef"},children:e.jsx(d,{layer:0,children:e.jsx(r,{...t,children:e.jsxs(r.Content,{children:[e.jsx(n,{variant:"subtitle",children:"Notice"}),e.jsx(n,{children:"This is a completely generic card payload dropping the Header and Footer specific elements, simply acting as a padded elevation boundary box directly mirroring native composability!"}),e.jsx(y,{variant:"solid",children:"Acknowledge"})]})})})})},i={args:{},render:({...t})=>e.jsxs("div",{style:{display:"flex",gap:"32px",backgroundColor:"#e9ecef",padding:"32px"},children:[e.jsx(d,{layer:1,children:e.jsxs(r,{...t,children:[e.jsx(r.Header,{children:"Layer 1 Wrapper"}),e.jsx(r.Content,{children:e.jsx(n,{children:"Content inside layer 1 card."})})]})}),e.jsx(d,{layer:2,children:e.jsxs(r,{...t,children:[e.jsx(r.Header,{children:"Layer 2 Wrapper"}),e.jsx(r.Content,{children:e.jsx(n,{children:"Content inside layer 2 card exposing a higher elevation drop shadow inherently cascaded."})})]})})]})};var s,c,l;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }) => {
    return <div style={{
      padding: "48px",
      backgroundColor: "#e9ecef"
    }}>
        <Layer layer={0}>
          <Card {...args}>
            <Card.Header>Customer Activity Report</Card.Header>
            <Card.Content>
              <Text>
                Card inner section content body. Notice how this acts as padded
                content natively based on the overarching properties.
                Recursica's vertical gutter governs vertical spacing between
                siblings in the flex container.
              </Text>
              <Text>Another section showing the vertical gutter spacing.</Text>
            </Card.Content>
            <Card.Footer>
              <Group justify="space-between" align="center">
                <Text variant="caption">Generated today</Text>
                <Button variant="solid">View Details</Button>
              </Group>
            </Card.Footer>
          </Card>
        </Layer>
      </div>;
  }
}`,...(l=(c=a.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var p,g,m;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }) => {
    return <div style={{
      padding: "48px",
      backgroundColor: "#e9ecef"
    }}>
        <Layer layer={0}>
          <Card {...args}>
            <Card.Content>
              <Text variant="subtitle">Notice</Text>
              <Text>
                This is a completely generic card payload dropping the Header
                and Footer specific elements, simply acting as a padded
                elevation boundary box directly mirroring native composability!
              </Text>
              <Button variant="solid">Acknowledge</Button>
            </Card.Content>
          </Card>
        </Layer>
      </div>;
  }
}`,...(m=(g=o.parameters)==null?void 0:g.docs)==null?void 0:m.source}}};var h,x,C;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }) => {
    return <div style={{
      display: "flex",
      gap: "32px",
      backgroundColor: "#e9ecef",
      padding: "32px"
    }}>
        <Layer layer={1}>
          <Card {...args}>
            <Card.Header>Layer 1 Wrapper</Card.Header>
            <Card.Content>
              <Text>Content inside layer 1 card.</Text>
            </Card.Content>
          </Card>
        </Layer>

        <Layer layer={2}>
          <Card {...args}>
            <Card.Header>Layer 2 Wrapper</Card.Header>
            <Card.Content>
              <Text>
                Content inside layer 2 card exposing a higher elevation drop
                shadow inherently cascaded.
              </Text>
            </Card.Content>
          </Card>
        </Layer>
      </div>;
  }
}`,...(C=(x=i.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};const q=["Default","HeaderlessAndFooterless","LayerDemonstration"];export{a as Default,o as HeaderlessAndFooterless,i as LayerDemonstration,q as __namedExportsOrder,O as default};
