import{j as e}from"./iframe-C_ymJL69.js";import{N as r}from"./NumberInput-DInCmaRh.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-CTB5FDTb.js";import"./ReadOnlyField-CmK4Xprm.js";import"./AssistiveElement-BX1CLCG3.js";import"./useFormControl-CCBjUjcD.js";import"./memoTheme-DuK-uO2q.js";import"./styled-CVDphjR5.js";import"./generateUtilityClass-BtcU_pBl.js";import"./generateUtilityClasses-DDbjFgb8.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./FormControlLayout-CxLXgHi1.js";import"./isMuiElement-DGxPhrgs.js";import"./TextField-DCE4PgFI.js";import"./useSlot-da_fafqN.js";import"./mergeSlotProps-NJnF42jJ.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-BlrSiLQa.js";import"./Select-DQLN_zYj.js";import"./Menu-Ds0zM-56.js";import"./useSlotProps-CdVKbq8r.js";import"./Popover-DNYZe25T.js";import"./ownerDocument-DW-IO8s5.js";import"./ownerWindow-HkKU3E4x.js";import"./Grow-ChS_8--H.js";import"./useTheme-CMzaj5Wq.js";import"./utils-D7EB2s5D.js";import"./useTimeout-0m_RpfT3.js";import"./index-D45m0UCw.js";import"./index-BrMYl9zD.js";import"./getReactElementRef-DmRxRqpB.js";import"./mergeSlotProps-DbhufgKY.js";import"./debounce-Be36O1Ab.js";import"./Modal-BomGTVSP.js";import"./useEventCallback-guZE-voT.js";import"./createChainedFunction-BO_9K8Jh.js";import"./Portal-AIsFAjF3.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./Paper-CMrUORMw.js";import"./useControlled-XnJ3kiQa.js";import"./createSvgIcon-CPkIi2au.js";import"./InputBase-eM2MzAVe.js";const ge={title:"UI-Kit/NumberInput",component:r,tags:["autodocs"],argTypes:{label:{control:"text"},assistiveText:{control:"text"},disabled:{control:"boolean"},error:{control:"boolean"},readOnly:{control:"boolean"},required:{control:"boolean"},hideControls:{control:"boolean"},formLayout:{control:"select",options:["stacked","side-by-side"]},labelSize:{control:"select",options:["small","default","large"]},checked:{table:{disable:!0}},defaultChecked:{table:{disable:!0}},assistiveWithIcon:{table:{disable:!0}},labelOptionalText:{table:{disable:!0}},labelWithEditIcon:{table:{disable:!0}},onLabelEditClick:{table:{disable:!0}},emptyValueComponent:{table:{disable:!0}}}},t={args:{label:"Amount",placeholder:"Enter an amount",assistiveText:"Must be greater than 0",defaultValue:10,min:0,max:100}},o={args:{...t.args,formLayout:"side-by-side"}},a={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:400},children:[e.jsx(r,{label:"Default",placeholder:"Enter a number"}),e.jsx(r,{label:"Disabled",placeholder:"Disabled input",disabled:!0}),e.jsx(r,{label:"Error",placeholder:"Error state",error:!0}),e.jsx(r,{label:"Read Only",value:42,readOnly:!0}),e.jsx(r,{label:"Required",required:!0})]})},l={args:{label:"Price",placeholder:"0.00",leftSection:e.jsx("span",{children:"$"})}},i={args:{label:"Percentage",placeholder:"0",rightSection:e.jsx("span",{children:"%"}),hideControls:!0}},n={args:{label:"Zip Code",placeholder:"Enter zip code",hideControls:!0}};var s,p,d;t.parameters={...t.parameters,docs:{...(s=t.parameters)==null?void 0:s.docs,source:{originalSource:`{
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
}`,...(y=(f=l.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var S,E,I;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    label: "Percentage",
    placeholder: "0",
    rightSection: <span>%</span>,
    hideControls: true // Typically hiding controls if rightSection is occupied
  }
}`,...(I=(E=i.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};var C,D,j;n.parameters={...n.parameters,docs:{...(C=n.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: "Zip Code",
    placeholder: "Enter zip code",
    hideControls: true
  }
}`,...(j=(D=n.parameters)==null?void 0:D.docs)==null?void 0:j.source}}};const xe=["Default","SideBySideLayout","States","WithLeftIcon","WithRightIcon","HiddenControls"];export{t as Default,n as HiddenControls,o as SideBySideLayout,a as States,l as WithLeftIcon,i as WithRightIcon,xe as __namedExportsOrder,ge as default};
