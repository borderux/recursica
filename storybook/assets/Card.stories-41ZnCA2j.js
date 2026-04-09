import{j as e,r as u}from"./iframe-uF_HBlgp.js";import{f as g}from"./filterStylingProps-Cd5Jg4Cp.js";import{e as K}from"./get-size-CyTqK_sX.js";import{u as D,B as O,b as J,c as Q}from"./factory-DPW3mWUw.js";import{p as E}from"./polymorphic-factory-CALd9GjX.js";import{P as X}from"./Paper-CMHv7QA8.js";import{c as Z}from"./create-safe-context-D44SXTJh.js";import{T as _}from"./adapter-common-DIDtRk04.js";import{B as M}from"./Button-BWH_iwDD.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DhE6XSEx.js";import"./index-D4CAGBdm.js";import"./use-reduced-motion-A6jGeq3U.js";import"./UnstyledButton-BeKfx2Cj.js";const[Y,ee]=Z("Card component was not found in tree");var j={root:"m_e615b15f",section:"m_599a2148"};const w=E((a,s)=>{const d=D("CardSection",null,a),{classNames:i,className:t,style:n,styles:c,vars:y,withBorder:p,inheritPadding:l,mod:P,...N}=d,S=ee();return e.jsx(O,{ref:s,mod:[{"with-border":p,"inherit-padding":l},P],...S.getStyles("section",{className:t,style:n,styles:c,classNames:i}),...N})});w.classes=j;w.displayName="@mantine/core/CardSection";const ae=Q((a,{padding:s})=>({root:{"--card-padding":K(s)}})),m=E((a,s)=>{const d=D("Card",null,a),{classNames:i,className:t,style:n,styles:c,unstyled:y,vars:p,children:l,padding:P,attributes:N,...S}=d,H=J({name:"Card",props:d,classes:j,className:t,style:n,classNames:i,styles:c,unstyled:y,attributes:N,vars:p,varsResolver:ae}),L=u.Children.toArray(l),G=L.map((f,k)=>typeof f=="object"&&f&&"type"in f&&f.type===w?u.cloneElement(f,{"data-first-section":k===0||void 0,"data-last-section":k===L.length-1||void 0}):f);return e.jsx(Y,{value:{getStyles:H},children:e.jsx(X,{ref:s,unstyled:y,...H("root"),...S,children:G})})});m.classes=j;m.displayName="@mantine/core/Card";m.Section=w;const ne="Card-module__root___c9KvZ",re="Card-module__header___PTXf2",te="Card-module__footer___Mu-JC",se="Card-module__section___BRT8H",de="Card-module__content___oFIQa",o={root:ne,header:re,footer:te,section:se,content:de},U=u.forwardRef(function({overStyled:s=!1,...d},i){const t=g(d,s),n={root:o.root},c=t.classNames;if(c&&typeof c=="object"&&!Array.isArray(c)){const p=c;Object.keys(p).forEach(l=>{n[l]?n[l]=`${n[l]} ${p[l]}`:n[l]=p[l]})}const y=t.className;return e.jsx(m,{ref:i,className:y,classNames:n,...t})});U.displayName="Card";const v=u.forwardRef(function({overStyled:s=!1,...d},i){const t=g(d,s),n=t.className;return e.jsx(m.Section,{ref:i,className:n?`${o.section} ${n}`:o.section,...t})});v.displayName="CardSection";const x=u.forwardRef(function({overStyled:s=!1,...d},i){const t=g(d,s),n=t.className;return e.jsx(m.Section,{ref:i,className:n?`${o.header} ${n}`:o.header,...t})});x.displayName="CardHeader";const V=u.forwardRef(function({overStyled:s=!1,...d},i){const t=g(d,s),n=t.className;return e.jsx(m.Section,{ref:i,className:n?`${o.footer} ${n}`:o.footer,...t})});V.displayName="CardFooter";const q=u.forwardRef(function({overStyled:s=!1,...d},i){const t=g(d,s),n=t.className;return e.jsx("div",{ref:i,className:n?`${o.content} ${n}`:o.content,...t})});q.displayName="CardContent";const r=U;r.Section=v;r.Header=x;r.Footer=V;r.Content=q;try{v.displayName="CardSection",v.__docgenInfo={description:"A generalized edge-to-edge structural wrapper native to Mantine. Strips typical boundary padding via negative margins to allow content (like maps or header images) to touch the border seamlessly.",displayName:"CardSection",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{bdw:{defaultValue:null,description:"",name:"bdw",required:!1,tags:{},type:{name:"undefined"}},bds:{defaultValue:null,description:"",name:"bds",required:!1,tags:{},type:{name:"undefined"}},bdc:{defaultValue:null,description:"",name:"bdc",required:!1,tags:{},type:{name:"undefined"}},bdr:{defaultValue:null,description:"",name:"bdr",required:!1,tags:{},type:{name:"undefined"}},shadow:{defaultValue:null,description:"",name:"shadow",required:!1,tags:{},type:{name:"undefined"}},overStyled:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"},{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"}],description:"",name:"overStyled",required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}try{x.displayName="CardHeader",x.__docgenInfo={description:"Replaces standard generic Mantine `<Card.Section>` wrappers by directly injecting the strict Recursica design tokens for header sizing, background drops, and intrinsic padding limits.",displayName:"CardHeader",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{bdw:{defaultValue:null,description:"",name:"bdw",required:!1,tags:{},type:{name:"undefined"}},bds:{defaultValue:null,description:"",name:"bds",required:!1,tags:{},type:{name:"undefined"}},bdc:{defaultValue:null,description:"",name:"bdc",required:!1,tags:{},type:{name:"undefined"}},bdr:{defaultValue:null,description:"",name:"bdr",required:!1,tags:{},type:{name:"undefined"}},shadow:{defaultValue:null,description:"",name:"shadow",required:!1,tags:{},type:{name:"undefined"}},overStyled:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"},{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"}],description:"",name:"overStyled",required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}try{V.displayName="CardFooter",V.__docgenInfo={description:"Counterpart to `Card.Header`, applying specific footer elevation margins, sizes, and padding natively.",displayName:"CardFooter",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{bdw:{defaultValue:null,description:"",name:"bdw",required:!1,tags:{},type:{name:"undefined"}},bds:{defaultValue:null,description:"",name:"bds",required:!1,tags:{},type:{name:"undefined"}},bdc:{defaultValue:null,description:"",name:"bdc",required:!1,tags:{},type:{name:"undefined"}},bdr:{defaultValue:null,description:"",name:"bdr",required:!1,tags:{},type:{name:"undefined"}},shadow:{defaultValue:null,description:"",name:"shadow",required:!1,tags:{},type:{name:"undefined"}},overStyled:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"},{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"}],description:"",name:"overStyled",required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}try{q.displayName="CardContent",q.__docgenInfo={description:"Internal container that safely binds typography and structural flex gaps driven by the active UI kit tokens natively, preserving correct padding blocks compared to rigid `Card.Section` edges.",displayName:"CardContent",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{classNames:{defaultValue:null,description:"",name:"classNames",required:!1,tags:{},type:{name:"undefined"}},styles:{defaultValue:null,description:"",name:"styles",required:!1,tags:{},type:{name:"undefined"}},vars:{defaultValue:null,description:"",name:"vars",required:!1,tags:{},type:{name:"undefined"}},p:{defaultValue:null,description:"",name:"p",required:!1,tags:{},type:{name:"undefined"}},px:{defaultValue:null,description:"",name:"px",required:!1,tags:{},type:{name:"undefined"}},py:{defaultValue:null,description:"",name:"py",required:!1,tags:{},type:{name:"undefined"}},pt:{defaultValue:null,description:"",name:"pt",required:!1,tags:{},type:{name:"undefined"}},pb:{defaultValue:null,description:"",name:"pb",required:!1,tags:{},type:{name:"undefined"}},pl:{defaultValue:null,description:"",name:"pl",required:!1,tags:{},type:{name:"undefined"}},pr:{defaultValue:null,description:"",name:"pr",required:!1,tags:{},type:{name:"undefined"}},bg:{defaultValue:null,description:"",name:"bg",required:!1,tags:{},type:{name:"undefined"}},c:{defaultValue:null,description:"",name:"c",required:!1,tags:{},type:{name:"undefined"}},opacity:{defaultValue:null,description:"",name:"opacity",required:!1,tags:{},type:{name:"undefined"}},ff:{defaultValue:null,description:"",name:"ff",required:!1,tags:{},type:{name:"undefined"}},fz:{defaultValue:null,description:"",name:"fz",required:!1,tags:{},type:{name:"undefined"}},fw:{defaultValue:null,description:"",name:"fw",required:!1,tags:{},type:{name:"undefined"}},lts:{defaultValue:null,description:"",name:"lts",required:!1,tags:{},type:{name:"undefined"}},ta:{defaultValue:null,description:"",name:"ta",required:!1,tags:{},type:{name:"undefined"}},lh:{defaultValue:null,description:"",name:"lh",required:!1,tags:{},type:{name:"undefined"}},fs:{defaultValue:null,description:"",name:"fs",required:!1,tags:{},type:{name:"undefined"}},tt:{defaultValue:null,description:"",name:"tt",required:!1,tags:{},type:{name:"undefined"}},td:{defaultValue:null,description:"",name:"td",required:!1,tags:{},type:{name:"undefined"}},bd:{defaultValue:null,description:"",name:"bd",required:!1,tags:{},type:{name:"undefined"}},bdw:{defaultValue:null,description:"",name:"bdw",required:!1,tags:{},type:{name:"undefined"}},bds:{defaultValue:null,description:"",name:"bds",required:!1,tags:{},type:{name:"undefined"}},bdc:{defaultValue:null,description:"",name:"bdc",required:!1,tags:{},type:{name:"undefined"}},bdr:{defaultValue:null,description:"",name:"bdr",required:!1,tags:{},type:{name:"undefined"}},shadow:{defaultValue:null,description:"",name:"shadow",required:!1,tags:{},type:{name:"undefined"}},w:{defaultValue:null,description:"",name:"w",required:!1,tags:{},type:{name:"undefined"}},miw:{defaultValue:null,description:"",name:"miw",required:!1,tags:{},type:{name:"undefined"}},maw:{defaultValue:null,description:"",name:"maw",required:!1,tags:{},type:{name:"undefined"}},h:{defaultValue:null,description:"",name:"h",required:!1,tags:{},type:{name:"undefined"}},mih:{defaultValue:null,description:"",name:"mih",required:!1,tags:{},type:{name:"undefined"}},mah:{defaultValue:null,description:"",name:"mah",required:!1,tags:{},type:{name:"undefined"}},overStyled:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"},{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"}],description:"",name:"overStyled",required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}try{r.displayName="Card",r.__docgenInfo={description:"",displayName:"Card",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Card/Card.tsx",methods:[],props:{bdw:{defaultValue:null,description:"",name:"bdw",required:!1,tags:{},type:{name:"undefined"}},bds:{defaultValue:null,description:"",name:"bds",required:!1,tags:{},type:{name:"undefined"}},bdc:{defaultValue:null,description:"",name:"bdc",required:!1,tags:{},type:{name:"undefined"}},bdr:{defaultValue:null,description:"",name:"bdr",required:!1,tags:{},type:{name:"undefined"}},overStyled:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"},{fileName:"mantine-adapter/src/utils/filterStylingProps.ts",name:"TypeLiteral"}],description:"",name:"overStyled",required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const ve={title:"UI-Kit/Card",component:r,subcomponents:{"Card.Header":r.Header,"Card.Content":r.Content,"Card.Footer":r.Footer,"Card.Section":r.Section},tags:["autodocs"],parameters:{docs:{description:{component:"The Card component acts as the foundational padded surface for grouping related information. It relies on standard internal compositional nodes (`Card.Header`, `Card.Content`, `Card.Footer`) mapped directly to the active Recursica design tokens to enforce layout gaps and margins seamlessly. Use the provided dot-notation wrappers rather than building ad-hoc generic sections."}}},argTypes:{}},h={args:{},render:({...a})=>e.jsx(_,{layer:0,style:{padding:"48px",backgroundColor:"var(--recursica_brand_palettes_neutral_050)"},children:e.jsxs(r,{...a,children:[e.jsx(r.Header,{children:e.jsx("span",{style:{fontWeight:500,fontSize:"1.125rem"},children:"Customer Activity Report"})}),e.jsxs(r.Content,{children:[e.jsx("p",{children:"Card inner section content body. Notice how this acts as padded content natively based on the overarching properties. Recursica's vertical gutter governs vertical spacing between siblings in the flex container."}),e.jsx("p",{children:"Another section showing the vertical gutter spacing."})]}),e.jsx(r.Footer,{children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"16px",marginBottom:"8px"},children:[e.jsx("span",{style:{color:"#868e96",fontSize:"0.75rem"},children:"Generated today"}),e.jsx(M,{variant:"solid",children:"View Details"})]})})]})})},C={args:{},render:({...a})=>e.jsx(_,{layer:0,style:{padding:"48px",backgroundColor:"var(--recursica_brand_palettes_neutral_050)"},children:e.jsx(r,{...a,children:e.jsxs(r.Content,{children:[e.jsx("span",{style:{fontWeight:500,fontSize:"1.125rem"},children:"Notice"}),e.jsx("p",{children:"This is a completely generic card payload dropping the Header and Footer specific elements, simply acting as a padded elevation boundary box directly mirroring native composability!"}),e.jsx(M,{variant:"solid",mt:"rec-md",children:"Acknowledge"})]})})})},b={args:{},render:({...a})=>e.jsxs("div",{style:{display:"flex",gap:"32px",backgroundColor:"#e9ecef",padding:"32px"},children:[e.jsx(_,{layer:1,children:e.jsxs(r,{...a,children:[e.jsx(r.Header,{children:"Layer 1 Wrapper"}),e.jsx("p",{children:"Content inside layer 1 card."})]})}),e.jsx(_,{layer:2,children:e.jsxs(r,{...a,children:[e.jsx(r.Header,{children:"Layer 2 Wrapper"}),e.jsx("p",{children:"Content inside layer 2 card exposing a higher elevation drop shadow inherently cascaded."})]})})]})};var T,F,z;h.parameters={...h.parameters,docs:{...(T=h.parameters)==null?void 0:T.docs,source:{originalSource:`{
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
}`,...(z=(F=h.parameters)==null?void 0:F.docs)==null?void 0:z.source}}};var R,B,A;C.parameters={...C.parameters,docs:{...(R=C.parameters)==null?void 0:R.docs,source:{originalSource:`{
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
}`,...(A=(B=C.parameters)==null?void 0:B.docs)==null?void 0:A.source}}};var I,$,W;b.parameters={...b.parameters,docs:{...(I=b.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
}`,...(W=($=b.parameters)==null?void 0:$.docs)==null?void 0:W.source}}};const xe=["Default","HeaderlessAndFooterless","LayerDemonstration"];export{h as Default,C as HeaderlessAndFooterless,b as LayerDemonstration,xe as __namedExportsOrder,ve as default};
