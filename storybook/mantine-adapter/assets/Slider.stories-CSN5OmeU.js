import{j as e}from"./iframe-B9MPe3wh.js";import{S as h}from"./Slider-BCijdaqH.js";import{f as te}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./WithReadOnlyWrapper-2qCedWf3.js";import"./FormControlWrapper-BASTPEI8.js";import"./get-size-CArEUBr1.js";import"./factory-BkbUWSy9.js";import"./polymorphic-factory-BUPCnNuS.js";import"./create-optional-context-Cf43e3pF.js";import"./use-resolved-styles-api-C1bRtKtp.js";import"./CloseButton-CBvs0C0i.js";import"./UnstyledButton-CHKTXXh4.js";import"./use-id-Cz25Eipr.js";import"./AssistiveElement-DyK0F5gf.js";import"./ReadOnlyField-B4MMOMtV.js";import"./DirectionProvider-sZKeQGt_.js";import"./create-safe-context-tKf69UVi.js";import"./Transition-BWn-SPvP.js";import"./index-B8qCIkdF.js";import"./index-C-1IClgr.js";import"./use-reduced-motion-CLK7P7FD.js";import"./use-uncontrolled-C6jaezbP.js";import"./clamp-DTmYCdls.js";import"./use-merged-ref-DLD8H9BQ.js";const Ie={title:"UI-Kit/Slider",component:h,tags:["autodocs"],parameters:{docs:{description:{component:"\nThe `Slider` component wraps Mantine's Slider to support a premium design system, a bidirectional input state, \ncustom min/max labels, step indicators, and strict states like error, disabled, and read-only.\n\n### Architecture\nThe component uses Recursica's unified `FormControlWrapper` and `<WithReadOnlyWrapper>` to render consistent form layouts (stacked, side-by-side) and read-only representations.\nAll visual properties map perfectly to token values inside `Slider.module.css`.\n"}}},argTypes:{...te,disabled:{control:"boolean",description:"Disables both the slider track and the text input field."},error:{control:"text",description:"Places the slider in an error state with custom border/icon highlights."},required:{control:"boolean"},label:{control:"text",description:"Outer form control label."},assistiveText:{control:"text",description:"Assistive text rendered below or beside the component."},readOnly:{control:"boolean",description:"Puts the component in static read-only mode."},showInput:{control:"boolean",description:"Controls whether the numeric input box is visible."},showMinMaxLabels:{control:"boolean",description:"Toggles rendering of min/max labels below the track."}}},t={args:{label:"Auditory Threshold",assistiveText:"Specify the maximum decibel frequency boundary.",defaultValue:60,min:10,max:100,step:1,showMinMaxLabels:!0}},a={args:{...t.args,showInput:!0}},o={args:{...t.args,formLayout:"side-by-side"}},s={args:{label:"Decommissioned Server Node",assistiveText:"Modifications to this environment are frozen.",defaultValue:35,disabled:!0}},n={args:{label:"Core Temperature Alert",assistiveText:"Severe core degradation across the hypervisor socket cluster.",defaultValue:85,error:"Thermal overload threshold exceeded.",required:!0}},i={args:{label:"System Calibration Metrics",assistiveText:"Frozen baseline calibrations derived during initial staging.",value:65,readOnly:!0}},l={args:{label:"Adaptive Node Output",assistiveText:"Click edit to unlock bidirectional input parameter boundaries.",defaultValue:15,readOnly:!0,labelWithEditIcon:!0}},d={args:{label:"Interactive Marks Map",defaultValue:50,min:0,max:100,step:10,marks:[{value:0,label:"0%"},{value:25,label:"25%"},{value:50,label:"50%"},{value:75,label:"75%"},{value:100,label:"100%"}],showMinMaxLabels:!1}},u={args:{label:"Volume",assistiveText:"Icons flank the track; min/max labels replace the raw bounds.",defaultValue:60,minLabel:"Quiet",maxLabel:"Loud",tooltipLabel:g=>`${g}%`,icon:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5"})}),trailingIcon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}),e.jsx("path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07"}),e.jsx("path",{d:"M19.07 4.93a10 10 0 0 1 0 14.14"})]})}},r={args:{label:"Price Range",assistiveText:"Pass a [number, number] tuple to render two thumbs.",defaultValue:[20,80],min:0,max:100,showMinMaxLabels:!0}},c={args:{...r.args,showInput:!0}},p={args:{label:"Price Range",assistiveText:"Full range usage: leading/trailing icons, min/max label overrides, and both bound inputs.",defaultValue:[20,80],min:0,max:100,showInput:!0,minLabel:"$0",maxLabel:"$100",tooltipLabel:g=>`$${g}`,icon:e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5"})}),trailingIcon:e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polygon",{points:"11 5 6 9 2 9 2 15 6 15 11 19 11 5"}),e.jsx("path",{d:"M15.54 8.46a5 5 0 0 1 0 7.07"}),e.jsx("path",{d:"M19.07 4.93a10 10 0 0 1 0 14.14"})]})}},m={render:()=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"2.5rem",maxWidth:600},children:[e.jsx(h,{label:"Stacked Layout",assistiveText:"This is the standard top-to-bottom stacked form layout.",defaultValue:40,formLayout:"stacked"}),e.jsx(h,{label:"Side-by-Side Layout",assistiveText:"This is the side-by-side layout aligning label beside control.",defaultValue:60,formLayout:"side-by-side"})]})};var b,x,v;t.parameters={...t.parameters,docs:{...(b=t.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    label: "Auditory Threshold",
    assistiveText: "Specify the maximum decibel frequency boundary.",
    defaultValue: 60,
    min: 10,
    max: 100,
    step: 1,
    showMinMaxLabels: true
  }
}`,...(v=(x=t.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};var y,w,f;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    showInput: true
  }
}`,...(f=(w=a.parameters)==null?void 0:w.docs)==null?void 0:f.source}}};var k,L,S;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    formLayout: "side-by-side"
  }
}`,...(S=(L=o.parameters)==null?void 0:L.docs)==null?void 0:S.source}}};var M,T,I;s.parameters={...s.parameters,docs:{...(M=s.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    label: "Decommissioned Server Node",
    assistiveText: "Modifications to this environment are frozen.",
    defaultValue: 35,
    disabled: true
  }
}`,...(I=(T=s.parameters)==null?void 0:T.docs)==null?void 0:I.source}}};var j,W,V;n.parameters={...n.parameters,docs:{...(j=n.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: "Core Temperature Alert",
    assistiveText: "Severe core degradation across the hypervisor socket cluster.",
    defaultValue: 85,
    error: "Thermal overload threshold exceeded.",
    required: true
  }
}`,...(V=(W=n.parameters)==null?void 0:W.docs)==null?void 0:V.source}}};var R,C,A;i.parameters={...i.parameters,docs:{...(R=i.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    label: "System Calibration Metrics",
    assistiveText: "Frozen baseline calibrations derived during initial staging.",
    value: 65,
    readOnly: true
  }
}`,...(A=(C=i.parameters)==null?void 0:C.docs)==null?void 0:A.source}}};var O,D,B;l.parameters={...l.parameters,docs:{...(O=l.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    label: "Adaptive Node Output",
    assistiveText: "Click edit to unlock bidirectional input parameter boundaries.",
    defaultValue: 15,
    readOnly: true,
    labelWithEditIcon: true
  }
}`,...(B=(D=l.parameters)==null?void 0:D.docs)==null?void 0:B.source}}};var $,F,E;d.parameters={...d.parameters,docs:{...($=d.parameters)==null?void 0:$.docs,source:{originalSource:`{
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
}`,...(E=(F=d.parameters)==null?void 0:F.docs)==null?void 0:E.source}}};var P,q,z;u.parameters={...u.parameters,docs:{...(P=u.parameters)==null?void 0:P.docs,source:{originalSource:`{
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
}`,...(z=(q=u.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var N,Q,_;r.parameters={...r.parameters,docs:{...(N=r.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    label: "Price Range",
    assistiveText: "Pass a [number, number] tuple to render two thumbs.",
    defaultValue: [20, 80],
    min: 0,
    max: 100,
    showMinMaxLabels: true
  }
}`,...(_=(Q=r.parameters)==null?void 0:Q.docs)==null?void 0:_.source}}};var K,U,G;c.parameters={...c.parameters,docs:{...(K=c.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    ...RangeMode.args,
    showInput: true
  }
}`,...(G=(U=c.parameters)==null?void 0:U.docs)==null?void 0:G.source}}};var H,J,X;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    label: "Price Range",
    assistiveText: "Full range usage: leading/trailing icons, min/max label overrides, and both bound inputs.",
    defaultValue: [20, 80],
    min: 0,
    max: 100,
    showInput: true,
    minLabel: "$0",
    maxLabel: "$100",
    tooltipLabel: (value: number) => \`$\${value}\`,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      </svg>,
    trailingIcon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
      </svg>
  }
}`,...(X=(J=p.parameters)==null?void 0:J.docs)==null?void 0:X.source}}};var Y,Z,ee;m.parameters={...m.parameters,docs:{...(Y=m.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: "2.5rem",
    maxWidth: 600
  }}>
      <Slider label="Stacked Layout" assistiveText="This is the standard top-to-bottom stacked form layout." defaultValue={40} formLayout="stacked" />
      <Slider label="Side-by-Side Layout" assistiveText="This is the side-by-side layout aligning label beside control." defaultValue={60} formLayout="side-by-side" />
    </div>
}`,...(ee=(Z=m.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};const je=["Default","WithInputField","SideBySideLayout","Disabled","ErrorState","StaticReadOnly","EditableReadOnly","WithMarks","WithIconsAndLabels","RangeMode","RangeModeWithInputs","RangeModeWithIconsAndInputs","FormLayouts"];export{t as Default,s as Disabled,l as EditableReadOnly,n as ErrorState,m as FormLayouts,r as RangeMode,p as RangeModeWithIconsAndInputs,c as RangeModeWithInputs,o as SideBySideLayout,i as StaticReadOnly,u as WithIconsAndLabels,a as WithInputField,d as WithMarks,je as __namedExportsOrder,Ie as default};
