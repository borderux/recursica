import{j as e}from"./iframe-CE_LlejV.js";import{N as r}from"./NumberInput-BEt8Aj5c.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-CK7x79gH.js";import"./ReadOnlyField-0Isid4W7.js";import"./get-size-C83oZ-QB.js";import"./factory-BncmibqV.js";import"./polymorphic-factory-C2wrZH1O.js";import"./create-optional-context-DC-zk7Vz.js";import"./use-resolved-styles-api-D-7VpL3n.js";import"./CloseButton-B4db9Z8Z.js";import"./UnstyledButton-8-WhFMQf.js";import"./use-id-C9bbnVWb.js";import"./AssistiveElement-pMnpWDZf.js";import"./InputBase-YKGLIhZ6.js";import"./use-input-props-D-OlhoH2.js";import"./use-uncontrolled-0xYoDpRb.js";import"./use-merged-ref-h-rj-TRM.js";import"./clamp-DTmYCdls.js";const K={title:"UI-Kit/NumberInput",component:r,tags:["autodocs"],argTypes:{label:{control:"text"},assistiveText:{control:"text"},disabled:{control:"boolean"},error:{control:"boolean"},readOnly:{control:"boolean"},required:{control:"boolean"},hideControls:{control:"boolean"},formLayout:{control:"select",options:["stacked","side-by-side"]},labelSize:{control:"select",options:["small","default","large"]},checked:{table:{disable:!0}},defaultChecked:{table:{disable:!0}},assistiveWithIcon:{table:{disable:!0}},labelOptionalText:{table:{disable:!0}},labelWithEditIcon:{table:{disable:!0}},onLabelEditClick:{table:{disable:!0}},emptyValueComponent:{table:{disable:!0}}}},a={args:{label:"Amount",placeholder:"Enter an amount",assistiveText:"Must be greater than 0",defaultValue:10,min:0,max:100}},t={args:{...a.args,formLayout:"side-by-side"}},o={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"1rem",maxWidth:400},children:[e.jsx(r,{label:"Default",placeholder:"Enter a number"}),e.jsx(r,{label:"Disabled",placeholder:"Disabled input",disabled:!0}),e.jsx(r,{label:"Error",placeholder:"Error state",error:!0}),e.jsx(r,{label:"Read Only",value:42,readOnly:!0}),e.jsx(r,{label:"Required",required:!0})]})},l={args:{label:"Price",placeholder:"0.00",leftSection:e.jsx("span",{children:"$"})}},n={args:{label:"Percentage",placeholder:"0",rightSection:e.jsx("span",{children:"%"}),hideControls:!0}},s={args:{label:"Zip Code",placeholder:"Enter zip code",hideControls:!0}};var i,d,c;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    label: "Amount",
    placeholder: "Enter an amount",
    assistiveText: "Must be greater than 0",
    defaultValue: 10,
    min: 0,
    max: 100
  }
}`,...(c=(d=a.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};var p,u,m;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    formLayout: "side-by-side"
  }
}`,...(m=(u=t.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var b,h,g;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(g=(h=o.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};var x,f,y;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(j=(D=s.parameters)==null?void 0:D.docs)==null?void 0:j.source}}};const U=["Default","SideBySideLayout","States","WithLeftIcon","WithRightIcon","HiddenControls"];export{a as Default,s as HiddenControls,t as SideBySideLayout,o as States,l as WithLeftIcon,n as WithRightIcon,U as __namedExportsOrder,K as default};
