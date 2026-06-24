import{j as n}from"./iframe-ET1O9uy4.js";import{R as v}from"./Radio-Bm_ASp_2.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-CxIguSHF.js";import"./ReadOnlyField-pnlGCQ3v.js";import"./AssistiveElement-CLd-wGbf.js";import"./useFormControl-D0Dq9yyH.js";import"./memoTheme-DivAIOBF.js";import"./styled-NHfFC7RQ.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./FormControlLayout-GJMygHKi.js";import"./isMuiElement-CYpP1DvT.js";import"./useControlled-C8a5y-YO.js";import"./useForkRef-B2D9i2iU.js";import"./FormGroup-Bxzi4XLq.js";import"./SwitchBase-BGYLGAeB.js";import"./useSlot-CgtNWb7u.js";import"./mergeSlotProps-DcIUA7x0.js";import"./isHostComponent-DVu5iVWx.js";import"./ButtonBase-BtEGHIx2.js";import"./useTimeout-CGMOaySK.js";import"./useEventCallback-B29ZYna7.js";import"./isFocusVisible-B8k4qzLc.js";import"./createSvgIcon-CnLQWNMH.js";import"./createChainedFunction-BO_9K8Jh.js";const Z={title:"UI-Kit/Radio",component:v,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `Radio` component represents a fundamental standalone boolean selection node mapping to the native HTML `<input type="radio">`. \n\n> [!WARNING]\n> This component represents the isolated primitive structure. If you need macro form configurations, standard vertical alignments, side-by-side array wrappers, or integrated assistive text and error borders natively, you MUST use the `<Radio.Group>` orchestrator instead!\n'}}},argTypes:{disabled:{control:"boolean"},checked:{control:"boolean"},readOnly:{control:"boolean"},error:{control:"boolean"},defaultChecked:{control:"boolean"},controlMaxWidth:{table:{disable:!0}},controlMinWidth:{table:{disable:!0}}}},e={args:{label:"Standard Radio Primitive"}},r={args:{label:"Opt-in form alignment",formLayout:"side-by-side"}},a={args:{...e.args,defaultChecked:!0}},t={args:{...e.args,disabled:!0}},o={args:{...e.args,disabled:!0,defaultChecked:!0}},s={args:{},render:()=>n.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"24px"},children:n.jsx(v,{label:"Account Type",defaultChecked:!0,readOnly:!0})})};var i,d,c;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    label: "Standard Radio Primitive"
  }
}`,...(c=(d=e.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var l,p,m;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(D=(C=s.parameters)==null?void 0:C.docs)==null?void 0:D.source}}};const $=["Default","SideBySideLayout","CheckedState","DisabledUnchecked","DisabledChecked","ReadOnly"];export{a as CheckedState,e as Default,o as DisabledChecked,t as DisabledUnchecked,s as ReadOnly,r as SideBySideLayout,$ as __namedExportsOrder,Z as default};
