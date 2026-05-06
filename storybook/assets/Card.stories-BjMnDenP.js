import{j as e,r as u,f as h,$ as v}from"./iframe-Dj0rbBor.js";import{u as q,B as Q,d as X,e as Z,c as Y}from"./factory-TCfS6N5K.js";import{e as ee}from"./get-size-o6CFjt3X.js";import{p as W}from"./polymorphic-factory-D7tmZCs2.js";import{P as re}from"./Paper-DfvtZugI.js";import{c as ae}from"./create-safe-context-D-z4PqWo.js";import{B as U}from"./Button-CVHxu7cq.js";import{G as te}from"./Group-Dq1dW5vH.js";import{T as m}from"./Text-Beq38mU4.js";import"./preload-helper-Dp1pzeXC.js";import"./Loader-5C049jMY.js";import"./Transition-4D6OUsTu.js";import"./index-CYvNJvX6.js";import"./index-B-C0IeDg.js";import"./use-reduced-motion-CGT75eym.js";import"./UnstyledButton-DNz3hOAt.js";import"./Group-DNj-KUNO.js";import"./Text-B8TZu-IV.js";const[ne,oe]=ae("Card component was not found in tree");var k={root:"m_e615b15f",section:"m_599a2148"};const T=W((r,o)=>{const s=q("CardSection",null,r),{classNames:d,className:t,style:a,styles:l,vars:g,withBorder:p,inheritPadding:i,mod:L,...S}=s,P=oe();return e.jsx(Q,{ref:o,mod:[{"with-border":p,"inherit-padding":i},L],...P.getStyles("section",{className:t,style:a,styles:l,classNames:d}),...S})});T.classes=k;T.displayName="@mantine/core/CardSection";const se=Z((r,{padding:o})=>({root:{"--card-padding":ee(o)}})),y=W((r,o)=>{const s=q("Card",null,r),{classNames:d,className:t,style:a,styles:l,unstyled:g,vars:p,children:i,padding:L,attributes:S,...P}=s,R=X({name:"Card",props:s,classes:k,className:t,style:a,classNames:d,styles:l,unstyled:g,attributes:S,vars:p,varsResolver:se}),F=u.Children.toArray(i),J=F.map((C,A)=>typeof C=="object"&&C&&"type"in C&&C.type===T?u.cloneElement(C,{"data-first-section":A===0||void 0,"data-last-section":A===F.length-1||void 0}):C);return e.jsx(ne,{value:{getStyles:R},children:e.jsx(re,{ref:o,unstyled:g,...R("root"),...P,children:J})})});y.classes=k;y.displayName="@mantine/core/Card";y.Section=T;const de="Card-module__root___c9KvZ",ie="Card-module__header___PTXf2 recursica_brand_typography_h3",ce="Card-module__footer___Mu-JC",le="Card-module__section___BRT8H",pe="Card-module__content___oFIQa",c={root:de,header:ie,footer:ce,section:le,content:pe},K=u.forwardRef(function({overStyled:o=!1,...s},d){const t=h(s,o),a={root:c.root},l=t.classNames;if(l&&typeof l=="object"&&!Array.isArray(l)){const p=l;Object.keys(p).forEach(i=>{a[i]?a[i]=`${a[i]} ${p[i]}`:a[i]=p[i]})}const g=t.className;return e.jsx(y,{ref:d,className:g,classNames:a,...t})});K.displayName="Card";const b=u.forwardRef(function({overStyled:o=!1,...s},d){const t=h(s,o),a=t.className;return e.jsx(y.Section,{ref:d,className:a?`${c.section} ${a}`:c.section,...t})});b.displayName="CardSection";const N=u.forwardRef(function({overStyled:o=!1,...s},d){const t=h(s,o),a=t.className;return e.jsx(y.Section,{ref:d,className:a?`${c.header} ${a}`:c.header,...t})});N.displayName="CardHeader";const j=u.forwardRef(function({overStyled:o=!1,...s},d){const t=h(s,o),a=t.className;return e.jsx(y.Section,{ref:d,className:a?`${c.footer} ${a}`:c.footer,...t})});j.displayName="CardFooter";const w=u.forwardRef(function({overStyled:o=!1,...s},d){const t=h(s,o),a=t.className;return e.jsx("div",{ref:d,className:a?`${c.content} ${a}`:c.content,...t})});w.displayName="CardContent";const O=Y(K),H=O;H.Section=b;H.Header=N;H.Footer=j;H.Content=w;const n=O;try{b.displayName="CardSection",b.__docgenInfo={description:"A generalized edge-to-edge structural wrapper native to Mantine. Strips typical boundary padding via negative margins to allow content (like maps or header images) to touch the border seamlessly.",displayName:"CardSection",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{},tags:{}}}catch{}try{N.displayName="CardHeader",N.__docgenInfo={description:"Replaces standard generic Mantine `<Card.Section>` wrappers by directly injecting the strict Recursica design tokens for header sizing, background drops, and intrinsic padding limits.",displayName:"CardHeader",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{},tags:{}}}catch{}try{j.displayName="CardFooter",j.__docgenInfo={description:"Counterpart to `Card.Header`, applying specific footer elevation margins, sizes, and padding natively.",displayName:"CardFooter",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{},tags:{}}}catch{}try{w.displayName="CardContent",w.__docgenInfo={description:"Internal container that safely binds typography and structural flex gaps driven by the active UI kit tokens natively, preserving correct padding blocks compared to rigid `Card.Section` edges.",displayName:"CardContent",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}try{n.displayName="Card",n.__docgenInfo={description:"",displayName:"Card",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{component:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"},{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"}],description:"",name:"component",required:!1,tags:{},type:{name:'"symbol" | "object" | "style" | "p" | "td" | "div" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | ... 160 more ... | undefined'}},renderRoot:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"},{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"}],description:"",name:"renderRoot",required:!1,tags:{},type:{name:"((props: any) => any) | ((props: Record<string, any>) => any) | undefined"}}},tags:{}}}catch{}const ke={title:"UI-Kit/Card",component:n,subcomponents:{"Card.Header":n.Header,"Card.Content":n.Content,"Card.Footer":n.Footer,"Card.Section":n.Section},tags:["autodocs"],parameters:{docs:{description:{component:"The Card component acts as the foundational padded surface for grouping related information. It relies on standard internal compositional nodes (`Card.Header`, `Card.Content`, `Card.Footer`) mapped directly to the active Recursica design tokens to enforce layout gaps and margins seamlessly. Use the provided dot-notation wrappers rather than building ad-hoc generic sections."}}},argTypes:{}},f={args:{},render:({...r})=>e.jsx("div",{style:{padding:"48px",backgroundColor:"var(--recursica_brand_palettes_neutral_050)"},children:e.jsx(v,{layer:0,children:e.jsxs(n,{...r,children:[e.jsx(n.Header,{children:"Customer Activity Report"}),e.jsxs(n.Content,{children:[e.jsx(m,{children:"Card inner section content body. Notice how this acts as padded content natively based on the overarching properties. Recursica's vertical gutter governs vertical spacing between siblings in the flex container."}),e.jsx(m,{children:"Another section showing the vertical gutter spacing."})]}),e.jsx(n.Footer,{children:e.jsxs(te,{justify:"space-between",align:"center",children:[e.jsx(m,{variant:"caption",children:"Generated today"}),e.jsx(U,{variant:"solid",children:"View Details"})]})})]})})})},_={args:{},render:({...r})=>e.jsx("div",{style:{padding:"48px",backgroundColor:"var(--recursica_brand_palettes_neutral_050)"},children:e.jsx(v,{layer:0,children:e.jsx(n,{...r,children:e.jsxs(n.Content,{children:[e.jsx(m,{variant:"subtitle",children:"Notice"}),e.jsx(m,{children:"This is a completely generic card payload dropping the Header and Footer specific elements, simply acting as a padded elevation boundary box directly mirroring native composability!"}),e.jsx(U,{variant:"solid",children:"Acknowledge"})]})})})})},x={args:{},render:({...r})=>e.jsxs("div",{style:{display:"flex",gap:"32px",backgroundColor:"#e9ecef",padding:"32px"},children:[e.jsx(v,{layer:1,children:e.jsxs(n,{...r,children:[e.jsx(n.Header,{children:"Layer 1 Wrapper"}),e.jsx(n.Content,{children:e.jsx(m,{children:"Content inside layer 1 card."})})]})}),e.jsx(v,{layer:2,children:e.jsxs(n,{...r,children:[e.jsx(n.Header,{children:"Layer 2 Wrapper"}),e.jsx(n.Content,{children:e.jsx(m,{children:"Content inside layer 2 card exposing a higher elevation drop shadow inherently cascaded."})})]})})]})};var $,B,I;f.parameters={...f.parameters,docs:{...($=f.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }) => {
    return <div style={{
      padding: "48px",
      backgroundColor: "var(--recursica_brand_palettes_neutral_050)"
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
}`,...(I=(B=f.parameters)==null?void 0:B.docs)==null?void 0:I.source}}};var z,D,G;_.parameters={..._.parameters,docs:{...(z=_.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }) => {
    return <div style={{
      padding: "48px",
      backgroundColor: "var(--recursica_brand_palettes_neutral_050)"
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
}`,...(G=(D=_.parameters)==null?void 0:D.docs)==null?void 0:G.source}}};var M,V,E;x.parameters={...x.parameters,docs:{...(M=x.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(E=(V=x.parameters)==null?void 0:V.docs)==null?void 0:E.source}}};const Le=["Default","HeaderlessAndFooterless","LayerDemonstration"];export{f as Default,_ as HeaderlessAndFooterless,x as LayerDemonstration,Le as __namedExportsOrder,ke as default};
