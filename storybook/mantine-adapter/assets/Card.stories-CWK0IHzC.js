import{j as e,R as s}from"./iframe-oYtE5cjn.js";import{C as r}from"./Card-DdQ09BBb.js";import{B as u}from"./Button-BpyKHyUe.js";import{G as y}from"./Group-2cDzDBeF.js";import{T as n}from"./Text-DmeMpJj3.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-cPRSk-ET.js";import"./get-size-DSTSojjy.js";import"./polymorphic-factory-dVyCEWHC.js";import"./Paper-BSk8hO4y.js";import"./create-safe-context-l9Fk2IeW.js";import"./Loader-CFym39gL.js";import"./Loader-ByIGVomv.js";import"./Transition-DPdppHpJ.js";import"./index-CEpvbvaq.js";import"./index-XShu5g5I.js";import"./use-reduced-motion-BK-CWA4g.js";import"./UnstyledButton-tscyQpQ2.js";import"./Group-C8sM7eXU.js";import"./Text-COc5EdYV.js";const I={title:"UI-Kit/Card",component:r,subcomponents:{"Card.Header":r.Header,"Card.Content":r.Content,"Card.Footer":r.Footer,"Card.Section":r.Section},tags:["autodocs"],parameters:{docs:{description:{component:"The Card component acts as the foundational padded surface for grouping related information. It relies on standard internal compositional nodes (`Card.Header`, `Card.Content`, `Card.Footer`) mapped directly to the active Recursica design tokens to enforce layout gaps and margins seamlessly. Use the provided dot-notation wrappers rather than building ad-hoc generic sections."}}},argTypes:{}},t={args:{},render:({...a})=>e.jsx("div",{style:{padding:"48px",backgroundColor:"var(--recursica_brand_palettes_neutral_050_color_tone)"},children:e.jsx(s,{layer:0,children:e.jsxs(r,{...a,children:[e.jsx(r.Header,{children:"Customer Activity Report"}),e.jsxs(r.Content,{children:[e.jsx(n,{children:"Card inner section content body. Notice how this acts as padded content natively based on the overarching properties. Recursica's vertical gutter governs vertical spacing between siblings in the flex container."}),e.jsx(n,{children:"Another section showing the vertical gutter spacing."})]}),e.jsx(r.Footer,{children:e.jsxs(y,{justify:"space-between",align:"center",children:[e.jsx(n,{variant:"caption",children:"Generated today"}),e.jsx(u,{variant:"solid",children:"View Details"})]})})]})})})},o={args:{},render:({...a})=>e.jsx("div",{style:{padding:"48px",backgroundColor:"var(--recursica_brand_palettes_neutral_050_color_tone)"},children:e.jsx(s,{layer:0,children:e.jsx(r,{...a,children:e.jsxs(r.Content,{children:[e.jsx(n,{variant:"subtitle",children:"Notice"}),e.jsx(n,{children:"This is a completely generic card payload dropping the Header and Footer specific elements, simply acting as a padded elevation boundary box directly mirroring native composability!"}),e.jsx(u,{variant:"solid",children:"Acknowledge"})]})})})})},i={args:{},render:({...a})=>e.jsxs("div",{style:{display:"flex",gap:"32px",backgroundColor:"#e9ecef",padding:"32px"},children:[e.jsx(s,{layer:1,children:e.jsxs(r,{...a,children:[e.jsx(r.Header,{children:"Layer 1 Wrapper"}),e.jsx(r.Content,{children:e.jsx(n,{children:"Content inside layer 1 card."})})]})}),e.jsx(s,{layer:2,children:e.jsxs(r,{...a,children:[e.jsx(r.Header,{children:"Layer 2 Wrapper"}),e.jsx(r.Content,{children:e.jsx(n,{children:"Content inside layer 2 card exposing a higher elevation drop shadow inherently cascaded."})})]})})]})};var d,c,l;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }) => {
    return <div style={{
      padding: "48px",
      backgroundColor: "var(--recursica_brand_palettes_neutral_050_color_tone)"
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
}`,...(l=(c=t.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var p,g,h;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }) => {
    return <div style={{
      padding: "48px",
      backgroundColor: "var(--recursica_brand_palettes_neutral_050_color_tone)"
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
}`,...(h=(g=o.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var m,x,C;i.parameters={...i.parameters,docs:{...(m=i.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(C=(x=i.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};const U=["Default","HeaderlessAndFooterless","LayerDemonstration"];export{t as Default,o as HeaderlessAndFooterless,i as LayerDemonstration,U as __namedExportsOrder,I as default};
