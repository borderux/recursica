import{j as e}from"./iframe-BLiCIbSn.js";import{A as D}from"./Autocomplete-BkLvw0na.js";import{f as I}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-3EEHXogW.js";import"./FormControlWrapper-ALiLKnmL.js";import"./AssistiveElement-CoOObQmM.js";import"./useFormControl-DbnO2R0f.js";import"./memoTheme-BMHwlbyj.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./isMuiElement-CO_al-1K.js";import"./ReadOnlyField-D6aR89DQ.js";import"./Select-D9QJ-lcr.js";import"./SelectFocusSourceContext-y-FhkLPz.js";import"./useSlot-Bs_Uu9mE.js";import"./mergeSlotProps-DjR-Y3fO.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-DgeiMcJz.js";import"./useSlotProps-Dfz1jvY6.js";import"./Paper-BLoJ5zsR.js";import"./useTheme-Bc7iDKYP.js";import"./ownerDocument-DW-IO8s5.js";import"./ownerWindow-HkKU3E4x.js";import"./debounce-Be36O1Ab.js";import"./Grow-BU8qU6lw.js";import"./utils-B9x90bWk.js";import"./useTimeout-HOQ3xH8K.js";import"./index-C4i5oaw6.js";import"./index-BNDV8iZa.js";import"./Portal-DWWBoS96.js";import"./mergeSlotProps-DKb1U07I.js";import"./Modal-Ossby4kW.js";import"./useEventCallback--Tu1ust1.js";import"./createChainedFunction-BO_9K8Jh.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./List-C-1aEi9n.js";import"./useControlled-CNTQxXUn.js";import"./createSvgIcon-BXmeBObB.js";import"./InputBase-MSP4ZoLf.js";import"./Close-BgiKrTDg.js";import"./usePreviousProps-CLhVM8B3.js";import"./Popper-Cz1bJoAE.js";import"./Chip-BGibTK80.js";import"./ButtonBase-CjMfS4uk.js";import"./isFocusVisible-B8k4qzLc.js";import"./IconButton-CywJVkS8.js";import"./CircularProgress-BJ4jvMRt.js";import"./ListSubheader-CihyPue-.js";import"./TextField-DhK9FgMM.js";const je={title:"UI-Kit/AutoComplete",component:D,tags:["autodocs"],parameters:{docs:{description:{component:`
The \`AutoComplete\` primitive provides a text input with a dropdown menu for displaying suggestions as the user types.

### Architectural Decoupling
Recursica wraps the internal Mantine \`<Autocomplete>\` component inside the \`WithReadOnlyWrapper\`, ensuring it integrates perfectly with the strict design system form architecture.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<AutoComplete 
  label="Country" 
  assistiveText="Select your country of residence." 
  data={["United States", "Canada", "Mexico", "United Kingdom", "France"]}
  formLayout="stacked" 
/>
\`\`\`
`}}},argTypes:{...I,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."}}},t={args:{disabled:!1,readOnly:!1,label:"Country Selection",placeholder:"Start typing...",data:["United States","Canada","Mexico","United Kingdom","France","Germany","Japan","Brazil","India","Australia"],assistiveText:"Search from a predefined list of countries."}},r={args:{label:"Primary Region",placeholder:"Select region...",data:["US-East","US-West","EU-Central","AP-South","SA-East"],assistiveText:"Select the primary region for the deployment. This violently long string tests native textual wrapping safely mapping alongside inputs.",formLayout:"side-by-side"}},a={args:{label:"Search Projects",placeholder:"Project name...",data:["Alpha","Beta","Gamma","Delta","Epsilon"],leftSection:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},o={args:{label:"Validation URL",placeholder:"https://recursica.dev",data:["https://recursica.dev","https://beta.recursica.dev","https://api.recursica.dev"],rightSection:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})}},i={args:{label:"Disabled Deployment Node",placeholder:"Disabled primitive map...",data:["Node 1","Node 2","Node 3"],disabled:!0}},n={args:{label:"Cluster Failure",placeholder:"Failing component instance...",data:["Cluster A","Cluster B","Cluster C"],defaultValue:"Invalid Cluster",error:"Critical runtime node disconnect detected traversing DOM architecture.",required:!0}},s={args:{label:"Static ReadOnly Review",placeholder:"Ignored...",data:["Option 1","Option 2"],value:"Explicitly Uneditable Bound Output",readOnly:!0}},l={args:{label:"Editable ReadOnly Review",placeholder:"Ignored until active...",data:["Option 1","Option 2"],defaultValue:"Waiting for Edit Execution",readOnly:!0,labelWithEditIcon:!0}};var d,c,p;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    disabled: false,
    readOnly: false,
    label: "Country Selection",
    placeholder: "Start typing...",
    data: ["United States", "Canada", "Mexico", "United Kingdom", "France", "Germany", "Japan", "Brazil", "India", "Australia"],
    assistiveText: "Search from a predefined list of countries."
  }
}`,...(p=(c=t.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var m,u,g;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: "Primary Region",
    placeholder: "Select region...",
    data: ["US-East", "US-West", "EU-Central", "AP-South", "SA-East"],
    assistiveText: "Select the primary region for the deployment. This violently long string tests native textual wrapping safely mapping alongside inputs.",
    formLayout: "side-by-side"
  }
}`,...(g=(u=r.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,y,b;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "Search Projects",
    placeholder: "Project name...",
    data: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"],
    leftSection: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(b=(y=a.parameters)==null?void 0:y.docs)==null?void 0:b.source}}};var v,S,f;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    label: "Validation URL",
    placeholder: "https://recursica.dev",
    data: ["https://recursica.dev", "https://beta.recursica.dev", "https://api.recursica.dev"],
    rightSection: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
  }
}`,...(f=(S=o.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var x,C,O;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: "Disabled Deployment Node",
    placeholder: "Disabled primitive map...",
    data: ["Node 1", "Node 2", "Node 3"],
    disabled: true
  }
}`,...(O=(C=i.parameters)==null?void 0:C.docs)==null?void 0:O.source}}};var E,A,w;n.parameters={...n.parameters,docs:{...(E=n.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    label: "Cluster Failure",
    placeholder: "Failing component instance...",
    data: ["Cluster A", "Cluster B", "Cluster C"],
    defaultValue: "Invalid Cluster",
    error: "Critical runtime node disconnect detected traversing DOM architecture.",
    required: true
  }
}`,...(w=(A=n.parameters)==null?void 0:A.docs)==null?void 0:w.source}}};var R,k,U;s.parameters={...s.parameters,docs:{...(R=s.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: "Static ReadOnly Review",
    placeholder: "Ignored...",
    data: ["Option 1", "Option 2"],
    value: "Explicitly Uneditable Bound Output",
    readOnly: true
  }
}`,...(U=(k=s.parameters)==null?void 0:k.docs)==null?void 0:U.source}}};var L,W,j;l.parameters={...l.parameters,docs:{...(L=l.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    label: "Editable ReadOnly Review",
    placeholder: "Ignored until active...",
    data: ["Option 1", "Option 2"],
    defaultValue: "Waiting for Edit Execution",
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(j=(W=l.parameters)==null?void 0:W.docs)==null?void 0:j.source}}};const De=["Default","FormsSideBySide","WithLeadingIcon","WithTrailingIcon","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{t as Default,i as Disabled,l as EditableReadOnly,n as ErrorState,r as FormsSideBySide,s as StaticReadOnly,a as WithLeadingIcon,o as WithTrailingIcon,De as __namedExportsOrder,je as default};
