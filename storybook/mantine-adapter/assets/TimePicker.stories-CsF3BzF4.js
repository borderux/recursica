import{T as W}from"./TimePicker-Cxl9UPgE.js";import{f as k}from"./commonArgTypes-DcjzA9l3.js";import"./iframe-ui3vHneJ.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-DLaYJqAV.js";import"./FormControlWrapper-CIHrwgG0.js";import"./get-size-C3KF_bQQ.js";import"./factory-Bm8Z26Jt.js";import"./polymorphic-factory-BPOocaz7.js";import"./create-optional-context-HOfWPQU5.js";import"./use-resolved-styles-api-CrZ-XoZn.js";import"./CloseButton-DbhId_nx.js";import"./UnstyledButton-DFZm1ayP.js";import"./use-id-Cj4dGt-w.js";import"./AssistiveElement-DBYNvPeo.js";import"./ReadOnlyField-x51DOUK5.js";import"./Dropdown.module-DVHeC7ye.js";import"./OptionsDropdown-CmTX2bEq.js";import"./CheckIcon-CS2FnSpL.js";import"./ScrollArea-BeQ3XGAD.js";import"./floating-ui.react-BcXehHo9.js";import"./index-D8T0xS7x.js";import"./index-DrSfN2HQ.js";import"./create-safe-context-BRQ5OSXb.js";import"./use-merged-ref-DzAJhlw3.js";import"./DirectionProvider-CvtOTCV8.js";import"./to-int-PQE0s6ay.js";import"./Popover-BdRdQad6.js";import"./OptionalPortal-BV3Ps08z.js";import"./is-element-DFX_OVHe.js";import"./get-floating-position-BbgKbtBB.js";import"./FocusTrap-DAVl_9Lp.js";import"./use-reduced-motion-bxGOEpJk.js";import"./Transition-CtA3YDge.js";import"./use-uncontrolled-y4V07OfJ.js";import"./use-click-outside-DUaKoWMk.js";import"./InputBase-D84toM25.js";import"./use-input-props-BAYfgniY.js";import"./clamp-DTmYCdls.js";import"./get-base-value-D77SeWDq.js";const be={title:"UI-Kit/TimePicker",component:W,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `TimePicker` primitive provides a segmented hour/minute (optionally seconds) time entry input, paired with a dedicated AM/PM `Dropdown`-style selector, integrated directly into the `FormControlWrapper` architecture. This 12-hour + AM/PM composite is the only way this component operates — a Recursica-specific design, not a user-configurable option.\n\n### Examples\nAlways structure horizontal architectures via the generic `formLayout` parameter.\n```tsx\n<TimePicker\n  label="Start Time"\n  assistiveText="Select the deployment kick-off time."\n  formLayout="stacked"\n/>\n```\n'}}},argTypes:{...k,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."},withSeconds:{control:"boolean",description:"Shows and allows editing the seconds segment."}}},e={args:{disabled:!1,label:"Meeting Time",assistiveText:"Choose the start time in your local timezone."}},t={args:{label:"Incident Start Time",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}},r={args:{label:"Precise Execution Time",assistiveText:"Includes a seconds segment for exact scheduling.",withSeconds:!0}},o={args:{label:"Disabled Time Slot",disabled:!0}},a={args:{label:"Deployment Window",error:"The chosen time falls outside the allowed deployment window.",required:!0}},i={args:{label:"Static ReadOnly Review",value:"14:30",readOnly:!0}},s={args:{label:"Editable ReadOnly Review",defaultValue:"09:00",readOnly:!0,labelWithEditIcon:!0}};var n,l,c;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    disabled: false,
    label: "Meeting Time",
    assistiveText: "Choose the start time in your local timezone."
  }
}`,...(c=(l=e.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var d,m,p;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    label: "Incident Start Time",
    assistiveText: "When did the incident originally occur?",
    formLayout: "side-by-side"
  }
}`,...(p=(m=t.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var u,g,y;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    label: "Precise Execution Time",
    assistiveText: "Includes a seconds segment for exact scheduling.",
    withSeconds: true
  }
}`,...(y=(g=r.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var b,h,S;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: "Disabled Time Slot",
    disabled: true
  }
}`,...(S=(h=o.parameters)==null?void 0:h.docs)==null?void 0:S.source}}};var T,f,w;a.parameters={...a.parameters,docs:{...(T=a.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    label: "Deployment Window",
    error: "The chosen time falls outside the allowed deployment window.",
    required: true
  }
}`,...(w=(f=a.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var x,v,O;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: "Static ReadOnly Review",
    value: "14:30",
    readOnly: true
  }
}`,...(O=(v=i.parameters)==null?void 0:v.docs)==null?void 0:O.source}}};var R,E,D;s.parameters={...s.parameters,docs:{...(R=s.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: "Editable ReadOnly Review",
    defaultValue: "09:00",
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(D=(E=s.parameters)==null?void 0:E.docs)==null?void 0:D.source}}};const he=["Default","FormsSideBySide","WithSeconds","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{e as Default,o as Disabled,s as EditableReadOnly,a as ErrorState,t as FormsSideBySide,i as StaticReadOnly,r as WithSeconds,he as __namedExportsOrder,be as default};
