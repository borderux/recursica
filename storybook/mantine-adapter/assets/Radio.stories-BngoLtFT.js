import{j as n}from"./iframe-BddUskqo.js";import{R as v}from"./Radio-lIrC61dp.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-CUNta2aS.js";import"./ReadOnlyField-BUyHCQbv.js";import"./get-size-D6NM-3-T.js";import"./factory-CvawFnU2.js";import"./polymorphic-factory-htL0-wIS.js";import"./create-optional-context-DWcZ-Trh.js";import"./use-resolved-styles-api--I-5TNCE.js";import"./CloseButton-a_V5wulq.js";import"./UnstyledButton-Cpkh_G9M.js";import"./use-id-BZWRHC0D.js";import"./AssistiveElement-CLEetnsG.js";import"./get-auto-contrast-value-Da6zqqWm.js";import"./InputsGroupFieldset-CoXUhe9u.js";import"./DirectionProvider-DjTUUivo.js";import"./use-uncontrolled-CF5v_IMa.js";const q={title:"UI-Kit/Radio",component:v,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `Radio` component represents a fundamental standalone boolean selection node mapping to the native HTML `<input type="radio">`. \n\n> [!WARNING]\n> This component represents the isolated primitive structure. If you need macro form configurations, standard vertical alignments, side-by-side array wrappers, or integrated assistive text and error borders natively, you MUST use the `<Radio.Group>` orchestrator instead!\n'}}},argTypes:{checked:{control:"boolean"},readOnly:{control:"boolean"},error:{control:"boolean"},defaultChecked:{control:"boolean"},controlMaxWidth:{table:{disable:!0}},controlMinWidth:{table:{disable:!0}}}},e={args:{label:"Standard Radio Primitive"}},r={args:{label:"Opt-in form alignment",formLayout:"side-by-side"}},a={args:{...e.args,defaultChecked:!0}},t={args:{...e.args,disabled:!0}},o={args:{...e.args,disabled:!0,defaultChecked:!0}},s={args:{},render:()=>n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:n.jsx(v,{label:"Account Type",defaultChecked:!0,readOnly:!0})})};var d,i,c;e.parameters={...e.parameters,docs:{...(d=e.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    label: "Standard Radio Primitive"
  }
}`,...(c=(i=e.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var l,p,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    label: "Opt-in form alignment",
    formLayout: "side-by-side"
  }
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,g,b;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    defaultChecked: true
  }
}`,...(b=(g=a.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var f,y,h;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    disabled: true
  }
}`,...(h=(y=t.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var S,k,x;o.parameters={...o.parameters,docs:{...(S=o.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    disabled: true,
    defaultChecked: true
  }
}`,...(x=(k=o.parameters)==null?void 0:k.docs)==null?void 0:x.source}}};var R,C,D;s.parameters={...s.parameters,docs:{...(R=s.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {},
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  }}>
      <Radio label="Account Type" defaultChecked readOnly />
    </div>
}`,...(D=(C=s.parameters)==null?void 0:C.docs)==null?void 0:D.source}}};const z=["Default","SideBySideLayout","CheckedState","DisabledUnchecked","DisabledChecked","ReadOnly"];export{a as CheckedState,e as Default,o as DisabledChecked,t as DisabledUnchecked,s as ReadOnly,r as SideBySideLayout,z as __namedExportsOrder,q as default};
