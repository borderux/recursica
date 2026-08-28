import{j as e}from"./iframe-Bain31R0.js";import{D as K}from"./Dropdown-yh6dafCt.js";import{f as Y}from"./commonArgTypes-DcjzA9l3.js";import{r as q}from"./renderRichOption-sstob_Ox.js";import{s as a}from"./Dropdown.module-Cgkce6KW.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-U9rCldPJ.js";import"./FormControlWrapper-MNtMw0bK.js";import"./AssistiveElement-Bj-nGoU0.js";import"./useFormControl-CHzY-kBe.js";import"./memoTheme-C8oOPpFq.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./isMuiElement-epe0QGZM.js";import"./ReadOnlyField-DZ61falH.js";import"./Select-XAqoODTn.js";import"./SelectFocusSourceContext-CccT5BY-.js";import"./useSlot-BYP_jPjY.js";import"./mergeSlotProps-DT6hk6s3.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-itiL0CSC.js";import"./useSlotProps-C3Q0yARB.js";import"./Paper-g7HoWqDO.js";import"./useTheme-DfdQqc5m.js";import"./ownerDocument-DW-IO8s5.js";import"./ownerWindow-HkKU3E4x.js";import"./debounce-Be36O1Ab.js";import"./Grow-CbNdZqu3.js";import"./utils-gQhUfUfP.js";import"./useTimeout-DrzpHnwK.js";import"./index-TLVyyQ7L.js";import"./index-DOUe8wrs.js";import"./Portal-DCDNgx_V.js";import"./mergeSlotProps-tLrn7IGQ.js";import"./Modal-DQvfdOPu.js";import"./useEventCallback-B-qTP8Ut.js";import"./createChainedFunction-BO_9K8Jh.js";import"./getActiveElement-BwNsGdKK.js";import"./contains-B5PScIlI.js";import"./List-DGF1S56P.js";import"./useControlled-COkTbN2W.js";import"./createSvgIcon--Z68nxbq.js";import"./InputBase-DMbRGxKt.js";import"./MenuItem-Cr8HlPcG.js";import"./ButtonBase-nOQ6vh2E.js";import"./isFocusVisible-B8k4qzLc.js";const He={title:"UI-Kit/Dropdown",component:K,tags:["autodocs"],parameters:{docs:{description:{component:"Dropdown provides a selectable list of options, mapping natively over Mantine's Select component encapsulated within the standardized FormControlWrapper."}}},args:{label:"Country Selection",assistiveText:"Select your country of origin.",placeholder:"Pick value",data:["United States","Canada","Mexico","United Kingdom","France"],disabled:!1,required:!1,readOnly:!1,searchable:!1,clearable:!1},argTypes:{disabled:{control:"boolean"},...Y,readOnly:{control:"boolean"},searchable:{control:"boolean"},clearable:{control:"boolean"},wrapItemText:{control:"boolean",description:"Wraps option label/supportingText onto additional lines instead of truncating with an ellipsis."},containerWidth:{table:{disable:!0}}}},o={args:{}},t={args:{label:"Search & Clear Options",searchable:!0,clearable:!0,placeholder:"Start typing..."}},n={args:{label:"Destination",startAdornment:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"}),e.jsx("circle",{cx:"12",cy:"10",r:"3"})]})}},r=e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"12",cy:"7",r:"4"})]}),s={args:{label:"Assignee",placeholder:"Pick a team member",assistiveText:"Each option can show a leading icon and supporting text — see MANTINE_ADAPTER_RICH_OPTION_DATA.md.",data:[{value:"jdoe",label:"Jane Doe",leadingIcon:r,supportingText:"jane.doe@example.com"},{value:"asmith",label:"Alex Smith",leadingIcon:r,supportingText:"alex.smith@example.com"},{value:"unassigned",label:"Unassigned"}]}},i={args:{label:"Assignee",placeholder:"Pick a team member",wrapItemText:!0,data:[{value:"jdoe",label:"Jane Doe, Senior Staff Engineer, Platform Infrastructure",leadingIcon:r,supportingText:"jane.doe@example.com — Platform Infrastructure team, on-call rotation lead"},{value:"unassigned",label:"Unassigned"}],assistiveText:"wrapItemText=true — long label/supportingText wrap instead of truncating."}},G={optionContent:a.optionContent,optionIcon:a.optionIcon,optionText:a.optionText,optionTextWrap:a.optionTextWrap,optionSupportingText:a.optionSupportingText},Q=[{value:"icon-and-supporting",label:"Jane Doe",leadingIcon:r,supportingText:"jane.doe@example.com"},{value:"no-icon",label:"Alex Smith",supportingText:"No leadingIcon — label/supportingText shift left, no reserved icon space"},{value:"no-supporting-text",label:"Taylor Rivera",leadingIcon:r},{value:"plain",label:"Plain option — no leadingIcon, no supportingText"},{value:"long-text",label:"A very long option label that, with wrapItemText, wraps onto a second line instead of overflowing the fixed-width dropdown — otherwise it truncates with an ellipsis",leadingIcon:r,supportingText:"A similarly long supporting text string, to confirm the same wrap-or-truncate behavior applies to it too"}],V=F=>e.jsx("div",{className:a.dropdown,style:{width:"var(--recursica_ui-kit_components_dropdown_variants_layouts_stacked_properties_max-width)"},children:Q.map(u=>e.jsx("div",{className:a.option,children:q(u,G,F)},u.value))}),l={parameters:{controls:{disable:!0}},render:()=>V(!1)},p={parameters:{controls:{disable:!0}},render:()=>V(!0)},c={args:{error:"You must choose a valid destination.",value:"Invalid Island"}},d={args:{disabled:!0,value:"United States"}},m={args:{label:"Read Only View",readOnly:!0,value:"Canada"}};var g,h,x;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {}
}`,...(x=(h=o.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};var b,v,w;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: "Search & Clear Options",
    searchable: true,
    clearable: true,
    placeholder: "Start typing..."
  }
}`,...(w=(v=t.parameters)==null?void 0:v.docs)==null?void 0:w.source}}};var T,f,I;n.parameters={...n.parameters,docs:{...(T=n.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    label: "Destination",
    startAdornment: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
  }
}`,...(I=(f=n.parameters)==null?void 0:f.docs)==null?void 0:I.source}}};var S,O,R;s.parameters={...s.parameters,docs:{...(S=s.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    label: "Assignee",
    placeholder: "Pick a team member",
    assistiveText: "Each option can show a leading icon and supporting text — see MANTINE_ADAPTER_RICH_OPTION_DATA.md.",
    data: [{
      value: "jdoe",
      label: "Jane Doe",
      leadingIcon: UserIcon,
      supportingText: "jane.doe@example.com"
    }, {
      value: "asmith",
      label: "Alex Smith",
      leadingIcon: UserIcon,
      supportingText: "alex.smith@example.com"
    }, {
      value: "unassigned",
      label: "Unassigned"
    }]
  }
}`,...(R=(O=s.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};var y,P,j;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    label: "Assignee",
    placeholder: "Pick a team member",
    wrapItemText: true,
    data: [{
      value: "jdoe",
      label: "Jane Doe, Senior Staff Engineer, Platform Infrastructure",
      leadingIcon: UserIcon,
      supportingText: "jane.doe@example.com — Platform Infrastructure team, on-call rotation lead"
    }, {
      value: "unassigned",
      label: "Unassigned"
    }],
    assistiveText: "wrapItemText=true — long label/supportingText wrap instead of truncating."
  }
}`,...(j=(P=i.parameters)==null?void 0:P.docs)==null?void 0:j.source}}};var A,_,W;l.parameters={...l.parameters,docs:{...(A=l.parameters)==null?void 0:A.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => renderOptionRowPreview(false)
}`,...(W=(_=l.parameters)==null?void 0:_.docs)==null?void 0:W.source}}};var k,C,D;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => renderOptionRowPreview(true)
}`,...(D=(C=p.parameters)==null?void 0:C.docs)==null?void 0:D.source}}};var E,U,N;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    error: "You must choose a valid destination.",
    value: "Invalid Island"
  }
}`,...(N=(U=c.parameters)==null?void 0:U.docs)==null?void 0:N.source}}};var L,M,J;d.parameters={...d.parameters,docs:{...(L=d.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    disabled: true,
    value: "United States"
  }
}`,...(J=(M=d.parameters)==null?void 0:M.docs)==null?void 0:J.source}}};var z,B,H;m.parameters={...m.parameters,docs:{...(z=m.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    label: "Read Only View",
    readOnly: true,
    value: "Canada"
  }
}`,...(H=(B=m.parameters)==null?void 0:B.docs)==null?void 0:H.source}}};const Ve=["Default","SearchableClearable","WithLeadingIcon","WithRichOptions","WithRichOptionsWrapped","RichOptionRowPreview","RichOptionRowPreviewWrapped","StaticError","StaticDisabled","StaticReadOnly"];export{o as Default,l as RichOptionRowPreview,p as RichOptionRowPreviewWrapped,t as SearchableClearable,d as StaticDisabled,c as StaticError,m as StaticReadOnly,n as WithLeadingIcon,s as WithRichOptions,i as WithRichOptionsWrapped,Ve as __namedExportsOrder,He as default};
