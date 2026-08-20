import{T as G}from"./TransferList-B4Zl29IN.js";import{f as k}from"./commonArgTypes-DcjzA9l3.js";import"./iframe-yFO9_h67.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-t7b-1QVb.js";import"./FormControlWrapper-BA3ROMmo.js";import"./AssistiveElement-hSlLnwms.js";import"./useFormControl-VBpSDqz8.js";import"./memoTheme-Cs-mGQPZ.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./isMuiElement-JD1EuSGT.js";import"./ReadOnlyField-CAvWsNZ2.js";import"./Badge-sPxcLS3t.js";import"./usePreviousProps-C9uMgrc1.js";import"./useSlot-GWIS9v9k.js";import"./mergeSlotProps-BE-kXrtt.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-BP39VcSK.js";import"./Button-BTdZXIhK.js";import"./Loader-Ckvm0LyD.js";import"./Button-B0ThBdFh.js";import"./ButtonBase-BmmDnOUH.js";import"./useTimeout-DCc5tZ70.js";import"./useEventCallback-Dhf6GR_Y.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-VtX-y_xH.js";import"./TextField-DCWMpElC.js";import"./InputBase-CXduqXxh.js";import"./ownerDocument-DW-IO8s5.js";import"./getActiveElement-BwNsGdKK.js";import"./ownerWindow-HkKU3E4x.js";import"./debounce-Be36O1Ab.js";import"./Checkbox-y82cEriR.js";import"./FormGroup-IfpPM_KT.js";import"./Checkbox-D5L3GCaw.js";import"./SwitchBase-DTJodWQS.js";import"./useControlled-B2zHLusm.js";import"./createSvgIcon-Do3FOz5r.js";import"./mergeSlotProps-BsdONXtH.js";const n=[[{value:"alpha",label:"Alpha"},{value:"bravo",label:"Bravo"},{value:"charlie",label:"Charlie"},{value:"delta",label:"Delta"},{value:"echo",label:"Echo"}],[{value:"foxtrot",label:"Foxtrot"}]],M=[[{value:"apple",label:"Apple",group:"Fruit"},{value:"banana",label:"Banana",group:"Fruit"},{value:"carrot",label:"Carrot",group:"Vegetable"},{value:"daikon",label:"Daikon",group:"Vegetable"},{value:"eagle",label:"Eagle"}],[]],ye={title:"UI-Kit/TransferList",component:G,tags:["autodocs"],parameters:{docs:{description:{component:"TransferList (dual listbox) lets users move items between two lists. Composes FormControlWrapper, TextField, Checkbox, CheckboxGroup, Badge, and Button."}}},args:{label:"Assign users",assistiveText:"Move users into the selected list.",defaultData:n,disabled:!1,required:!1},argTypes:{disabled:{control:"boolean"},...k,sourceLabel:{control:"text"},targetLabel:{control:"text"},searchable:{control:"boolean"},searchPlaceholder:{control:"text"}}},e={},r={args:{label:"Assign ingredients",defaultData:M}},a={args:{formLayout:"side-by-side"}},s={args:{label:"Assign users (no filtering)",searchable:!1}},t={args:{error:"Select at least one user.",defaultData:[[],n[0]]}},o={args:{disabled:!0}},l={args:{label:"Assign users",defaultData:[[],[]]}},i={args:{label:"Assigned users",defaultData:[[],n[0]],readOnly:!0}};var p,c,m;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:"{}",...(m=(c=e.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var u,d,g;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
