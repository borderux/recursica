import{j as z}from"./iframe-4oz2vDEb.js";import{L as M}from"./Label-Cr34TkZw.js";import{B as N}from"./Button-CtTGpGVG.js";import"./preload-helper-Dp1pzeXC.js";import"./formControlState-Dq1zat_P.js";import"./useFormControl-Df5h-U30.js";import"./memoTheme-DYm0d07S.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./Loader-g1VNCh7M.js";import"./Button-DbTPS29q.js";import"./ButtonBase-DFDhNXBe.js";import"./useTimeout-CPSYxtd6.js";import"./useForkRef-Bvs5Kkb7.js";import"./useEventCallback-D7tIRzRk.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-DPe7o8A7.js";const te={title:"UI-Kit/Label",component:M,tags:["autodocs"],parameters:{docs:{description:{component:"The `Label` component is a strict Recursica-styled wrapper around Mantine's native `Input.Label`. It serves as the primary compositional primitive for all form fields, preserving Mantine's accessibility associations and context while strictly enforcing the Recursica atomic design system.\n\n### Usage with Form Inputs\nThis component only renders the label itself — layout concerns like `stacked` vs `side-by-side` positioning relative to an input live on `FormControlLayout`/`FormControlWrapper`, not here. Render this `Label` in isolation to verify its own states, or see `UI-Kit/FormControlLayout` for how it composes into a full form field."}}},argTypes:{labelSize:{control:"inline-radio",options:["default","small","md"],description:"Sizing metrics for the Label. Only visually distinguishable once composed inside a `side-by-side` FormControlLayout, which is where the resulting width constraint applies."},labelAlignment:{control:"inline-radio",options:["left","right"],description:"Text alignment of the label content."},required:{control:"boolean",description:"Renders the required asterisk (suppressed automatically when `labelWithEditIcon` is set, and mutually exclusive with `labelOptionalText`)."},labelOptionalText:{control:"text",description:"Secondary text rendered beneath the label. Pass `true` for the default '(Optional)' string, or a custom node/string. Suppressed when `required` is true."},labelWithEditIcon:{control:"boolean",description:"Replaces the default edit icon slot with an interactive edit affordance; replaces the required asterisk visually when both are set."},labelActionArea:{table:{disable:!0}},onLabelEditClick:{table:{disable:!0}}}},e={args:{children:"Label",labelSize:"default",labelAlignment:"left",required:!1,labelOptionalText:"",labelWithEditIcon:!1}},r={args:{children:"Required Field",required:!0}},t={args:{children:"Full Name",required:!0,labelOptionalText:"This should not render"}},i={args:{children:"Bio",labelOptionalText:"Max 100 characters"}},a={args:{children:"Middle Initial",labelOptionalText:!0}},o={args:{children:"Shipping Address",labelWithEditIcon:!0}},n={args:{children:"Primary Network Node",required:!0,labelWithEditIcon:!0}},s={args:{children:"Status",labelAlignment:"right"}},l={args:{children:"Configuration",labelActionArea:z.jsx(N,{variant:"text",size:"small",children:"Edit"})}};var c,d,p;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    children: "Label",
    labelSize: "default",
    labelAlignment: "left",
    required: false,
    labelOptionalText: "",
    labelWithEditIcon: false
  }
}`,...(p=(d=e.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};var u,m,h;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    children: "Required Field",
    required: true
  }
}`,...(h=(m=r.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var g,b,f;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    children: "Full Name",
    required: true,
    labelOptionalText: "This should not render"
  }
}`,...(f=(b=t.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};var x,y,T;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    children: "Bio",
    labelOptionalText: "Max 100 characters"
  }
}`,...(T=(y=i.parameters)==null?void 0:y.docs)==null?void 0:T.source}}};var S,q,A;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    children: "Middle Initial",
    labelOptionalText: true
  }
}`,...(A=(q=a.parameters)==null?void 0:q.docs)==null?void 0:A.source}}};var I,O,E;o.parameters={...o.parameters,docs:{...(I=o.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    children: "Shipping Address",
    labelWithEditIcon: true
  }
}`,...(E=(O=o.parameters)==null?void 0:O.docs)==null?void 0:E.source}}};var W,R,w;n.parameters={...n.parameters,docs:{...(W=n.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    children: "Primary Network Node",
    required: true,
    labelWithEditIcon: true
  }
}`,...(w=(R=n.parameters)==null?void 0:R.docs)==null?void 0:w.source}}};var v,L,F;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: "Status",
    labelAlignment: "right"
  }
}`,...(F=(L=s.parameters)==null?void 0:L.docs)==null?void 0:F.source}}};var B,k,C;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    children: "Configuration",
    labelActionArea: <Button variant="text" size="small">
        Edit
      </Button>
  }
}`,...(C=(k=l.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};const ie=["Default","Required","RequiredSuppressesOptionalText","WithOptionalText","BooleanOptionalText","WithEditIcon","RequiredWithEditIcon","RightAligned","WithActionArea"];export{a as BooleanOptionalText,e as Default,r as Required,t as RequiredSuppressesOptionalText,n as RequiredWithEditIcon,s as RightAligned,l as WithActionArea,o as WithEditIcon,i as WithOptionalText,ie as __namedExportsOrder,te as default};
