import{E as r,j as e}from"./iframe-DRoZ4YwF.js";import"./preload-helper-Dp1pzeXC.js";const g={title:"UI-Kit/Layer",component:r,tags:["autodocs"],parameters:{docs:{description:{component:"`Layer` binds a subtree to one of Recursica's four elevation layers (0-3) by setting `data-recursica-layer` on its root, which scopes the surface, border, and elevation CSS variables from `recursica_variables_scoped.css` to that subtree. `RecursicaThemeProvider` wraps the app in a `layer={0}` `Layer` automatically — wrap anything visually elevated above the page background (a Card, Modal, Popover, etc.) in its own `Layer`. This story itself is already rendered inside a `Layer`; use the global `layer`/`withLayer` Story Controls to preview that outer layer, and see below for composing additional nested layers."}}},argTypes:{layer:{control:!1},contentsOnly:{control:!1},children:{control:!1}}},n={render:()=>e.jsxs("div",{style:{padding:24},children:["This content sits directly on the layer applied by the story's outer"," ",e.jsx("code",{children:"Layer"})," wrapper — use the ",e.jsx("strong",{children:"layer"})," and"," ",e.jsx("strong",{children:"withLayer"})," Story Controls to preview layers 0-3."]})},a={parameters:{docs:{description:{story:"Layers compose by nesting: wrap progressively more elevated content in its own `Layer` to move up the elevation scale. Nesting `Layer`s is how Recursica communicates elevation to descendant components — never pass a `layer` prop directly to another component."}}},render:()=>e.jsxs(r,{layer:1,style:{padding:24},children:["Layer 1",e.jsxs(r,{layer:2,style:{padding:24,marginTop:16},children:["Layer 2",e.jsx(r,{layer:3,style:{padding:24,marginTop:16},children:"Layer 3"})]})]})},t={parameters:{docs:{description:{story:"With `contentsOnly`, `Layer` renders with `display: contents` and omits `data-recursica-layer` entirely — no extra DOM box, no layer styling. Use this for a purely structural layer boundary in the component tree."}}},render:()=>e.jsx(r,{layer:1,contentsOnly:!0,children:e.jsxs("div",{style:{border:"1px dashed currentColor",padding:24},children:["This box comes from a plain child ",e.jsx("code",{children:"div"}),", not"," ",e.jsx("code",{children:"Layer"})," itself — with ",e.jsx("code",{children:"contentsOnly"}),","," ",e.jsx("code",{children:"Layer"})," renders no box of its own and applies no layer styling."]})})};var o,s,i;n.parameters={...n.parameters,docs:{...(o=n.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => <div style={{
    padding: 24
  }}>
      This content sits directly on the layer applied by the story&apos;s outer{" "}
      <code>Layer</code> wrapper — use the <strong>layer</strong> and{" "}
      <strong>withLayer</strong> Story Controls to preview layers 0-3.
    </div>
}`,...(i=(s=n.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};var d,c,l;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "Layers compose by nesting: wrap progressively more elevated content in its own \`Layer\` to move up the elevation scale. Nesting \`Layer\`s is how Recursica communicates elevation to descendant components — never pass a \`layer\` prop directly to another component."
      }
    }
  },
  render: () => <Layer layer={1} style={{
    padding: 24
  }}>
      Layer 1
      <Layer layer={2} style={{
      padding: 24,
      marginTop: 16
    }}>
        Layer 2
        <Layer layer={3} style={{
        padding: 24,
        marginTop: 16
      }}>
          Layer 3
        </Layer>
      </Layer>
    </Layer>
}`,...(l=(c=a.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var y,p,h;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: "With \`contentsOnly\`, \`Layer\` renders with \`display: contents\` and omits \`data-recursica-layer\` entirely — no extra DOM box, no layer styling. Use this for a purely structural layer boundary in the component tree."
      }
    }
  },
  render: () => <Layer layer={1} contentsOnly>
      <div style={{
      border: "1px dashed currentColor",
      padding: 24
    }}>
        This box comes from a plain child <code>div</code>, not{" "}
        <code>Layer</code> itself — with <code>contentsOnly</code>,{" "}
        <code>Layer</code> renders no box of its own and applies no layer
        styling.
      </div>
    </Layer>
}`,...(h=(p=t.parameters)==null?void 0:p.docs)==null?void 0:h.source}}};const L=["Default","NestedLayers","ContentsOnly"];export{t as ContentsOnly,n as Default,a as NestedLayers,L as __namedExportsOrder,g as default};
