import{T as G}from"./TransferList-D0VacNSi.js";import{f as k}from"./commonArgTypes-DcjzA9l3.js";import"./iframe-Bain31R0.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-U9rCldPJ.js";import"./FormControlWrapper-MNtMw0bK.js";import"./AssistiveElement-Bj-nGoU0.js";import"./useFormControl-CHzY-kBe.js";import"./memoTheme-C8oOPpFq.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./isMuiElement-epe0QGZM.js";import"./ReadOnlyField-DZ61falH.js";import"./Badge-pUvdEsAH.js";import"./usePreviousProps-d_6DS3r1.js";import"./useSlot-BYP_jPjY.js";import"./mergeSlotProps-DT6hk6s3.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-itiL0CSC.js";import"./Button-DAVT_Vrx.js";import"./Loader-CUZ2IorV.js";import"./Button-rI8nTmZ5.js";import"./ButtonBase-nOQ6vh2E.js";import"./useTimeout-DrzpHnwK.js";import"./useEventCallback-B-qTP8Ut.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-C0U6vXLx.js";import"./TextField-CnebG3Ce.js";import"./InputBase-DMbRGxKt.js";import"./ownerDocument-DW-IO8s5.js";import"./getActiveElement-BwNsGdKK.js";import"./ownerWindow-HkKU3E4x.js";import"./debounce-Be36O1Ab.js";import"./Checkbox-sec54Znw.js";import"./FormGroup-B6WA4TMU.js";import"./Checkbox-DFaiD93K.js";import"./SwitchBase-Ci5rzISf.js";import"./useControlled-COkTbN2W.js";import"./createSvgIcon--Z68nxbq.js";import"./mergeSlotProps-tLrn7IGQ.js";const n=[[{value:"alpha",label:"Alpha"},{value:"bravo",label:"Bravo"},{value:"charlie",label:"Charlie"},{value:"delta",label:"Delta"},{value:"echo",label:"Echo"}],[{value:"foxtrot",label:"Foxtrot"}]],M=[[{value:"apple",label:"Apple",group:"Fruit"},{value:"banana",label:"Banana",group:"Fruit"},{value:"carrot",label:"Carrot",group:"Vegetable"},{value:"daikon",label:"Daikon",group:"Vegetable"},{value:"eagle",label:"Eagle"}],[]],ye={title:"UI-Kit/TransferList",component:G,tags:["autodocs"],parameters:{docs:{description:{component:"TransferList (dual listbox) lets users move items between two lists. Composes FormControlWrapper, TextField, Checkbox, CheckboxGroup, Badge, and Button."}}},args:{label:"Assign users",assistiveText:"Move users into the selected list.",defaultData:n,disabled:!1,required:!1},argTypes:{disabled:{control:"boolean"},...k,sourceLabel:{control:"text"},targetLabel:{control:"text"},searchable:{control:"boolean"},searchPlaceholder:{control:"text"}}},e={},r={args:{label:"Assign ingredients",defaultData:M}},a={args:{formLayout:"side-by-side"}},s={args:{label:"Assign users (no filtering)",searchable:!1}},t={args:{error:"Select at least one user.",defaultData:[[],n[0]]}},o={args:{disabled:!0}},l={args:{label:"Assign users",defaultData:[[],[]]}},i={args:{label:"Assigned users",defaultData:[[],n[0]],readOnly:!0}};var p,c,m;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:"{}",...(m=(c=e.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var u,d,g;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    label: "Assign ingredients",
    defaultData: GROUPED_DATA
  }
}`,...(g=(d=r.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var b,f,A;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    formLayout: "side-by-side"
  }
}`,...(A=(f=a.parameters)==null?void 0:f.docs)==null?void 0:A.source}}};var S,D,h;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    label: "Assign users (no filtering)",
    searchable: false
  }
}`,...(h=(D=s.parameters)==null?void 0:D.docs)==null?void 0:h.source}}};var v,y,T;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    error: "Select at least one user.",
    defaultData: [[], SAMPLE_DATA![0]]
  }
}`,...(T=(y=t.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};var x,E,L;o.parameters={...o.parameters,docs:{...(x=o.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...(L=(E=o.parameters)==null?void 0:E.docs)==null?void 0:L.source}}};var C,O,_;l.parameters={...l.parameters,docs:{...(C=l.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: "Assign users",
    defaultData: [[], []]
  }
}`,...(_=(O=l.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var B,P,F;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    label: "Assigned users",
    defaultData: [[], SAMPLE_DATA![0]],
    readOnly: true
  }
}`,...(F=(P=i.parameters)==null?void 0:P.docs)==null?void 0:F.source}}};const Te=["Default","Grouped","SideBySide","NoSearch","StaticError","StaticDisabled","Empty","ReadOnly"];export{e as Default,l as Empty,r as Grouped,s as NoSearch,i as ReadOnly,a as SideBySide,o as StaticDisabled,t as StaticError,Te as __namedExportsOrder,ye as default};
