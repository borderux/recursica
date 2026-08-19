import{j as e,h as P}from"./iframe-qgAhLov1.js";import{A as n}from"./Accordion-XGfe_VIY.js";import"./preload-helper-Dp1pzeXC.js";import"./get-safe-id-Bp3H8K0-.js";import"./get-size-BR1EtkiL.js";import"./factory-PwKbXirf.js";import"./create-safe-context-BzrXv_Eb.js";import"./AccordionChevron-DDayrgV2.js";import"./create-scoped-keydown-handler-CBeoUl4T.js";import"./find-element-ancestor-Cv-4bSct.js";import"./UnstyledButton-CeLKDdlV.js";import"./polymorphic-factory-CJ6CYnv0.js";import"./get-style-object-DUJZA7T_.js";import"./index-DaBnYSt1.js";import"./index-DDM7R0ID.js";import"./use-reduced-motion-zzuJNAHX.js";import"./use-merged-ref-BviAUNEG.js";import"./use-id-CKhNFr9m.js";import"./use-uncontrolled-CRPUJ7XO.js";const o=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"})}),t=()=>e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M20.0306 9.53062L12.5306 17.0306C12.461 17.1003 12.3783 17.1557 12.2872 17.1934C12.1962 17.2312 12.0986 17.2506 12 17.2506C11.9014 17.2506 11.8038 17.2312 11.7128 17.1934C11.6218 17.1557 11.539 17.1003 11.4694 17.0306L3.96938 9.53062C3.82865 9.38988 3.74959 9.19901 3.74959 8.99999C3.74959 8.80097 3.82865 8.61009 3.96938 8.46936C4.11011 8.32863 4.30098 8.24957 4.50001 8.24957C4.69903 8.24957 4.8899 8.32863 5.03063 8.46936L12 15.4397L18.9694 8.46936C19.0391 8.39968 19.1218 8.34441 19.2128 8.30669C19.3039 8.26898 19.4015 8.24957 19.5 8.24957C19.5986 8.24957 19.6961 8.26898 19.7872 8.30669C19.8782 8.34441 19.9609 8.39968 20.0306 8.46936C20.1003 8.53905 20.1556 8.62177 20.1933 8.71282C20.231 8.80386 20.2504 8.90144 20.2504 8.99999C20.2504 9.09854 20.231 9.19612 20.1933 9.28716C20.1556 9.37821 20.1003 9.46093 20.0306 9.53062Z",fill:"currentColor"})}),K={title:"UI-Kit/Accordion",component:n,tags:["autodocs"],parameters:{docs:{description:{component:"\nThe `Accordion` component intelligently wraps `@mantine/core`'s underlying Accordion layers while applying strict native design system mapping via `recursica_variables_scoped.css`.\n\n### Hybrid Composition API (Smart-Rendering)\nTo maximize flexibility while strictly aligning with the explicit Recursica design logic, the `AccordionItem` operates utilizing a **Hybrid Smart-Rendering Flow**:\n\n1. **Auto-Construction (Explicit Mapping)**:\nIf you supply the explicitly outlined Recursica properties (`title`, `leftIcon`) directly onto `<Accordion.Item>`, the component auto-generates the necessary `<Accordion.Control>` DOM layer inherently bridging the icons and titles visually while leaving the raw `children` wrapped neatly as the `<Accordion.Panel>`.\n\n2. **Graceful Falldown (Raw Composability)**:\nIf you deliberately omit the `title` property, the entire mapping system gracefully falls backward yielding exactly to the raw `@mantine/core` composition model. Under this context, you must inject your localized `<Accordion.Control>` and `<Accordion.Panel>` configurations completely manually.\n\n### Architecture Warning (`open`)\nTo structurally protect the parent wrapper's core transitions tracking architecture (`<Accordion value=\"...\">`), this configuration explicitly rejects mapping isolated `open={true}` object states natively on specific configurations. Use Mantine's inherent sibling arrays matching the corresponding active value map!\n        "}}}},i={render:()=>e.jsxs(n,{defaultValue:"item-1",chevron:e.jsx(t,{}),children:[e.jsxs(n.Item,{value:"item-1",children:[e.jsx(n.Control,{children:"Billing and Membership"}),e.jsx(n.Panel,{children:"You can manage your billing directly from the dashboard tab. All payments are processed automatically."})]}),e.jsxs(n.Item,{value:"item-2",children:[e.jsx(n.Control,{children:"Refund Policy"}),e.jsx(n.Panel,{children:"We offer a 30-day money-back guarantee for all new subscriptions."})]}),e.jsxs(n.Item,{value:"item-3",children:[e.jsx(n.Control,{children:"Technical Support"}),e.jsx(n.Panel,{children:"Our support team is available 24/7 via live chat or email."})]})]})},a={render:()=>e.jsxs(n,{defaultValue:"security",chevron:e.jsx(t,{}),children:[e.jsxs(n.Item,{value:"security",children:[e.jsx(n.Control,{leftIcon:e.jsx(o,{}),children:"Security Settings"}),e.jsx(n.Panel,{children:"Enable two-factor authentication (2FA) and monitor active sessions below."})]}),e.jsxs(n.Item,{value:"privacy",children:[e.jsx(n.Control,{leftIcon:e.jsx(o,{}),children:"Privacy Configuration"}),e.jsx(n.Panel,{children:"Choose what data is shared with our analytics partners."})]})]})},c={render:()=>e.jsx("div",{style:{maxWidth:320},children:e.jsxs(n,{defaultValue:"long-title",chevron:e.jsx(t,{}),children:[e.jsxs(n.Item,{value:"long-title",children:[e.jsx(n.Control,{leftIcon:e.jsx(o,{}),children:"This is a deliberately very long accordion item title used to verify that overflowing text truncates with a CSS ellipsis instead of wrapping or overflowing the header"}),e.jsx(n.Panel,{children:"The header label above should truncate to a single line with a trailing ellipsis (…) rather than wrapping onto multiple lines or pushing the chevron out of view."})]}),e.jsxs(n.Item,{value:"short-title",children:[e.jsx(n.Control,{leftIcon:e.jsx(o,{}),children:"Short Title"}),e.jsx(n.Panel,{children:"A short title in the same accordion for visual comparison."})]})]})})},l={render:()=>e.jsxs(n,{defaultValue:"expanded-disabled",chevron:e.jsx(t,{}),children:[e.jsxs(n.Item,{value:"expanded-disabled",disabled:!0,children:[e.jsx(n.Control,{leftIcon:e.jsx(o,{}),children:"Expanded and Disabled"}),e.jsx(n.Panel,{children:"This item starts expanded so the panel content's dimming can be verified alongside the control's, not just the collapsed header."})]}),e.jsxs(n.Item,{value:"collapsed-disabled",disabled:!0,children:[e.jsx(n.Control,{leftIcon:e.jsx(o,{}),children:"Collapsed and Disabled"}),e.jsx(n.Panel,{children:"Clicking or tabbing to this control should have no effect."})]}),e.jsxs(n.Item,{value:"enabled",children:[e.jsx(n.Control,{leftIcon:e.jsx(o,{}),children:"Enabled, for Comparison"}),e.jsx(n.Panel,{children:"A normal, interactive item alongside the disabled ones above."})]})]})},r={render:()=>e.jsx(P,{layer:1,style:{padding:"24px"},children:e.jsx(n,{defaultValue:"demo",chevron:e.jsx(t,{}),children:e.jsxs(n.Item,{value:"demo",children:[e.jsx(n.Control,{leftIcon:e.jsx(o,{}),children:"Layer 1 Render Engine"}),e.jsx(n.Panel,{children:'This Accordion dynamically updates its colors, borders, and typography variables because it is wrapped securely by the simulated `data-recursica-layer="1"`.'})]})})})};var s,d,h;i.parameters={...i.parameters,docs:{...(s=i.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => {
    return <Accordion defaultValue="item-1" chevron={<ChevronIcon />}>
        <Accordion.Item value="item-1">
          <Accordion.Control>Billing and Membership</Accordion.Control>
          <Accordion.Panel>
            You can manage your billing directly from the dashboard tab. All
            payments are processed automatically.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="item-2">
          <Accordion.Control>Refund Policy</Accordion.Control>
          <Accordion.Panel>
            We offer a 30-day money-back guarantee for all new subscriptions.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="item-3">
          <Accordion.Control>Technical Support</Accordion.Control>
          <Accordion.Panel>
            Our support team is available 24/7 via live chat or email.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>;
  }
}`,...(h=(d=i.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var p,u,m;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => {
    return <Accordion defaultValue="security" chevron={<ChevronIcon />}>
        <Accordion.Item value="security">
          <Accordion.Control leftIcon={<SVGIcon />}>
            Security Settings
          </Accordion.Control>
          <Accordion.Panel>
            Enable two-factor authentication (2FA) and monitor active sessions
            below.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="privacy">
          <Accordion.Control leftIcon={<SVGIcon />}>
            Privacy Configuration
          </Accordion.Control>
          <Accordion.Panel>
            Choose what data is shared with our analytics partners.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>;
  }
}`,...(m=(u=a.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var A,y,v;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => {
    return (
      // \`style\` is stripped from Accordion itself (only passes through with overStyled);
      // constrain width on a plain wrapper div instead to force truncation.
      <div style={{
        maxWidth: 320
      }}>
        <Accordion defaultValue="long-title" chevron={<ChevronIcon />}>
          <Accordion.Item value="long-title">
            <Accordion.Control leftIcon={<SVGIcon />}>
              This is a deliberately very long accordion item title used to
              verify that overflowing text truncates with a CSS ellipsis instead
              of wrapping or overflowing the header
            </Accordion.Control>
            <Accordion.Panel>
              The header label above should truncate to a single line with a
              trailing ellipsis (…) rather than wrapping onto multiple lines or
              pushing the chevron out of view.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="short-title">
            <Accordion.Control leftIcon={<SVGIcon />}>
              Short Title
            </Accordion.Control>
            <Accordion.Panel>
              A short title in the same accordion for visual comparison.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    );
  }
}`,...(v=(y=c.parameters)==null?void 0:y.docs)==null?void 0:v.source}}};var g,x,f;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    return <Accordion defaultValue="expanded-disabled" chevron={<ChevronIcon />}>
        <Accordion.Item value="expanded-disabled" disabled>
          <Accordion.Control leftIcon={<SVGIcon />}>
            Expanded and Disabled
          </Accordion.Control>
          <Accordion.Panel>
            This item starts expanded so the panel content's dimming can be
            verified alongside the control's, not just the collapsed header.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="collapsed-disabled" disabled>
          <Accordion.Control leftIcon={<SVGIcon />}>
            Collapsed and Disabled
          </Accordion.Control>
          <Accordion.Panel>
            Clicking or tabbing to this control should have no effect.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="enabled">
          <Accordion.Control leftIcon={<SVGIcon />}>
            Enabled, for Comparison
          </Accordion.Control>
          <Accordion.Panel>
            A normal, interactive item alongside the disabled ones above.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>;
  }
}`,...(f=(x=l.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var C,I,b,j,w;r.parameters={...r.parameters,docs:{...(C=r.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    return <Layer layer={1} style={{
      padding: "24px"
    }}>
        <Accordion defaultValue="demo" chevron={<ChevronIcon />}>
          <Accordion.Item value="demo">
            <Accordion.Control leftIcon={<SVGIcon />}>
              Layer 1 Render Engine
            </Accordion.Control>
            <Accordion.Panel>
              This Accordion dynamically updates its colors, borders, and
              typography variables because it is wrapped securely by the
              simulated \`data-recursica-layer="1"\`.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Layer>;
  }
}`,...(b=(I=r.parameters)==null?void 0:I.docs)==null?void 0:b.source},description:{story:"Demonstrates the component nested inside a non-default layer — the one case where an\nexplicit `<Layer>` wrap belongs in a story (see COMPONENT_STORYBOOK_GUIDE.md §9).",...(w=(j=r.parameters)==null?void 0:j.docs)==null?void 0:w.description}}};const N=["Default","WithIcons","LongTitleTruncation","Disabled","LayerOne"];export{i as Default,l as Disabled,r as LayerOne,c as LongTitleTruncation,a as WithIcons,N as __namedExportsOrder,K as default};
