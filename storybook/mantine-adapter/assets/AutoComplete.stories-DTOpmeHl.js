import{j as e}from"./iframe-Hqhg3Da1.js";import{A as ee,s as t}from"./AutoComplete-BmiHHngP.js";import{f as te}from"./commonArgTypes-DcjzA9l3.js";import{r as re}from"./renderRichOption-CalSn-vD.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-DdZ_yfQO.js";import"./FormControlWrapper-BFumCHmC.js";import"./Label-CD0GZc2B.js";import"./get-size-CFz4_vy9.js";import"./factory-BczmY60U.js";import"./polymorphic-factory-CnqVX0h6.js";import"./create-optional-context-BYEbgx4h.js";import"./use-resolved-styles-api-DRneZZlL.js";import"./CloseButton-CDF38zpp.js";import"./UnstyledButton-Dr1Tl6DG.js";import"./use-id-Dvb_GrVM.js";import"./AssistiveElement-Cwftwkps.js";import"./ReadOnlyField-BwB9fZ1u.js";import"./OptionsDropdown-CwypEcJS.js";import"./CheckIcon-C9Y91EXt.js";import"./ScrollArea-BWeP5WX1.js";import"./floating-ui.react-cF-p8au5.js";import"./index-CYRVDetO.js";import"./index-OF9b6z9m.js";import"./create-safe-context-CjB3hAWP.js";import"./use-merged-ref-K9nI3EES.js";import"./DirectionProvider-C_Pg0eJM.js";import"./to-int-PQE0s6ay.js";import"./Popover-DVQxx6JK.js";import"./OptionalPortal-DtbOE-8d.js";import"./is-element-DYrWi5C8.js";import"./get-floating-position-TEoBy1x2.js";import"./FocusTrap-B34lFG2z.js";import"./use-reduced-motion-DOQvRuob.js";import"./Transition-WrigpDHF.js";import"./use-uncontrolled-DmcNFeB5.js";import"./use-click-outside-BUzR4uHA.js";import"./InputBase-Cyhi18am.js";import"./use-input-props-C1BnFh-2.js";const Ge={title:"UI-Kit/AutoComplete",component:ee,tags:["autodocs"],parameters:{docs:{description:{component:`
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
`}}},argTypes:{...te,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."},wrapItemText:{control:"boolean",description:"Wraps option label/supportingText onto additional lines instead of truncating with an ellipsis."}}},a={args:{disabled:!1,readOnly:!1,label:"Country Selection",placeholder:"Start typing...",data:["United States","Canada","Mexico","United Kingdom","France","Germany","Japan","Brazil","India","Australia"],assistiveText:"Search from a predefined list of countries."}},n={args:{label:"Primary Region",placeholder:"Select region...",data:["US-East","US-West","EU-Central","AP-South","SA-East"],assistiveText:"Select the primary region for the deployment. This violently long string tests native textual wrapping safely mapping alongside inputs.",formLayout:"side-by-side"}},o={args:{label:"Search Projects",placeholder:"Project name...",data:["Alpha","Beta","Gamma","Delta","Epsilon"],leftSection:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]})}},i={args:{label:"Validation URL",placeholder:"https://recursica.dev",data:["https://recursica.dev","https://beta.recursica.dev","https://api.recursica.dev"],rightSection:e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})})}},r=e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]}),s={args:{label:"Assignee",placeholder:"Search team members...",data:[{value:"jdoe",label:"Jane Doe",leadingIcon:r,supportingText:"jane.doe@example.com"},{value:"asmith",label:"Alex Smith",leadingIcon:r,supportingText:"alex.smith@example.com"},{value:"unassigned",label:"Unassigned"}],assistiveText:"Each option can show a leading icon and supporting text — see MANTINE_ADAPTER_RICH_OPTION_DATA.md."}},l={args:{label:"Assignee",placeholder:"Search team members...",wrapItemText:!0,data:[{value:"jdoe",label:"Jane Doe, Senior Staff Engineer, Platform Infrastructure",leadingIcon:r,supportingText:"jane.doe@example.com — Platform Infrastructure team, on-call rotation lead"},{value:"unassigned",label:"Unassigned"}],assistiveText:"wrapItemText=true — long label/supportingText wrap instead of truncating."}},ae={optionContent:t.optionContent,optionIcon:t.optionIcon,optionText:t.optionText,optionTextWrap:t.optionTextWrap,optionSupportingText:t.optionSupportingText},ne=[{value:"icon-and-supporting",label:"Jane Doe",leadingIcon:r,supportingText:"jane.doe@example.com"},{value:"no-icon",label:"Alex Smith",supportingText:"No leadingIcon — label/supportingText shift left, no reserved icon space"},{value:"no-supporting-text",label:"Taylor Rivera",leadingIcon:r},{value:"plain",label:"Plain option — no leadingIcon, no supportingText"},{value:"long-text",label:"A very long option label that, with wrapItemText, wraps onto a second line instead of overflowing the fixed-width dropdown — otherwise it truncates with an ellipsis",leadingIcon:r,supportingText:"A similarly long supporting text string, to confirm the same wrap-or-truncate behavior applies to it too"}],Z=$=>e.jsx("div",{className:t.dropdown,style:{width:"var(--recursica_ui-kit_components_autocomplete_variants_layouts_stacked_properties_max-width)"},children:ne.map(h=>e.jsx("div",{className:t.option,children:re({option:h},ae,$)},h.value))}),p={parameters:{controls:{disable:!0}},render:()=>Z(!1)},c={parameters:{controls:{disable:!0}},render:()=>Z(!0)},d={args:{label:"Disabled Deployment Node",placeholder:"Disabled primitive map...",data:["Node 1","Node 2","Node 3"],disabled:!0}},u={args:{label:"Cluster Failure",placeholder:"Failing component instance...",data:["Cluster A","Cluster B","Cluster C"],defaultValue:"Invalid Cluster",error:"Critical runtime node disconnect detected traversing DOM architecture.",required:!0}},m={args:{label:"Static ReadOnly Review",placeholder:"Ignored...",data:["Option 1","Option 2"],value:"Explicitly Uneditable Bound Output",readOnly:!0}},g={args:{label:"Editable ReadOnly Review",placeholder:"Ignored until active...",data:["Option 1","Option 2"],defaultValue:"Waiting for Edit Execution",readOnly:!0,labelWithEditIcon:!0}};var x,v,b;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    disabled: false,
    readOnly: false,
    label: "Country Selection",
    placeholder: "Start typing...",
    data: ["United States", "Canada", "Mexico", "United Kingdom", "France", "Germany", "Japan", "Brazil", "India", "Australia"],
    assistiveText: "Search from a predefined list of countries."
  }
}`,...(b=(v=a.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var y,f,S;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    label: "Primary Region",
    placeholder: "Select region...",
    data: ["US-East", "US-West", "EU-Central", "AP-South", "SA-East"],
    assistiveText: "Select the primary region for the deployment. This violently long string tests native textual wrapping safely mapping alongside inputs.",
    formLayout: "side-by-side"
  }
}`,...(S=(f=n.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};var w,T,I;o.parameters={...o.parameters,docs:{...(w=o.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    label: "Search Projects",
    placeholder: "Project name...",
    data: ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"],
    leftSection: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
  }
}`,...(I=(T=o.parameters)==null?void 0:T.docs)==null?void 0:I.source}}};var O,R,A;i.parameters={...i.parameters,docs:{...(O=i.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    label: "Validation URL",
    placeholder: "https://recursica.dev",
    data: ["https://recursica.dev", "https://beta.recursica.dev", "https://api.recursica.dev"],
    rightSection: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
  }
}`,...(A=(R=i.parameters)==null?void 0:R.docs)==null?void 0:A.source}}};var C,E,j;s.parameters={...s.parameters,docs:{...(C=s.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: "Assignee",
    placeholder: "Search team members...",
    data: [{
      value: "jdoe",
      label: "Jane Doe",
      leadingIcon: UserIcon,
      supportingText: "jane.doe@example.com"
    }, {
      value: "asmith",
      label: "Alex Smith",
      leadingIcon: UserIcon,
      supportingText: "alex.smith@example.com"
    }, {
      value: "unassigned",
      label: "Unassigned"
    }],
    assistiveText: "Each option can show a leading icon and supporting text — see MANTINE_ADAPTER_RICH_OPTION_DATA.md."
  }
}`,...(j=(E=s.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};var W,P,U;l.parameters={...l.parameters,docs:{...(W=l.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    label: "Assignee",
    placeholder: "Search team members...",
    wrapItemText: true,
    data: [{
      value: "jdoe",
      label: "Jane Doe, Senior Staff Engineer, Platform Infrastructure",
      leadingIcon: UserIcon,
      supportingText: "jane.doe@example.com — Platform Infrastructure team, on-call rotation lead"
    }, {
      value: "unassigned",
      label: "Unassigned"
    }],
    assistiveText: "wrapItemText=true — long label/supportingText wrap instead of truncating."
  }
}`,...(U=(P=l.parameters)==null?void 0:P.docs)==null?void 0:U.source}}};var k,D,_;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => renderOptionRowPreview(false)
}`,...(_=(D=p.parameters)==null?void 0:D.docs)==null?void 0:_.source}}};var N,L,B;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => renderOptionRowPreview(true)
}`,...(B=(L=c.parameters)==null?void 0:L.docs)==null?void 0:B.source}}};var M,F,J;d.parameters={...d.parameters,docs:{...(M=d.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    label: "Disabled Deployment Node",
    placeholder: "Disabled primitive map...",
    data: ["Node 1", "Node 2", "Node 3"],
    disabled: true
  }
}`,...(J=(F=d.parameters)==null?void 0:F.docs)==null?void 0:J.source}}};var V,G,K;u.parameters={...u.parameters,docs:{...(V=u.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    label: "Cluster Failure",
    placeholder: "Failing component instance...",
    data: ["Cluster A", "Cluster B", "Cluster C"],
    defaultValue: "Invalid Cluster",
    error: "Critical runtime node disconnect detected traversing DOM architecture.",
    required: true
  }
}`,...(K=(G=u.parameters)==null?void 0:G.docs)==null?void 0:K.source}}};var q,z,H;m.parameters={...m.parameters,docs:{...(q=m.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    label: "Static ReadOnly Review",
    placeholder: "Ignored...",
    data: ["Option 1", "Option 2"],
    value: "Explicitly Uneditable Bound Output",
    readOnly: true
  }
}`,...(H=(z=m.parameters)==null?void 0:z.docs)==null?void 0:H.source}}};var Q,X,Y;g.parameters={...g.parameters,docs:{...(Q=g.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    label: "Editable ReadOnly Review",
    placeholder: "Ignored until active...",
    data: ["Option 1", "Option 2"],
    defaultValue: "Waiting for Edit Execution",
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(Y=(X=g.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};const Ke=["Default","FormsSideBySide","WithLeadingIcon","WithTrailingIcon","WithRichOptions","WithRichOptionsWrapped","RichOptionRowPreview","RichOptionRowPreviewWrapped","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{a as Default,d as Disabled,g as EditableReadOnly,u as ErrorState,n as FormsSideBySide,p as RichOptionRowPreview,c as RichOptionRowPreviewWrapped,m as StaticReadOnly,o as WithLeadingIcon,s as WithRichOptions,l as WithRichOptionsWrapped,i as WithTrailingIcon,Ke as __namedExportsOrder,Ge as default};
