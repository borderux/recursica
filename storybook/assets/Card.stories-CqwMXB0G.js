import{j as e,r as m,f as C,$ as x}from"./iframe-EqBHPOI0.js";import{u as E,B as J,d as Q,e as X,c as Z}from"./factory-DqECm5K9.js";import{e as Y}from"./get-size-CSQgFZmj.js";import{p as q}from"./polymorphic-factory-BGsUCbbm.js";import{P as ee}from"./Paper-C9robENA.js";import{c as re}from"./create-safe-context-BYa7r0xv.js";import{B as U}from"./Button-DyxeCZYV.js";import"./preload-helper-Dp1pzeXC.js";import"./Loader-YJwzFIcQ.js";import"./Transition-DGeBSity.js";import"./index-CbX1FNOe.js";import"./index-BQPiQ6rT.js";import"./use-reduced-motion-BE2r52SP.js";import"./UnstyledButton-CsDtP7a1.js";const[ae,te]=re("Card component was not found in tree");var k={root:"m_e615b15f",section:"m_599a2148"};const S=q((r,o)=>{const s=E("CardSection",null,r),{classNames:d,className:t,style:a,styles:l,vars:g,withBorder:p,inheritPadding:i,mod:L,...H}=s,P=te();return e.jsx(J,{ref:o,mod:[{"with-border":p,"inherit-padding":i},L],...P.getStyles("section",{className:t,style:a,styles:l,classNames:d}),...H})});S.classes=k;S.displayName="@mantine/core/CardSection";const ne=X((r,{padding:o})=>({root:{"--card-padding":Y(o)}})),y=q((r,o)=>{const s=E("Card",null,r),{classNames:d,className:t,style:a,styles:l,unstyled:g,vars:p,children:i,padding:L,attributes:H,...P}=s,R=Q({name:"Card",props:s,classes:k,className:t,style:a,classNames:d,styles:l,unstyled:g,attributes:H,vars:p,varsResolver:ne}),F=m.Children.toArray(i),O=F.map((u,A)=>typeof u=="object"&&u&&"type"in u&&u.type===S?m.cloneElement(u,{"data-first-section":A===0||void 0,"data-last-section":A===F.length-1||void 0}):u);return e.jsx(ae,{value:{getStyles:R},children:e.jsx(ee,{ref:o,unstyled:g,...R("root"),...P,children:O})})});y.classes=k;y.displayName="@mantine/core/Card";y.Section=S;const oe="Card-module__root___c9KvZ",se="Card-module__header___PTXf2",de="Card-module__footer___Mu-JC",ie="Card-module__section___BRT8H",ce="Card-module__content___oFIQa",c={root:oe,header:se,footer:de,section:ie,content:ce},G=m.forwardRef(function({overStyled:o=!1,...s},d){const t=C(s,o),a={root:c.root},l=t.classNames;if(l&&typeof l=="object"&&!Array.isArray(l)){const p=l;Object.keys(p).forEach(i=>{a[i]?a[i]=`${a[i]} ${p[i]}`:a[i]=p[i]})}const g=t.className;return e.jsx(y,{ref:d,className:g,classNames:a,...t})});G.displayName="Card";const b=m.forwardRef(function({overStyled:o=!1,...s},d){const t=C(s,o),a=t.className;return e.jsx(y.Section,{ref:d,className:a?`${c.section} ${a}`:c.section,...t})});b.displayName="CardSection";const v=m.forwardRef(function({overStyled:o=!1,...s},d){const t=C(s,o),a=t.className;return e.jsx(y.Section,{ref:d,className:a?`${c.header} ${a}`:c.header,...t})});v.displayName="CardHeader";const N=m.forwardRef(function({overStyled:o=!1,...s},d){const t=C(s,o),a=t.className;return e.jsx(y.Section,{ref:d,className:a?`${c.footer} ${a}`:c.footer,...t})});N.displayName="CardFooter";const j=m.forwardRef(function({overStyled:o=!1,...s},d){const t=C(s,o),a=t.className;return e.jsx("div",{ref:d,className:a?`${c.content} ${a}`:c.content,...t})});j.displayName="CardContent";const K=Z(G),w=K;w.Section=b;w.Header=v;w.Footer=N;w.Content=j;const n=K;try{b.displayName="CardSection",b.__docgenInfo={description:"A generalized edge-to-edge structural wrapper native to Mantine. Strips typical boundary padding via negative margins to allow content (like maps or header images) to touch the border seamlessly.",displayName:"CardSection",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{},tags:{}}}catch{}try{v.displayName="CardHeader",v.__docgenInfo={description:"Replaces standard generic Mantine `<Card.Section>` wrappers by directly injecting the strict Recursica design tokens for header sizing, background drops, and intrinsic padding limits.",displayName:"CardHeader",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{},tags:{}}}catch{}try{N.displayName="CardFooter",N.__docgenInfo={description:"Counterpart to `Card.Header`, applying specific footer elevation margins, sizes, and padding natively.",displayName:"CardFooter",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{},tags:{}}}catch{}try{j.displayName="CardContent",j.__docgenInfo={description:"Internal container that safely binds typography and structural flex gaps driven by the active UI kit tokens natively, preserving correct padding blocks compared to rigid `Card.Section` edges.",displayName:"CardContent",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}try{n.displayName="Card",n.__docgenInfo={description:"",displayName:"Card",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{component:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"},{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"}],description:"",name:"component",required:!1,tags:{},type:{name:'"symbol" | "object" | "style" | "p" | "td" | "div" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | "blockquote" | "body" | ... 160 more ... | undefined'}},renderRoot:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"},{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"}],description:"",name:"renderRoot",required:!1,tags:{},type:{name:"((props: any) => any) | ((props: Record<string, any>) => any) | undefined"}}},tags:{}}}catch{}const je={title:"UI-Kit/Card",component:n,subcomponents:{"Card.Header":n.Header,"Card.Content":n.Content,"Card.Footer":n.Footer,"Card.Section":n.Section},tags:["autodocs"],parameters:{docs:{description:{component:"The Card component acts as the foundational padded surface for grouping related information. It relies on standard internal compositional nodes (`Card.Header`, `Card.Content`, `Card.Footer`) mapped directly to the active Recursica design tokens to enforce layout gaps and margins seamlessly. Use the provided dot-notation wrappers rather than building ad-hoc generic sections."}}},argTypes:{}},h={args:{},render:({...r})=>e.jsx(x,{layer:0,style:{padding:"48px",backgroundColor:"var(--recursica_brand_palettes_neutral_050)"},children:e.jsxs(n,{...r,children:[e.jsx(n.Header,{children:e.jsx("span",{style:{fontWeight:500,fontSize:"1.125rem"},children:"Customer Activity Report"})}),e.jsxs(n.Content,{children:[e.jsx("p",{children:"Card inner section content body. Notice how this acts as padded content natively based on the overarching properties. Recursica's vertical gutter governs vertical spacing between siblings in the flex container."}),e.jsx("p",{children:"Another section showing the vertical gutter spacing."})]}),e.jsx(n.Footer,{children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"16px",marginBottom:"8px"},children:[e.jsx("span",{style:{color:"#868e96",fontSize:"0.75rem"},children:"Generated today"}),e.jsx(U,{variant:"solid",children:"View Details"})]})})]})})},f={args:{},render:({...r})=>e.jsx(x,{layer:0,style:{padding:"48px",backgroundColor:"var(--recursica_brand_palettes_neutral_050)"},children:e.jsx(n,{...r,children:e.jsxs(n.Content,{children:[e.jsx("span",{style:{fontWeight:500,fontSize:"1.125rem"},children:"Notice"}),e.jsx("p",{children:"This is a completely generic card payload dropping the Header and Footer specific elements, simply acting as a padded elevation boundary box directly mirroring native composability!"}),e.jsx(U,{variant:"solid",mt:"rec-md",children:"Acknowledge"})]})})})},_={args:{},render:({...r})=>e.jsxs("div",{style:{display:"flex",gap:"32px",backgroundColor:"#e9ecef",padding:"32px"},children:[e.jsx(x,{layer:1,children:e.jsxs(n,{...r,children:[e.jsx(n.Header,{children:"Layer 1 Wrapper"}),e.jsx("p",{children:"Content inside layer 1 card."})]})}),e.jsx(x,{layer:2,children:e.jsxs(n,{...r,children:[e.jsx(n.Header,{children:"Layer 2 Wrapper"}),e.jsx("p",{children:"Content inside layer 2 card exposing a higher elevation drop shadow inherently cascaded."})]})})]})};var T,z,B;h.parameters={...h.parameters,docs:{...(T=h.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }) => {
    return <Layer layer={0} style={{
      padding: "48px",
      backgroundColor: "var(--recursica_brand_palettes_neutral_050)"
    }}>
        <Card {...args}>
          <Card.Header>
            <span style={{
            fontWeight: 500,
            fontSize: "1.125rem"
          }}>
              Customer Activity Report
            </span>
          </Card.Header>
          <Card.Content>
            <p>
              Card inner section content body. Notice how this acts as padded
              content natively based on the overarching properties. Recursica's
              vertical gutter governs vertical spacing between siblings in the
              flex container.
            </p>
            <p>Another section showing the vertical gutter spacing.</p>
          </Card.Content>
          <Card.Footer>
            <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            marginBottom: "8px"
          }}>
              <span style={{
              color: "#868e96",
              fontSize: "0.75rem"
            }}>
                Generated today
              </span>
              <Button variant="solid">View Details</Button>
            </div>
          </Card.Footer>
        </Card>
      </Layer>;
  }
}`,...(B=(z=h.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};var $,I,W;f.parameters={...f.parameters,docs:{...($=f.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {},
  render: ({
    ...args
  }) => {
    return <Layer layer={0} style={{
      padding: "48px",
      backgroundColor: "var(--recursica_brand_palettes_neutral_050)"
    }}>
        <Card {...args}>
          <Card.Content>
            <span style={{
            fontWeight: 500,
            fontSize: "1.125rem"
          }}>
              Notice
            </span>
            <p>
              This is a completely generic card payload dropping the Header and
              Footer specific elements, simply acting as a padded elevation
              boundary box directly mirroring native composability!
            </p>
            <Button variant="solid" mt="rec-md">
              Acknowledge
            </Button>
          </Card.Content>
        </Card>
      </Layer>;
  }
}`,...(W=(I=f.parameters)==null?void 0:I.docs)==null?void 0:W.source}}};var D,M,V;_.parameters={..._.parameters,docs:{...(D=_.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
            <p>Content inside layer 1 card.</p>
          </Card>
        </Layer>

        <Layer layer={2}>
          <Card {...args}>
            <Card.Header>Layer 2 Wrapper</Card.Header>
            <p>
              Content inside layer 2 card exposing a higher elevation drop
              shadow inherently cascaded.
            </p>
          </Card>
        </Layer>
      </div>;
  }
}`,...(V=(M=_.parameters)==null?void 0:M.docs)==null?void 0:V.source}}};const Se=["Default","HeaderlessAndFooterless","LayerDemonstration"];export{h as Default,f as HeaderlessAndFooterless,_ as LayerDemonstration,Se as __namedExportsOrder,je as default};
