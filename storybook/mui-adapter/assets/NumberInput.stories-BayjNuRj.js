import{j as e}from"./iframe-CqEvCq27.js";import{N as r}from"./NumberInput-Cp8KBjxK.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-DqijJux_.js";import"./FormControlWrapper-BSWfzX9G.js";import"./AssistiveElement-DGVD2-0X.js";import"./useFormControl-Ba_AnmWx.js";import"./memoTheme-DMteGlQF.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./isMuiElement-B8Reh3hG.js";import"./ReadOnlyField-D2B-TmyI.js";import"./TextField-DBXp85NK.js";import"./useSlot-DbvkDvym.js";import"./mergeSlotProps-DhF3Vw9c.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-CLZshriB.js";import"./Select-CuWDWt7D.js";import"./SelectFocusSourceContext-BGffmy7d.js";import"./useSlotProps-BULxjZYd.js";import"./Paper-D-flQ6oN.js";import"./useTheme-DzlThaUU.js";import"./ownerDocument-DW-IO8s5.js";import"./ownerWindow-HkKU3E4x.js";import"./debounce-Be36O1Ab.js";import"./Grow-CTQXXIPy.js";import"./utils-D56xGVHy.js";import"./useTimeout-zC6s4f3f.js";import"./index-BhM39WyT.js";import"./index-CfcGENXS.js";import"./Portal-DWpGcBVQ.js";import"./mergeSlotProps-lKCLkmgo.js";import"./Modal-DdZlw6f3.js";import"./useEventCallback-CFPGKzHG.js";import"./createChainedFunction-BO_9K8Jh.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./useControlled-Cg88zTza.js";import"./createSvgIcon-CuBUxuSC.js";import"./InputBase-BWk_hLF2.js";const me={title:"UI-Kit/NumberInput",component:r,tags:["autodocs"],argTypes:{label:{control:"text"},assistiveText:{control:"text"},disabled:{control:"boolean"},error:{control:"boolean"},readOnly:{control:"boolean"},required:{control:"boolean"},hideControls:{control:"boolean"},formLayout:{control:"select",options:["stacked","side-by-side"]},labelSize:{control:"select",options:["small","default","large"]},assistiveWithIcon:{table:{disable:!0}},labelOptionalText:{table:{disable:!0}},labelWithEditIcon:{table:{disable:!0}},onLabelEditClick:{table:{disable:!0}},emptyValueComponent:{table:{disable:!0}}}},t={args:{label:"Amount",placeholder:"Enter an amount",assistiveText:"Must be greater than 0",defaultValue:10,min:0,max:100}},o={args:{...t.args,formLayout:"side-by-side"}},a={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:400},children:[e.jsx(r,{label:"Default",placeholder:"Enter a number"}),e.jsx(r,{label:"Disabled",placeholder:"Disabled input",disabled:!0}),e.jsx(r,{label:"Error",placeholder:"Error state",error:!0}),e.jsx(r,{label:"Read Only",value:42,readOnly:!0}),e.jsx(r,{label:"Required",required:!0})]})},l={args:{label:"Price",placeholder:"0.00",leftSection:e.jsx("span",{children:"$"})}},n={args:{label:"Percentage",placeholder:"0",rightSection:e.jsx("span",{children:"%"}),hideControls:!0}},s={args:{label:"Zip Code",placeholder:"Enter zip code",hideControls:!0}};var i,p,d;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(j=(D=s.parameters)==null?void 0:D.docs)==null?void 0:j.source}}};const ue=["Default","SideBySideLayout","States","WithLeftIcon","WithRightIcon","HiddenControls"];export{t as Default,s as HiddenControls,o as SideBySideLayout,a as States,l as WithLeftIcon,n as WithRightIcon,ue as __namedExportsOrder,me as default};
