import{T as D}from"./TimePicker-CtPKFLpJ.js";import{f as W}from"./commonArgTypes-DcjzA9l3.js";import"./iframe-DwzbXXsg.js";import"./preload-helper-Dp1pzeXC.js";import"./useMobilePicker-C1kITT2R.js";import"./formatErrorMessage-DkKmrRLY.js";import"./useTimeout-0OGhdP7n.js";import"./useThemeProps-DaH5TIa0.js";import"./useThemeProps-DfxrXEEE.js";import"./Typography-B92I6Oqd.js";import"./memoTheme-VNhdAq_e.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Modal-C389pHSa.js";import"./ownerWindow-HkKU3E4x.js";import"./ownerDocument-DW-IO8s5.js";import"./useForkRef-DIGfaA-o.js";import"./useEventCallback-C68EW9dQ.js";import"./createChainedFunction-BO_9K8Jh.js";import"./mergeSlotProps-ESQ19004.js";import"./isHostComponent-DVu5iVWx.js";import"./useSlot-D3WXn4hk.js";import"./Portal-CHpWCbzb.js";import"./index-C4Fq4A0a.js";import"./index-Cf_VtCzm.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./useTheme-DrRptafz.js";import"./utils-S4pfVl09.js";import"./Grow-qyT4Yn0A.js";import"./Paper-Dc5kAbl4.js";import"./Popper-i44x9jFl.js";import"./useSlotProps-vXS8yeF7.js";import"./useFormControl-CMoRXqtB.js";import"./FormControlWrapper-D8wrHspI.js";import"./AssistiveElement-Da1ftJCs.js";import"./isMuiElement-C5tXw-kS.js";import"./IconButton-CcrUzrjw.js";import"./ButtonBase-DrWn9hz0.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-e0q3-4EL.js";import"./createSvgIcon-TtN7ZrVz.js";import"./DialogContent-CSB8i11C.js";import"./Button-C6iL5kXX.js";import"./List-Cd_XEZin.js";import"./Chip-oPhJEazD.js";import"./WithReadOnlyWrapper-piwUruTl.js";import"./ReadOnlyField-BtKcfNVE.js";import"./renderRichOption-CDDVEr5X.js";import"./Dropdown.module-Cgkce6KW.js";import"./Select-bt4dOeKt.js";import"./SelectFocusSourceContext-CMeWdIlS.js";import"./debounce-Be36O1Ab.js";import"./mergeSlotProps-tGTBTp1L.js";import"./useControlled-XPFNiyC5.js";import"./InputBase-CzeTqIjS.js";import"./MenuItem-apZs25ih.js";const Me={title:"UI-Kit/TimePicker",component:D,tags:["autodocs"],parameters:{controls:{include:["value","defaultValue","disabled","error","required","label","assistiveText","readOnly","withSeconds","formLayout"]},docs:{description:{component:'\nThe `TimePicker` primitive provides a 12-hour time field (via `@mui/x-date-pickers`) paired with a dedicated AM/PM `Dropdown`-style selector, integrated directly into the `FormControlWrapper` architecture. This composite is the only way this component operates — a Recursica-specific design, not a user-configurable option.\n\n### Examples\nAlways structure horizontal architectures via the generic `formLayout` parameter.\n```tsx\n<TimePicker\n  label="Start Time"\n  assistiveText="Select the deployment kick-off time."\n  formLayout="stacked"\n/>\n```\n'}}},argTypes:{...W,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."},withSeconds:{control:"boolean",description:"Shows and allows editing the seconds segment."}}},e={args:{disabled:!1,label:"Meeting Time",assistiveText:"Choose the start time in your local timezone."}},r={args:{label:"Incident Start Time",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}},t={args:{label:"Precise Execution Time",assistiveText:"Includes a seconds segment for exact scheduling.",withSeconds:!0}},o={args:{label:"Disabled Time Slot",disabled:!0}},i={args:{label:"Deployment Window",error:"The chosen time falls outside the allowed deployment window.",required:!0}},a={args:{label:"Static ReadOnly Review",value:"14:30",readOnly:!0}},s={args:{label:"Editable ReadOnly Review",defaultValue:"09:00",readOnly:!0,labelWithEditIcon:!0}};var n,l,d;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Meeting Time",
    assistiveText: "Choose the start time in your local timezone."
  }
}`,...(d=(l=e.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var m,c,p;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    label: "Incident Start Time",
    assistiveText: "When did the incident originally occur?",
    formLayout: "side-by-side"
  }
}`,...(p=(c=r.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var u,b,g;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    label: "Precise Execution Time",
    assistiveText: "Includes a seconds segment for exact scheduling.",
    withSeconds: true
  }
}`,...(g=(b=t.parameters)==null?void 0:b.docs)==null?void 0:g.source}}};var y,h,S;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    label: "Disabled Time Slot",
    disabled: true
  }
}`,...(S=(h=o.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var T,f,v;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    label: "Deployment Window",
    error: "The chosen time falls outside the allowed deployment window.",
    required: true
  }
}`,...(v=(f=i.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var w,x,O;a.parameters={...a.parameters,docs:{...(w=a.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    label: "Static ReadOnly Review",
    value: "14:30",
    readOnly: true
  }
}`,...(O=(x=a.parameters)==null?void 0:x.docs)==null?void 0:O.source}}};var R,E,k;s.parameters={...s.parameters,docs:{...(R=s.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: "Editable ReadOnly Review",
    defaultValue: "09:00",
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(k=(E=s.parameters)==null?void 0:E.docs)==null?void 0:k.source}}};const qe=["Default","FormsSideBySide","WithSeconds","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{e as Default,o as Disabled,s as EditableReadOnly,i as ErrorState,r as FormsSideBySide,a as StaticReadOnly,t as WithSeconds,qe as __namedExportsOrder,Me as default};
