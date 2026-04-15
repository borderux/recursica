import{j as e,r as m,f as C,$ as x}from"./iframe-d8_mgu_F.js";import{e as O}from"./get-size-J7CBMG80.js";import{u as E,B as q,b as J,c as Q}from"./factory-BnxMGGpV.js";import{p as V}from"./polymorphic-factory-D_h49hYh.js";import{P as X}from"./Paper-DcIoqB4q.js";import{c as Z}from"./create-safe-context-sKWBo8gG.js";import{B as U}from"./Button-CYYANUBS.js";import"./preload-helper-Dp1pzeXC.js";import"./Transition-CjqzxG3M.js";import"./index-vaX_qTck.js";import"./index-Cqv26_ew.js";import"./use-reduced-motion-CjtJf-wE.js";import"./UnstyledButton-BAqRjZ2G.js";const[Y,ee]=Z("Card component was not found in tree");var k={root:"m_e615b15f",section:"m_599a2148"};const S=V((r,s)=>{const o=E("CardSection",null,r),{classNames:d,className:n,style:a,styles:l,vars:u,withBorder:p,inheritPadding:i,mod:P,...w}=o,H=ee();return e.jsx(q,{ref:s,mod:[{"with-border":p,"inherit-padding":i},P],...H.getStyles("section",{className:n,style:a,styles:l,classNames:d}),...w})});S.classes=k;S.displayName="@mantine/core/CardSection";const re=Q((r,{padding:s})=>({root:{"--card-padding":O(s)}})),g=V((r,s)=>{const o=E("Card",null,r),{classNames:d,className:n,style:a,styles:l,unstyled:u,vars:p,children:i,padding:P,attributes:w,...H}=o,F=J({name:"Card",props:o,classes:k,className:n,style:a,classNames:d,styles:l,unstyled:u,attributes:w,vars:p,varsResolver:re}),L=m.Children.toArray(i),K=L.map((y,R)=>typeof y=="object"&&y&&"type"in y&&y.type===S?m.cloneElement(y,{"data-first-section":R===0||void 0,"data-last-section":R===L.length-1||void 0}):y);return e.jsx(Y,{value:{getStyles:F},children:e.jsx(X,{ref:s,unstyled:u,...F("root"),...H,children:K})})});g.classes=k;g.displayName="@mantine/core/Card";g.Section=S;const ae="Card-module__root___c9KvZ",te="Card-module__header___PTXf2",ne="Card-module__footer___Mu-JC",se="Card-module__section___BRT8H",oe="Card-module__content___oFIQa",c={root:ae,header:te,footer:ne,section:se,content:oe},G=m.forwardRef(function({overStyled:s=!1,...o},d){const n=C(o,s),a={root:c.root},l=n.classNames;if(l&&typeof l=="object"&&!Array.isArray(l)){const p=l;Object.keys(p).forEach(i=>{a[i]?a[i]=`${a[i]} ${p[i]}`:a[i]=p[i]})}const u=n.className;return e.jsx(g,{ref:d,className:u,classNames:a,...n})});G.displayName="Card";const v=m.forwardRef(function({overStyled:s=!1,...o},d){const n=C(o,s),a=n.className;return e.jsx(g.Section,{ref:d,className:a?`${c.section} ${a}`:c.section,...n})});v.displayName="CardSection";const N=m.forwardRef(function({overStyled:s=!1,...o},d){const n=C(o,s),a=n.className;return e.jsx(g.Section,{ref:d,className:a?`${c.header} ${a}`:c.header,...n})});N.displayName="CardHeader";const b=m.forwardRef(function({overStyled:s=!1,...o},d){const n=C(o,s),a=n.className;return e.jsx(g.Section,{ref:d,className:a?`${c.footer} ${a}`:c.footer,...n})});b.displayName="CardFooter";const j=m.forwardRef(function({overStyled:s=!1,...o},d){const n=C(o,s),a=n.className;return e.jsx("div",{ref:d,className:a?`${c.content} ${a}`:c.content,...n})});j.displayName="CardContent";const t=G;t.Section=v;t.Header=N;t.Footer=b;t.Content=j;try{v.displayName="CardSection",v.__docgenInfo={description:"A generalized edge-to-edge structural wrapper native to Mantine. Strips typical boundary padding via negative margins to allow content (like maps or header images) to touch the border seamlessly.",displayName:"CardSection",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{},tags:{}}}catch{}try{N.displayName="CardHeader",N.__docgenInfo={description:"Replaces standard generic Mantine `<Card.Section>` wrappers by directly injecting the strict Recursica design tokens for header sizing, background drops, and intrinsic padding limits.",displayName:"CardHeader",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{},tags:{}}}catch{}try{b.displayName="CardFooter",b.__docgenInfo={description:"Counterpart to `Card.Header`, applying specific footer elevation margins, sizes, and padding natively.",displayName:"CardFooter",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{},tags:{}}}catch{}try{j.displayName="CardContent",j.__docgenInfo={description:"Internal container that safely binds typography and structural flex gaps driven by the active UI kit tokens natively, preserving correct padding blocks compared to rigid `Card.Section` edges.",displayName:"CardContent",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}try{t.displayName="Card",t.__docgenInfo={description:"",displayName:"Card",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{},tags:{}}}catch{}const xe={title:"UI-Kit/Card",component:t,subcomponents:{"Card.Header":t.Header,"Card.Content":t.Content,"Card.Footer":t.Footer,"Card.Section":t.Section},tags:["autodocs"],parameters:{docs:{description:{component:"The Card component acts as the foundational padded surface for grouping related information. It relies on standard internal compositional nodes (`Card.Header`, `Card.Content`, `Card.Footer`) mapped directly to the active Recursica design tokens to enforce layout gaps and margins seamlessly. Use the provided dot-notation wrappers rather than building ad-hoc generic sections."}}},argTypes:{}},h={args:{},render:({...r})=>e.jsx(x,{layer:0,style:{padding:"48px",backgroundColor:"var(--recursica_brand_palettes_neutral_050)"},children:e.jsxs(t,{...r,children:[e.jsx(t.Header,{children:e.jsx("span",{style:{fontWeight:500,fontSize:"1.125rem"},children:"Customer Activity Report"})}),e.jsxs(t.Content,{children:[e.jsx("p",{children:"Card inner section content body. Notice how this acts as padded content natively based on the overarching properties. Recursica's vertical gutter governs vertical spacing between siblings in the flex container."}),e.jsx("p",{children:"Another section showing the vertical gutter spacing."})]}),e.jsx(t.Footer,{children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"16px",marginBottom:"8px"},children:[e.jsx("span",{style:{color:"#868e96",fontSize:"0.75rem"},children:"Generated today"}),e.jsx(U,{variant:"solid",children:"View Details"})]})})]})})},f={args:{},render:({...r})=>e.jsx(x,{layer:0,style:{padding:"48px",backgroundColor:"var(--recursica_brand_palettes_neutral_050)"},children:e.jsx(t,{...r,children:e.jsxs(t.Content,{children:[e.jsx("span",{style:{fontWeight:500,fontSize:"1.125rem"},children:"Notice"}),e.jsx("p",{children:"This is a completely generic card payload dropping the Header and Footer specific elements, simply acting as a padded elevation boundary box directly mirroring native composability!"}),e.jsx(U,{variant:"solid",mt:"rec-md",children:"Acknowledge"})]})})})},_={args:{},render:({...r})=>e.jsxs("div",{style:{display:"flex",gap:"32px",backgroundColor:"#e9ecef",padding:"32px"},children:[e.jsx(x,{layer:1,children:e.jsxs(t,{...r,children:[e.jsx(t.Header,{children:"Layer 1 Wrapper"}),e.jsx("p",{children:"Content inside layer 1 card."})]})}),e.jsx(x,{layer:2,children:e.jsxs(t,{...r,children:[e.jsx(t.Header,{children:"Layer 2 Wrapper"}),e.jsx("p",{children:"Content inside layer 2 card exposing a higher elevation drop shadow inherently cascaded."})]})})]})};var A,z,B;h.parameters={...h.parameters,docs:{...(A=h.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(B=(z=h.parameters)==null?void 0:z.docs)==null?void 0:B.source}}};var $,I,T;f.parameters={...f.parameters,docs:{...($=f.parameters)==null?void 0:$.docs,source:{originalSource:`{
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
}`,...(T=(I=f.parameters)==null?void 0:I.docs)==null?void 0:T.source}}};var W,D,M;_.parameters={..._.parameters,docs:{...(W=_.parameters)==null?void 0:W.docs,source:{originalSource:`{
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
}`,...(M=(D=_.parameters)==null?void 0:D.docs)==null?void 0:M.source}}};const ve=["Default","HeaderlessAndFooterless","LayerDemonstration"];export{h as Default,f as HeaderlessAndFooterless,_ as LayerDemonstration,ve as __namedExportsOrder,xe as default};
