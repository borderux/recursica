import{T as D}from"./TimePicker-rh8O_axy.js";import{f as W}from"./commonArgTypes-DcjzA9l3.js";import"./iframe-kI3tYt3h.js";import"./preload-helper-Dp1pzeXC.js";import"./useMobilePicker-B7co-MYo.js";import"./formatErrorMessage-DkKmrRLY.js";import"./useTimeout-DVIYpBIx.js";import"./useThemeProps-Bc34s_Uh.js";import"./useThemeProps-CAR_wr_i.js";import"./Typography-DPpL5zmy.js";import"./memoTheme-vnNaqsCY.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Modal-Mng1gsjH.js";import"./ownerWindow-HkKU3E4x.js";import"./ownerDocument-DW-IO8s5.js";import"./useForkRef-Bad-M5H5.js";import"./useEventCallback-CERP1gBm.js";import"./createChainedFunction-BO_9K8Jh.js";import"./mergeSlotProps-BmeWBuK6.js";import"./isHostComponent-DVu5iVWx.js";import"./useSlot-D-eqD156.js";import"./Portal-XVFQAWTB.js";import"./index-CwOocEAv.js";import"./index-C0n0fDq-.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./useTheme-BdD5xnsz.js";import"./utils-CbgM1coP.js";import"./Grow-Soj-vPNE.js";import"./Paper-CIilS-JR.js";import"./Popper-B1ysR2d_.js";import"./useSlotProps-B_AM1lOD.js";import"./useFormControl-TypSIULb.js";import"./FormControlWrapper-DC9bASlA.js";import"./AssistiveElement-BWt5FiJL.js";import"./isMuiElement-r5LeNDn4.js";import"./IconButton-vyvXviSz.js";import"./ButtonBase-CuoLXK1M.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-DxkR0HpY.js";import"./createSvgIcon-DeYJf4PE.js";import"./DialogContent-B8Hjs08H.js";import"./Button-D9t45PsQ.js";import"./List-C2sAEq68.js";import"./Chip-CsRDXtqd.js";import"./WithReadOnlyWrapper-CxAmuNrS.js";import"./ReadOnlyField-Bfu7_9U7.js";import"./renderRichOption-BYtr6dYW.js";import"./Dropdown.module-CUG1lizs.js";import"./Select-BcdfnzGn.js";import"./SelectFocusSourceContext-BZhUMpKz.js";import"./debounce-Be36O1Ab.js";import"./mergeSlotProps-C1uxWDVU.js";import"./useControlled-Btadw_Em.js";import"./InputBase--2AFlObZ.js";import"./MenuItem-CmA1NZq_.js";const Me={title:"UI-Kit/TimePicker",component:D,tags:["autodocs"],parameters:{controls:{include:["value","defaultValue","disabled","error","required","label","assistiveText","readOnly","withSeconds","formLayout"]},docs:{description:{component:'\nThe `TimePicker` primitive provides a 12-hour time field (via `@mui/x-date-pickers`) paired with a dedicated AM/PM `Dropdown`-style selector, integrated directly into the `FormControlWrapper` architecture. This composite is the only way this component operates — a Recursica-specific design, not a user-configurable option.\n\n### Examples\nAlways structure horizontal architectures via the generic `formLayout` parameter.\n```tsx\n<TimePicker\n  label="Start Time"\n  assistiveText="Select the deployment kick-off time."\n  formLayout="stacked"\n/>\n```\n'}}},argTypes:{...W,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."},withSeconds:{control:"boolean",description:"Shows and allows editing the seconds segment."}}},e={args:{disabled:!1,label:"Meeting Time",assistiveText:"Choose the start time in your local timezone."}},r={args:{label:"Incident Start Time",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}},t={args:{label:"Precise Execution Time",assistiveText:"Includes a seconds segment for exact scheduling.",withSeconds:!0}},o={args:{label:"Disabled Time Slot",disabled:!0}},i={args:{label:"Deployment Window",error:"The chosen time falls outside the allowed deployment window.",required:!0}},a={args:{label:"Static ReadOnly Review",value:"14:30",readOnly:!0}},s={args:{label:"Editable ReadOnly Review",defaultValue:"09:00",readOnly:!0,labelWithEditIcon:!0}};var n,l,d;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
