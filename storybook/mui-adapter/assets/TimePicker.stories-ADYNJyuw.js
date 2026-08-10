import{T as D}from"./TimePicker-CZQRVXsV.js";import{f as W}from"./commonArgTypes-DcjzA9l3.js";import"./iframe-CTNOWuxJ.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-CKV0MI4a.js";import"./ReadOnlyField-CTWjLeBe.js";import"./AssistiveElement-ccl_VdAg.js";import"./useFormControl-C8DPOVY-.js";import"./memoTheme-DArITUO2.js";import"./styled-DIb4s8oE.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./FormControlLayout-Cq6qAZOh.js";import"./isMuiElement-DxG4kc2d.js";import"./Dropdown.module-BhdwiF2W.js";import"./Select-DOeNntCU.js";import"./SelectFocusSourceContext-CvOE-x4d.js";import"./useSlot-Bg6uni-G.js";import"./mergeSlotProps-B4AIWsdX.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-63__mORY.js";import"./useSlotProps-DheJox-B.js";import"./Paper-CFnh4QwK.js";import"./useTheme-Cad0UvuQ.js";import"./ownerDocument-DW-IO8s5.js";import"./ownerWindow-HkKU3E4x.js";import"./debounce-Be36O1Ab.js";import"./Grow-Cj-SDzgt.js";import"./utils-Btk2nXeJ.js";import"./useTimeout-DPPJS-go.js";import"./index-CUGwdxJ4.js";import"./index-CoHWzips.js";import"./Portal-C85VnRD_.js";import"./mergeSlotProps-Bt_FExC_.js";import"./Modal-BpdJpGH_.js";import"./useEventCallback-DHmOjoO5.js";import"./createChainedFunction-BO_9K8Jh.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./useControlled-Dx-M3u9v.js";import"./createSvgIcon-CD97eQrp.js";import"./InputBase-EPRAeafn.js";import"./MenuItem-DkATIb3S.js";import"./ButtonBase-jKVZeSdt.js";import"./isFocusVisible-B8k4qzLc.js";import"./useThemeProps-NnBPcFL_.js";import"./useThemeProps-ualDIEAe.js";import"./formatErrorMessage-DkKmrRLY.js";import"./Typography-D4OmnD9N.js";import"./Button-DLCqbH9W.js";import"./CircularProgress-_P94SYFt.js";import"./IconButton-BuSqbCjl.js";import"./Popper-Cm3q5grM.js";import"./DialogContent-BHJRbcCe.js";import"./Chip-B-JbK4Yd.js";const Pe={title:"UI-Kit/TimePicker",component:D,tags:["autodocs"],parameters:{controls:{include:["value","defaultValue","disabled","error","required","label","assistiveText","readOnly","withSeconds","formLayout"]},docs:{description:{component:'\nThe `TimePicker` primitive provides a 12-hour time field (via `@mui/x-date-pickers`) paired with a dedicated AM/PM `Dropdown`-style selector, integrated directly into the `FormControlWrapper` architecture. This composite is the only way this component operates — a Recursica-specific design, not a user-configurable option.\n\n### Examples\nAlways structure horizontal architectures via the generic `formLayout` parameter.\n```tsx\n<TimePicker\n  label="Start Time"\n  assistiveText="Select the deployment kick-off time."\n  formLayout="stacked"\n/>\n```\n'}}},argTypes:{...W,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."},withSeconds:{control:"boolean",description:"Shows and allows editing the seconds segment."}}},e={args:{disabled:!1,label:"Meeting Time",assistiveText:"Choose the start time in your local timezone."}},r={args:{label:"Incident Start Time",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}},t={args:{label:"Precise Execution Time",assistiveText:"Includes a seconds segment for exact scheduling.",withSeconds:!0}},o={args:{label:"Disabled Time Slot",disabled:!0}},i={args:{label:"Deployment Window",error:"The chosen time falls outside the allowed deployment window.",required:!0}},a={args:{label:"Static ReadOnly Review",value:"14:30",readOnly:!0}},s={args:{label:"Editable ReadOnly Review",defaultValue:"09:00",readOnly:!0,labelWithEditIcon:!0}};var n,l,d;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
}`,...(k=(E=s.parameters)==null?void 0:E.docs)==null?void 0:k.source}}};const Le=["Default","FormsSideBySide","WithSeconds","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{e as Default,o as Disabled,s as EditableReadOnly,i as ErrorState,r as FormsSideBySide,a as StaticReadOnly,t as WithSeconds,Le as __namedExportsOrder,Pe as default};
