import{T as D}from"./TimePicker-CZRfDX19.js";import{f as W}from"./commonArgTypes-DcjzA9l3.js";import"./iframe-Bain31R0.js";import"./preload-helper-Dp1pzeXC.js";import"./useMobilePicker-B87hjQ2w.js";import"./formatErrorMessage-DkKmrRLY.js";import"./useTimeout-DrzpHnwK.js";import"./useThemeProps-DAPBYWMN.js";import"./useThemeProps-BbKbM1gp.js";import"./Typography-C3t9DkQB.js";import"./memoTheme-C8oOPpFq.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Modal-DQvfdOPu.js";import"./ownerWindow-HkKU3E4x.js";import"./ownerDocument-DW-IO8s5.js";import"./useForkRef-itiL0CSC.js";import"./useEventCallback-B-qTP8Ut.js";import"./createChainedFunction-BO_9K8Jh.js";import"./mergeSlotProps-DT6hk6s3.js";import"./isHostComponent-DVu5iVWx.js";import"./useSlot-BYP_jPjY.js";import"./Portal-DCDNgx_V.js";import"./index-TLVyyQ7L.js";import"./index-DOUe8wrs.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./useTheme-DfdQqc5m.js";import"./utils-gQhUfUfP.js";import"./Grow-CbNdZqu3.js";import"./Paper-g7HoWqDO.js";import"./Popper-EbT0Y2I8.js";import"./useSlotProps-C3Q0yARB.js";import"./useFormControl-CHzY-kBe.js";import"./FormControlWrapper-MNtMw0bK.js";import"./AssistiveElement-Bj-nGoU0.js";import"./isMuiElement-epe0QGZM.js";import"./IconButton-DKhRPIIm.js";import"./ButtonBase-nOQ6vh2E.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-C0U6vXLx.js";import"./createSvgIcon--Z68nxbq.js";import"./DialogContent-CP2e9y3v.js";import"./Button-rI8nTmZ5.js";import"./List-DGF1S56P.js";import"./Chip-Cw_PjuPn.js";import"./WithReadOnlyWrapper-U9rCldPJ.js";import"./ReadOnlyField-DZ61falH.js";import"./renderRichOption-sstob_Ox.js";import"./Dropdown.module-Cgkce6KW.js";import"./Select-XAqoODTn.js";import"./SelectFocusSourceContext-CccT5BY-.js";import"./debounce-Be36O1Ab.js";import"./mergeSlotProps-tLrn7IGQ.js";import"./useControlled-COkTbN2W.js";import"./InputBase-DMbRGxKt.js";import"./MenuItem-Cr8HlPcG.js";const Me={title:"UI-Kit/TimePicker",component:D,tags:["autodocs"],parameters:{controls:{include:["value","defaultValue","disabled","error","required","label","assistiveText","readOnly","withSeconds","formLayout"]},docs:{description:{component:'\nThe `TimePicker` primitive provides a 12-hour time field (via `@mui/x-date-pickers`) paired with a dedicated AM/PM `Dropdown`-style selector, integrated directly into the `FormControlWrapper` architecture. This composite is the only way this component operates — a Recursica-specific design, not a user-configurable option.\n\n### Examples\nAlways structure horizontal architectures via the generic `formLayout` parameter.\n```tsx\n<TimePicker\n  label="Start Time"\n  assistiveText="Select the deployment kick-off time."\n  formLayout="stacked"\n/>\n```\n'}}},argTypes:{...W,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."},withSeconds:{control:"boolean",description:"Shows and allows editing the seconds segment."}}},e={args:{disabled:!1,label:"Meeting Time",assistiveText:"Choose the start time in your local timezone."}},r={args:{label:"Incident Start Time",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}},t={args:{label:"Precise Execution Time",assistiveText:"Includes a seconds segment for exact scheduling.",withSeconds:!0}},o={args:{label:"Disabled Time Slot",disabled:!0}},i={args:{label:"Deployment Window",error:"The chosen time falls outside the allowed deployment window.",required:!0}},a={args:{label:"Static ReadOnly Review",value:"14:30",readOnly:!0}},s={args:{label:"Editable ReadOnly Review",defaultValue:"09:00",readOnly:!0,labelWithEditIcon:!0}};var n,l,d;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
