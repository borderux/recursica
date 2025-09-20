import{j as e}from"./iframe-dbytajQO.js";import{C as l}from"./Chip-Bu1T0WXR.js";import{F as i}from"./Flex-CFOTG_Tn.js";import"./preload-helper-CZ_saIiD.js";import"./Icon-Ccox_JMs.js";import"./Typography.css.ts.vanilla-DQO5FK-a.js";import"./Box-Bb1kiBkX.js";import"./polymorphic-factory-0QkwTdYd.js";import"./CheckIcon-F_es3FSN.js";import"./create-optional-context-mFI0ivTZ.js";import"./use-uncontrolled-Brp-5qDk.js";import"./use-id-q1_4zNAf.js";import"./getBoxStyles-DIWjwvrK.js";import"./Flex-CkjH3hni.js";const T={title:"Chip/Group",component:l,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{}},a={render:()=>e.jsx(l.Group,{children:e.jsxs(i,{gap:8,children:[e.jsx(l,{value:"1",label:"Single chip"}),e.jsx(l,{value:"2",label:"Can be selected"}),e.jsx(l,{value:"3",label:"At a time"})," ",e.jsx(l,{value:"4",label:"At a time",icon:{unselected:"heart_outline",selected:"heart_solid"}})]})})},t={render:()=>e.jsx(l.Group,{multiple:!0,children:e.jsxs(i,{gap:8,children:[e.jsx(l,{value:"1",label:"Multiple chips"}),e.jsx(l,{value:"2",label:"Can be selected"}),e.jsx(l,{value:"3",label:"At a time"}),e.jsx(l,{value:"4",label:"At a time",icon:{unselected:"heart_outline",selected:"heart_solid"}})]})})},r={render:()=>e.jsx(l.Group,{defaultValue:"2",children:e.jsxs(i,{gap:8,children:[e.jsx(l,{value:"1",label:"First"}),e.jsx(l,{value:"2",label:"Second"}),e.jsx(l,{value:"3",label:"Third"})," ",e.jsx(l,{value:"4",label:"At a time",icon:{unselected:"heart_outline",selected:"heart_solid"}})]})})};var n,s,o;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => <Chip.Group>
      <Flex gap={8}>
        <Chip value="1" label="Single chip" />
        <Chip value="2" label="Can be selected" />
        <Chip value="3" label="At a time" />{" "}
        <Chip value="4" label="At a time" icon={{
        unselected: "heart_outline",
        selected: "heart_solid"
      }} />
      </Flex>
    </Chip.Group>
}`,...(o=(s=a.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var p,u,c;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <Chip.Group multiple>
      <Flex gap={8}>
        <Chip value="1" label="Multiple chips" />
        <Chip value="2" label="Can be selected" />
        <Chip value="3" label="At a time" />
        <Chip value="4" label="At a time" icon={{
        unselected: "heart_outline",
        selected: "heart_solid"
      }} />
      </Flex>
    </Chip.Group>
}`,...(c=(u=t.parameters)==null?void 0:u.docs)==null?void 0:c.source}}};var d,h,m;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <Chip.Group defaultValue="2">
      <Flex gap={8}>
        <Chip value="1" label="First" />
        <Chip value="2" label="Second" />
        <Chip value="3" label="Third" />{" "}
        <Chip value="4" label="At a time" icon={{
        unselected: "heart_outline",
        selected: "heart_solid"
      }} />
      </Flex>
    </Chip.Group>
}`,...(m=(h=r.parameters)==null?void 0:h.docs)==null?void 0:m.source}}};const y=["SingleSelection","MultipleSelection","WithDefaultValue"];export{t as MultipleSelection,a as SingleSelection,r as WithDefaultValue,y as __namedExportsOrder,T as default};
