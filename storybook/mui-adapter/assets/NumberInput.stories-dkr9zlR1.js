import{j as e}from"./iframe-D5u_GhV6.js";import{N as r}from"./NumberInput-C1AhBLcS.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-dEG4FIZB.js";import"./FormControlWrapper-BzGJG4SE.js";import"./AssistiveElement-BteGdmVf.js";import"./useFormControl-7HgDxFsV.js";import"./memoTheme-CONLaS4L.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./isMuiElement-rpaVwNAE.js";import"./ReadOnlyField-Bw4zmJxb.js";import"./TextField-BCJrHYM6.js";import"./useSlot-Cq_GXAua.js";import"./mergeSlotProps-BtnXkuA1.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-DjBk-GzP.js";import"./Select-BjwqAeo3.js";import"./SelectFocusSourceContext-h2s3xRHN.js";import"./useSlotProps-Die3mruG.js";import"./Paper-DYWg6Wwb.js";import"./useTheme-BYVcVuII.js";import"./ownerDocument-DW-IO8s5.js";import"./ownerWindow-HkKU3E4x.js";import"./debounce-Be36O1Ab.js";import"./Grow-B_Ll-LMv.js";import"./utils-CsRqNuDT.js";import"./useTimeout-DtK1lABC.js";import"./index-Fqsez_Os.js";import"./index-S2SxEkQS.js";import"./Portal-BJRKsHAf.js";import"./mergeSlotProps-BrqjKZ7P.js";import"./Modal-BxwLyLm4.js";import"./useEventCallback-BDaGIMCY.js";import"./createChainedFunction-BO_9K8Jh.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./List-C9jamxdZ.js";import"./useControlled-DkNhGGvA.js";import"./createSvgIcon-C4-MYkNc.js";import"./InputBase-tCrgMMdr.js";const ue={title:"UI-Kit/NumberInput",component:r,tags:["autodocs"],argTypes:{label:{control:"text"},assistiveText:{control:"text"},disabled:{control:"boolean"},error:{control:"boolean"},readOnly:{control:"boolean"},required:{control:"boolean"},hideControls:{control:"boolean"},formLayout:{control:"select",options:["stacked","side-by-side"]},labelSize:{control:"select",options:["small","default","large"]},assistiveWithIcon:{table:{disable:!0}},labelOptionalText:{table:{disable:!0}},labelWithEditIcon:{table:{disable:!0}},onLabelEditClick:{table:{disable:!0}},emptyValueComponent:{table:{disable:!0}}}},t={args:{label:"Amount",placeholder:"Enter an amount",assistiveText:"Must be greater than 0",defaultValue:10,min:0,max:100}},o={args:{...t.args,formLayout:"side-by-side"}},a={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:400},children:[e.jsx(r,{label:"Default",placeholder:"Enter a number"}),e.jsx(r,{label:"Disabled",placeholder:"Disabled input",disabled:!0}),e.jsx(r,{label:"Error",placeholder:"Error state",error:!0}),e.jsx(r,{label:"Read Only",value:42,readOnly:!0}),e.jsx(r,{label:"Required",required:!0})]})},l={args:{label:"Price",placeholder:"0.00",leftSection:e.jsx("span",{children:"$"})}},n={args:{label:"Percentage",placeholder:"0",rightSection:e.jsx("span",{children:"%"}),hideControls:!0}},s={args:{label:"Zip Code",placeholder:"Enter zip code",hideControls:!0}};var i,p,d;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    label: "Amount",
    placeholder: "Enter an amount",
    assistiveText: "Must be greater than 0",
    defaultValue: 10,
    min: 0,
    max: 100
  }
}`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var c,m,u;o.parameters={...o.parameters,docs:{...(c=o.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    formLayout: "side-by-side"
  }
}`,...(u=(m=o.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var b,h,g;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: 400
  }}>
      <NumberInput label="Default" placeholder="Enter a number" />
      <NumberInput label="Disabled" placeholder="Disabled input" disabled />
      <NumberInput label="Error" placeholder="Error state" error />
      <NumberInput label="Read Only" value={42} readOnly />
      <NumberInput label="Required" required />
    </div>
}`,...(g=(h=a.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var x,f,y;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: "Price",
    placeholder: "0.00",
    leftSection: <span>$</span>
  }
}`,...(y=(f=l.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var S,E,I;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    label: "Percentage",
    placeholder: "0",
    rightSection: <span>%</span>,
    hideControls: true // Typically hiding controls if rightSection is occupied
  }
}`,...(I=(E=n.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};var C,D,j;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: "Zip Code",
    placeholder: "Enter zip code",
    hideControls: true
  }
}`,...(j=(D=s.parameters)==null?void 0:D.docs)==null?void 0:j.source}}};const be=["Default","SideBySideLayout","States","WithLeftIcon","WithRightIcon","HiddenControls"];export{t as Default,s as HiddenControls,o as SideBySideLayout,a as States,l as WithLeftIcon,n as WithRightIcon,be as __namedExportsOrder,ue as default};
