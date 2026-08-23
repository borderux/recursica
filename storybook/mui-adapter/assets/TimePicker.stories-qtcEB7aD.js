import{T as D}from"./TimePicker-CweQsFFw.js";import{f as W}from"./commonArgTypes-DcjzA9l3.js";import"./iframe-BLiCIbSn.js";import"./preload-helper-Dp1pzeXC.js";import"./useMobilePicker-he2n0saU.js";import"./formatErrorMessage-DkKmrRLY.js";import"./useTimeout-HOQ3xH8K.js";import"./useThemeProps-CCsDvl_B.js";import"./useThemeProps-IXVT9ISn.js";import"./Typography-BYBRiYxT.js";import"./memoTheme-BMHwlbyj.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Modal-Ossby4kW.js";import"./ownerWindow-HkKU3E4x.js";import"./ownerDocument-DW-IO8s5.js";import"./useForkRef-DgeiMcJz.js";import"./useEventCallback--Tu1ust1.js";import"./createChainedFunction-BO_9K8Jh.js";import"./mergeSlotProps-DjR-Y3fO.js";import"./isHostComponent-DVu5iVWx.js";import"./useSlot-Bs_Uu9mE.js";import"./Portal-DWWBoS96.js";import"./index-C4i5oaw6.js";import"./index-BNDV8iZa.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./useTheme-Bc7iDKYP.js";import"./utils-B9x90bWk.js";import"./Grow-BU8qU6lw.js";import"./Paper-BLoJ5zsR.js";import"./Popper-Cz1bJoAE.js";import"./useSlotProps-Dfz1jvY6.js";import"./useFormControl-DbnO2R0f.js";import"./FormControlWrapper-ALiLKnmL.js";import"./AssistiveElement-CoOObQmM.js";import"./isMuiElement-CO_al-1K.js";import"./IconButton-CywJVkS8.js";import"./ButtonBase-CjMfS4uk.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-BJ4jvMRt.js";import"./createSvgIcon-BXmeBObB.js";import"./DialogContent-dlQGfiA8.js";import"./Button-CFmpJAIG.js";import"./List-C-1aEi9n.js";import"./Chip-BGibTK80.js";import"./WithReadOnlyWrapper-3EEHXogW.js";import"./ReadOnlyField-D6aR89DQ.js";import"./Dropdown.module-By1D3GlD.js";import"./Select-D9QJ-lcr.js";import"./SelectFocusSourceContext-y-FhkLPz.js";import"./debounce-Be36O1Ab.js";import"./mergeSlotProps-DKb1U07I.js";import"./useControlled-CNTQxXUn.js";import"./InputBase-MSP4ZoLf.js";import"./MenuItem-B-3yXDL9.js";const Le={title:"UI-Kit/TimePicker",component:D,tags:["autodocs"],parameters:{controls:{include:["value","defaultValue","disabled","error","required","label","assistiveText","readOnly","withSeconds","formLayout"]},docs:{description:{component:'\nThe `TimePicker` primitive provides a 12-hour time field (via `@mui/x-date-pickers`) paired with a dedicated AM/PM `Dropdown`-style selector, integrated directly into the `FormControlWrapper` architecture. This composite is the only way this component operates — a Recursica-specific design, not a user-configurable option.\n\n### Examples\nAlways structure horizontal architectures via the generic `formLayout` parameter.\n```tsx\n<TimePicker\n  label="Start Time"\n  assistiveText="Select the deployment kick-off time."\n  formLayout="stacked"\n/>\n```\n'}}},argTypes:{...W,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."},withSeconds:{control:"boolean",description:"Shows and allows editing the seconds segment."}}},e={args:{disabled:!1,label:"Meeting Time",assistiveText:"Choose the start time in your local timezone."}},r={args:{label:"Incident Start Time",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}},t={args:{label:"Precise Execution Time",assistiveText:"Includes a seconds segment for exact scheduling.",withSeconds:!0}},o={args:{label:"Disabled Time Slot",disabled:!0}},i={args:{label:"Deployment Window",error:"The chosen time falls outside the allowed deployment window.",required:!0}},a={args:{label:"Static ReadOnly Review",value:"14:30",readOnly:!0}},s={args:{label:"Editable ReadOnly Review",defaultValue:"09:00",readOnly:!0,labelWithEditIcon:!0}};var n,l,d;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Meeting Time",
    assistiveText: "Choose the start time in your local timezone."
  }
}`,...(d=(l=e.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var c,m,p;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    label: "Incident Start Time",
    assistiveText: "When did the incident originally occur?",
    formLayout: "side-by-side"
  }
}`,...(p=(m=r.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,b,g;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(k=(E=s.parameters)==null?void 0:E.docs)==null?void 0:k.source}}};const Me=["Default","FormsSideBySide","WithSeconds","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{e as Default,o as Disabled,s as EditableReadOnly,i as ErrorState,r as FormsSideBySide,a as StaticReadOnly,t as WithSeconds,Me as __namedExportsOrder,Le as default};
