import{j as e}from"./iframe-q_g-lagv.js";import{S as c}from"./Slider-p-6q6ScV.js";import{f as Q}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-ChyO9rP0.js";import"./FormControlWrapper-DMSxREOP.js";import"./get-size-Sn4lhVq-.js";import"./factory-CHICaA9J.js";import"./polymorphic-factory-DwIfLF0y.js";import"./create-optional-context-BU3S27wk.js";import"./use-resolved-styles-api-BkcUVl7d.js";import"./CloseButton-DJzp3_qZ.js";import"./UnstyledButton-BA6vmwI6.js";import"./use-id-C9TR6T4C.js";import"./AssistiveElement-BiVAqSN6.js";import"./ReadOnlyField-BimPp7KM.js";import"./DirectionProvider-D2IHzrto.js";import"./create-safe-context-BjPefawz.js";import"./Transition-JQTtmUOG.js";import"./index-CKC3laIl.js";import"./index-DFI-f6hd.js";import"./use-reduced-motion-CpxCSsIX.js";import"./use-uncontrolled-DKRvRs0n.js";import"./clamp-DTmYCdls.js";import"./use-merged-ref-BLLg8Jj4.js";const he={title:"UI-Kit/Slider",component:c,tags:["autodocs"],parameters:{docs:{description:{component:"\nThe `Slider` component wraps Mantine's Slider to support a premium design system, a bidirectional input state, \ncustom min/max labels, step indicators, and strict states like error, disabled, and read-only.\n\n### Architecture\nThe component uses Recursica's unified `FormControlWrapper` and `<WithReadOnlyWrapper>` to render consistent form layouts (stacked, side-by-side) and read-only representations.\nAll visual properties map perfectly to token values inside `Slider.module.css`.\n"}}},argTypes:{...Q,disabled:{control:"boolean",description:"Disables both the slider track and the text input field."},error:{control:"text",description:"Places the slider in an error state with custom border/icon highlights."},required:{control:"boolean"},label:{control:"text",description:"Outer form control label."},assistiveText:{control:"text",description:"Assistive text rendered below or beside the component."},readOnly:{control:"boolean",description:"Puts the component in static read-only mode."},showInput:{control:"boolean",description:"Controls whether the numeric input box is visible."},showMinMaxLabels:{control:"boolean",description:"Toggles rendering of min/max labels below the track."}}},t={args:{label:"Auditory Threshold",assistiveText:"Specify the maximum decibel frequency boundary.",defaultValue:60,min:10,max:100,step:1,showMinMaxLabels:!0}},r={args:{...t.args,showInput:!0}},a={args:{...t.args,formLayout:"side-by-side"}},s={args:{label:"Decommissioned Server Node",assistiveText:"Modifications to this environment are frozen.",defaultValue:35,disabled:!0}},o={args:{label:"Core Temperature Alert",assistiveText:"Severe core degradation across the hypervisor socket cluster.",defaultValue:85,error:"Thermal overload threshold exceeded.",required:!0}},i={args:{label:"System Calibration Metrics",assistiveText:"Frozen baseline calibrations derived during initial staging.",value:65,readOnly:!0}},n={args:{label:"Adaptive Node Output",assistiveText:"Click edit to unlock bidirectional input parameter boundaries.",defaultValue:15,readOnly:!0,labelWithEditIcon:!0}},l={args:{label:"Interactive Marks Map",defaultValue:50,min:0,max:100,step:10,marks:[{value:0,label:"0%"},{value:25,label:"25%"},{value:50,label:"50%"},{value:75,label:"75%"},{value:100,label:"100%"}],showMinMaxLabels:!1}},d={args:{label:"Volume",assistiveText:"Icons flank the track; min/max labels replace the raw bounds.",defaultValue:60,minLabel:"Quiet",maxLabel:"Loud",tooltipLabel:P=>`${P}%`,icon:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5"})}),trailingIcon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}),e.jsx("path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07"}),e.jsx("path",{d:"M19.07 4.93a10 10 0 0 1 0 14.14"})]})}},u={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2.5rem",maxWidth:600},children:[e.jsx(c,{label:"Stacked Layout",assistiveText:"This is the standard top-to-bottom stacked form layout.",defaultValue:40,formLayout:"stacked"}),e.jsx(c,{label:"Side-by-Side Layout",assistiveText:"This is the side-by-side layout aligning label beside control.",defaultValue:60,formLayout:"side-by-side"})]})};var p,m,b;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    label: "Auditory Threshold",
    assistiveText: "Specify the maximum decibel frequency boundary.",
    defaultValue: 60,
    min: 10,
    max: 100,
    step: 1,
    showMinMaxLabels: true
  }
}`,...(b=(m=t.parameters)==null?void 0:m.docs)==null?void 0:b.source}}};var h,g,x;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showInput: true
  }
}`,...(x=(g=r.parameters)==null?void 0:g.docs)==null?void 0:x.source}}};var y,v,f;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    formLayout: "side-by-side"
  }
}`,...(f=(v=a.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var k,S,w;s.parameters={...s.parameters,docs:{...(k=s.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Decommissioned Server Node",
    assistiveText: "Modifications to this environment are frozen.",
    defaultValue: 35,
    disabled: true
  }
}`,...(w=(S=s.parameters)==null?void 0:S.docs)==null?void 0:w.source}}};var L,T,M;o.parameters={...o.parameters,docs:{...(L=o.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    label: "Core Temperature Alert",
    assistiveText: "Severe core degradation across the hypervisor socket cluster.",
    defaultValue: 85,
    error: "Thermal overload threshold exceeded.",
    required: true
  }
}`,...(M=(T=o.parameters)==null?void 0:T.docs)==null?void 0:M.source}}};var V,W,I;i.parameters={...i.parameters,docs:{...(V=i.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    label: "System Calibration Metrics",
    assistiveText: "Frozen baseline calibrations derived during initial staging.",
    value: 65,
    readOnly: true
  }
}`,...(I=(W=i.parameters)==null?void 0:W.docs)==null?void 0:I.source}}};var j,O,C;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: "Adaptive Node Output",
    assistiveText: "Click edit to unlock bidirectional input parameter boundaries.",
    defaultValue: 15,
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(C=(O=n.parameters)==null?void 0:O.docs)==null?void 0:C.source}}};var A,D,E;l.parameters={...l.parameters,docs:{...(A=l.parameters)==null?void 0:A.docs,source:{originalSource:`{
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
}`,...(E=(D=l.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var F,R,B;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    label: "Volume",
    assistiveText: "Icons flank the track; min/max labels replace the raw bounds.",
    defaultValue: 60,
    minLabel: "Quiet",
    maxLabel: "Loud",
    tooltipLabel: (value: number) => \`\${value}%\`,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      </svg>,
    trailingIcon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
  }
}`,...(B=(R=d.parameters)==null?void 0:R.docs)==null?void 0:B.source}}};var q,z,N;u.parameters={...u.parameters,docs:{...(q=u.parameters)==null?void 0:q.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
    maxWidth: 600
  }}>
      <Slider label="Stacked Layout" assistiveText="This is the standard top-to-bottom stacked form layout." defaultValue={40} formLayout="stacked" />
      <Slider label="Side-by-Side Layout" assistiveText="This is the side-by-side layout aligning label beside control." defaultValue={60} formLayout="side-by-side" />
    </div>
}`,...(N=(z=u.parameters)==null?void 0:z.docs)==null?void 0:N.source}}};const ge=["Default","WithInputField","SideBySideLayout","Disabled","ErrorState","StaticReadOnly","EditableReadOnly","WithMarks","WithIconsAndLabels","FormLayouts"];export{t as Default,s as Disabled,n as EditableReadOnly,o as ErrorState,u as FormLayouts,a as SideBySideLayout,i as StaticReadOnly,d as WithIconsAndLabels,r as WithInputField,l as WithMarks,ge as __namedExportsOrder,he as default};
