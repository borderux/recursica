import{T as G}from"./TransferList-BLjf_iHr.js";import{f as k}from"./commonArgTypes-DcjzA9l3.js";import"./iframe-q_g-lagv.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-ChyO9rP0.js";import"./FormControlWrapper-DMSxREOP.js";import"./get-size-Sn4lhVq-.js";import"./factory-CHICaA9J.js";import"./polymorphic-factory-DwIfLF0y.js";import"./create-optional-context-BU3S27wk.js";import"./use-resolved-styles-api-BkcUVl7d.js";import"./CloseButton-DJzp3_qZ.js";import"./UnstyledButton-BA6vmwI6.js";import"./use-id-C9TR6T4C.js";import"./AssistiveElement-BiVAqSN6.js";import"./ReadOnlyField-BimPp7KM.js";import"./Badge-NRrKm1yp.js";import"./Button-B1QxIpr6.js";import"./Loader-B66im5kF.js";import"./Loader-CqmKbCrD.js";import"./Transition-JQTtmUOG.js";import"./index-CKC3laIl.js";import"./index-DFI-f6hd.js";import"./use-reduced-motion-CpxCSsIX.js";import"./TextField-Db6auRtP.js";import"./Checkbox-BcXYs3Ov.js";import"./get-auto-contrast-value-Da6zqqWm.js";import"./InputsGroupFieldset-CFfvTTp7.js";import"./use-uncontrolled-DKRvRs0n.js";import"./CheckIcon-CeyUiW7o.js";const i=[[{value:"alpha",label:"Alpha"},{value:"bravo",label:"Bravo"},{value:"charlie",label:"Charlie"},{value:"delta",label:"Delta"},{value:"echo",label:"Echo"}],[{value:"foxtrot",label:"Foxtrot"}]],M=[[{value:"apple",label:"Apple",group:"Fruit"},{value:"banana",label:"Banana",group:"Fruit"},{value:"carrot",label:"Carrot",group:"Vegetable"},{value:"daikon",label:"Daikon",group:"Vegetable"},{value:"eagle",label:"Eagle"}],[]],ue={title:"UI-Kit/TransferList",component:G,tags:["autodocs"],parameters:{docs:{description:{component:"TransferList (dual listbox) lets users move items between two lists. Composes FormControlWrapper, TextField, Checkbox, CheckboxGroup, Badge, and Button."}}},args:{label:"Assign users",assistiveText:"Move users into the selected list.",defaultData:i,disabled:!1,required:!1},argTypes:{disabled:{control:"boolean"},...k,sourceLabel:{control:"text"},targetLabel:{control:"text"},searchable:{control:"boolean"},searchPlaceholder:{control:"text"}}},e={},r={args:{label:"Assign ingredients",defaultData:M}},a={args:{formLayout:"side-by-side"}},s={args:{label:"Assign users (no filtering)",searchable:!1}},t={args:{error:"Select at least one user.",defaultData:[[],i[0]]}},o={args:{disabled:!0}},l={args:{label:"Assign users",defaultData:[[],[]]}},n={args:{label:"Assigned users",defaultData:[[],i[0]],readOnly:!0}};var c,p,m;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:"{}",...(m=(p=e.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,d,g;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(_=(O=l.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var B,P,F;n.parameters={...n.parameters,docs:{...(B=n.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    label: "Assigned users",
    defaultData: [[], SAMPLE_DATA![0]],
    readOnly: true
  }
}`,...(F=(P=n.parameters)==null?void 0:P.docs)==null?void 0:F.source}}};const de=["Default","Grouped","SideBySide","NoSearch","StaticError","StaticDisabled","Empty","ReadOnly"];export{e as Default,l as Empty,r as Grouped,s as NoSearch,n as ReadOnly,a as SideBySide,o as StaticDisabled,t as StaticError,de as __namedExportsOrder,ue as default};
