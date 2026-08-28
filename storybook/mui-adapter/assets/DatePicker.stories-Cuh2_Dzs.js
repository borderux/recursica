import{j as e}from"./iframe-DwzbXXsg.js";import{D as W}from"./DatePicker-CzFuFCf4.js";import{f as F}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./useMobilePicker-C1kITT2R.js";import"./formatErrorMessage-DkKmrRLY.js";import"./useTimeout-0OGhdP7n.js";import"./useThemeProps-DaH5TIa0.js";import"./useThemeProps-DfxrXEEE.js";import"./Typography-B92I6Oqd.js";import"./memoTheme-VNhdAq_e.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Modal-C389pHSa.js";import"./ownerWindow-HkKU3E4x.js";import"./ownerDocument-DW-IO8s5.js";import"./useForkRef-DIGfaA-o.js";import"./useEventCallback-C68EW9dQ.js";import"./createChainedFunction-BO_9K8Jh.js";import"./mergeSlotProps-ESQ19004.js";import"./isHostComponent-DVu5iVWx.js";import"./useSlot-D3WXn4hk.js";import"./Portal-CHpWCbzb.js";import"./index-C4Fq4A0a.js";import"./index-Cf_VtCzm.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./useTheme-DrRptafz.js";import"./utils-S4pfVl09.js";import"./Grow-qyT4Yn0A.js";import"./Paper-Dc5kAbl4.js";import"./Popper-i44x9jFl.js";import"./useSlotProps-vXS8yeF7.js";import"./useFormControl-CMoRXqtB.js";import"./FormControlWrapper-D8wrHspI.js";import"./AssistiveElement-Da1ftJCs.js";import"./isMuiElement-C5tXw-kS.js";import"./IconButton-CcrUzrjw.js";import"./ButtonBase-DrWn9hz0.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-e0q3-4EL.js";import"./createSvgIcon-TtN7ZrVz.js";import"./DialogContent-CSB8i11C.js";import"./Button-C6iL5kXX.js";import"./List-Cd_XEZin.js";import"./Chip-oPhJEazD.js";import"./WithReadOnlyWrapper-piwUruTl.js";import"./ReadOnlyField-BtKcfNVE.js";const Le={title:"UI-Kit/DatePicker",component:W,tags:["autodocs"],parameters:{docs:{description:{component:`
The \`DatePicker\` primitive provides a unified calendar date selection input integrated directly into the \`FormControlWrapper\` architecture.

### Architectural Decoupling
Recursica overrides MUI X's \`DatePicker\` field/popover defaults, safely injecting the date picker into our rigid structural layout systems. State modifiers (e.g. Focus, Errors, ReadOnly) hook seamlessly back onto our native CSS mapping architecture.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<DatePicker 
  label="Start Date" 
  assistiveText="Select the deployment kick-off date." 
  formLayout="stacked" 
/>
\`\`\`
`}}},argTypes:{...F,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."}}},t={args:{disabled:!1,label:"Project Deadline",assistiveText:"Specify the absolute cutoff for code submission."}},r={args:{label:"Incident Start Date",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}};function M({className:P}){return e.jsxs("svg",{className:P,width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})}const a={args:{label:"Launch Date",slots:{openPickerIcon:M}}},o={args:{label:"Disabled Date Range",disabled:!0}},n={args:{label:"Execution Date",error:"The chosen date conflicts with an existing deployment freeze.",required:!0}},i={args:{label:"Meeting Date",assistiveText:"Calendar rendered open by default for styling review.",open:!0,onClose:()=>{},defaultValue:new Date(2026,7,26)},parameters:{docs:{description:{story:"The calendar dropdown renders open by default so its styling can be reviewed without a click interaction."}}}},s={args:{label:"Static ReadOnly Review",value:new Date("2026-05-21"),readOnly:!0}},l={args:{label:"Editable ReadOnly Review",defaultValue:new Date("2026-06-01"),readOnly:!0,labelWithEditIcon:!0}};var c,d,p;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Project Deadline",
    assistiveText: "Specify the absolute cutoff for code submission."
  }
}`,...(p=(d=t.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var m,u,y;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: "Incident Start Date",
    assistiveText: "When did the incident originally occur?",
    formLayout: "side-by-side"
  }
}`,...(y=(u=r.parameters)==null?void 0:u.docs)==null?void 0:y.source}}};var g,b,h;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    label: "Launch Date",
    slots: {
      openPickerIcon: CustomLeadingIcon
    }
  }
}`,...(h=(b=a.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var f,x,D;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    label: "Disabled Date Range",
    disabled: true
  }
}`,...(D=(x=o.parameters)==null?void 0:x.docs)==null?void 0:D.source}}};var v,w,S;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    label: "Execution Date",
    error: "The chosen date conflicts with an existing deployment freeze.",
    required: true
  }
}`,...(S=(w=n.parameters)==null?void 0:w.docs)==null?void 0:S.source}}};var k,O,T;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Meeting Date",
    assistiveText: "Calendar rendered open by default for styling review.",
    // MUI X's DatePicker supports a controlled \`open\` prop directly; pairing it with a
    // no-op \`onClose\` keeps the calendar open with no click interaction needed — same
    // intent as the mantine-adapter's \`OpenedCalendar\` story.
    open: true,
    onClose: () => {},
    // Fixed (not computed) so the selected-day fill is visible on load, alongside the
    // today marker, for styling review. Local-component constructor, not an ISO date
    // string — \`new Date("2026-08-26")\` parses as UTC midnight, which renders as the
    // 25th in any timezone behind UTC.
    defaultValue: new Date(2026, 7, 26)
  },
  parameters: {
    docs: {
      description: {
        story: "The calendar dropdown renders open by default so its styling can be reviewed without a click interaction."
      }
    }
  }
}`,...(T=(O=i.parameters)==null?void 0:O.docs)==null?void 0:T.source}}};var R,C,E;s.parameters={...s.parameters,docs:{...(R=s.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: "Static ReadOnly Review",
    value: new Date("2026-05-21"),
    readOnly: true
  }
}`,...(E=(C=s.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};var I,L,j;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    label: "Editable ReadOnly Review",
    defaultValue: new Date("2026-06-01"),
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(j=(L=l.parameters)==null?void 0:L.docs)==null?void 0:j.source}}};const je=["Default","FormsSideBySide","WithLeadingIcon","Disabled","ErrorState","OpenedCalendar","StaticReadOnly","EditableReadOnly"];export{t as Default,o as Disabled,l as EditableReadOnly,n as ErrorState,r as FormsSideBySide,i as OpenedCalendar,s as StaticReadOnly,a as WithLeadingIcon,je as __namedExportsOrder,Le as default};
