import{j as d}from"./iframe-Cuf5bcGt.js";import{S as c}from"./Slider-D9DiCfds.js";import{f as q}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-BgOnMfEs.js";import"./ReadOnlyField-BlMKP5_a.js";import"./get-size-D9D2jatm.js";import"./factory-DhuYYzZ1.js";import"./polymorphic-factory-Bz0jbgXb.js";import"./create-optional-context-CsuC_XFZ.js";import"./use-resolved-styles-api-CP3D1-fz.js";import"./CloseButton-B0O_EaAM.js";import"./UnstyledButton-CtnQEkUO.js";import"./use-id-DcJBva01.js";import"./AssistiveElement-DGESjLE5.js";import"./DirectionProvider-CsolFZ_S.js";import"./create-safe-context-takb0WuO.js";import"./Transition-DJUpe7ov.js";import"./index-DZRgEdnP.js";import"./index-B8f6u27X.js";import"./use-reduced-motion-BwzeHakd.js";import"./use-uncontrolled-DLIz_o6o.js";import"./clamp-DTmYCdls.js";import"./use-merged-ref-DB9HSSfM.js";const de={title:"UI-Kit/Slider",component:c,tags:["autodocs"],parameters:{docs:{description:{component:"\nThe `Slider` component wraps Mantine's Slider to support a premium design system, a bidirectional input state, \ncustom min/max labels, step indicators, and strict states like error, disabled, and read-only.\n\n### Architecture\nThe component uses Recursica's unified `FormControlWrapper` and `<WithReadOnlyWrapper>` to render consistent form layouts (stacked, side-by-side) and read-only representations.\nAll visual properties map perfectly to token values inside `Slider.module.css`.\n"}}},argTypes:{...q,disabled:{control:"boolean",description:"Disables both the slider track and the text input field."},error:{control:"text",description:"Places the slider in an error state with custom border/icon highlights."},required:{control:"boolean"},label:{control:"text",description:"Outer form control label."},assistiveText:{control:"text",description:"Assistive text rendered below or beside the component."},readOnly:{control:"boolean",description:"Puts the component in static read-only mode."},showInput:{control:"boolean",description:"Controls whether the numeric input box is visible."},showMinMaxLabels:{control:"boolean",description:"Toggles rendering of min/max labels below the track."}}},e={args:{label:"Auditory Threshold",assistiveText:"Specify the maximum decibel frequency boundary.",defaultValue:60,min:10,max:100,step:1,showMinMaxLabels:!0}},a={args:{...e.args,showInput:!0}},r={args:{...e.args,formLayout:"side-by-side"}},t={args:{label:"Decommissioned Server Node",assistiveText:"Modifications to this environment are frozen.",defaultValue:35,disabled:!1}},s={args:{label:"Core Temperature Alert",assistiveText:"Severe core degradation across the hypervisor socket cluster.",defaultValue:85,error:"Thermal overload threshold exceeded.",required:!0}},o={args:{label:"System Calibration Metrics",assistiveText:"Frozen baseline calibrations derived during initial staging.",value:65,readOnly:!0}},i={args:{label:"Adaptive Node Output",assistiveText:"Click edit to unlock bidirectional input parameter boundaries.",defaultValue:15,readOnly:!0,labelWithEditIcon:!0}},n={args:{label:"Interactive Marks Map",defaultValue:50,min:0,max:100,step:10,marks:[{value:0,label:"0%"},{value:25,label:"25%"},{value:50,label:"50%"},{value:75,label:"75%"},{value:100,label:"100%"}],showMinMaxLabels:!1}},l={render:()=>d.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2.5rem",maxWidth:600},children:[d.jsx(c,{label:"Stacked Layout",assistiveText:"This is the standard top-to-bottom stacked form layout.",defaultValue:40,formLayout:"stacked"}),d.jsx(c,{label:"Side-by-Side Layout",assistiveText:"This is the side-by-side layout aligning label beside control.",defaultValue:60,formLayout:"side-by-side"})]})};var u,m,p;e.parameters={...e.parameters,docs:{...(u=e.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    label: "Auditory Threshold",
    assistiveText: "Specify the maximum decibel frequency boundary.",
    defaultValue: 60,
    min: 10,
    max: 100,
    step: 1,
    showMinMaxLabels: true
  }
}`,...(p=(m=e.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var b,y,h;a.parameters={...a.parameters,docs:{...(b=a.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showInput: true
  }
}`,...(h=(y=a.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var f,g,v;r.parameters={...r.parameters,docs:{...(f=r.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    formLayout: "side-by-side"
  }
}`,...(v=(g=r.parameters)==null?void 0:g.docs)==null?void 0:v.source}}};var x,S,T;t.parameters={...t.parameters,docs:{...(x=t.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    label: "Decommissioned Server Node",
    assistiveText: "Modifications to this environment are frozen.",
    defaultValue: 35,
    disabled: false
  }
}`,...(T=(S=t.parameters)==null?void 0:S.docs)==null?void 0:T.source}}};var k,M,L;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Core Temperature Alert",
    assistiveText: "Severe core degradation across the hypervisor socket cluster.",
    defaultValue: 85,
    error: "Thermal overload threshold exceeded.",
    required: true
  }
}`,...(L=(M=s.parameters)==null?void 0:M.docs)==null?void 0:L.source}}};var O,V,w;o.parameters={...o.parameters,docs:{...(O=o.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    label: "System Calibration Metrics",
    assistiveText: "Frozen baseline calibrations derived during initial staging.",
    value: 65,
    readOnly: true
  }
}`,...(w=(V=o.parameters)==null?void 0:V.docs)==null?void 0:w.source}}};var D,W,A;i.parameters={...i.parameters,docs:{...(D=i.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: "Adaptive Node Output",
    assistiveText: "Click edit to unlock bidirectional input parameter boundaries.",
    defaultValue: 15,
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(A=(W=i.parameters)==null?void 0:W.docs)==null?void 0:A.source}}};var I,C,E;n.parameters={...n.parameters,docs:{...(I=n.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    label: "Interactive Marks Map",
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 10,
    marks: [{
      value: 0,
      label: "0%"
    }, {
      value: 25,
      label: "25%"
    }, {
      value: 50,
      label: "50%"
    }, {
      value: 75,
      label: "75%"
    }, {
      value: 100,
      label: "100%"
    }],
    showMinMaxLabels: false
  }
}`,...(E=(C=n.parameters)==null?void 0:C.docs)==null?void 0:E.source}}};var F,R,j;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
    maxWidth: 600
  }}>
      <Slider label="Stacked Layout" assistiveText="This is the standard top-to-bottom stacked form layout." defaultValue={40} formLayout="stacked" />
      <Slider label="Side-by-Side Layout" assistiveText="This is the side-by-side layout aligning label beside control." defaultValue={60} formLayout="side-by-side" />
    </div>
}`,...(j=(R=l.parameters)==null?void 0:R.docs)==null?void 0:j.source}}};const ce=["Default","WithInputField","SideBySideLayout","Disabled","ErrorState","StaticReadOnly","EditableReadOnly","WithMarks","FormLayouts"];export{e as Default,t as Disabled,i as EditableReadOnly,s as ErrorState,l as FormLayouts,r as SideBySideLayout,o as StaticReadOnly,a as WithInputField,n as WithMarks,ce as __namedExportsOrder,de as default};
