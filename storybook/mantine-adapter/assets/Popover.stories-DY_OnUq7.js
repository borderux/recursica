import{f as B,j as e}from"./iframe-CPRD1BZ_.js";import{P as h}from"./Popover-B2oDpEK1.js";import{B as v}from"./Button-Cip-dCT5.js";import{T as w}from"./Text-CAypzHJq.js";import{S as D}from"./Stack-D0BVSXJo.js";import"./preload-helper-Dp1pzeXC.js";import"./OptionalPortal-BH0pv5qp.js";import"./is-element-MCYbaCYi.js";import"./index-DZtT_QSa.js";import"./index-DCSwIWTv.js";import"./factory-DllH8HeB.js";import"./use-merged-ref-DmCu7ozy.js";import"./get-size-lAorsOFx.js";import"./use-resolved-styles-api-SdunH-DR.js";import"./DirectionProvider-CPEYBNBb.js";import"./get-floating-position-qcVOavJx.js";import"./FocusTrap-Bzyxp8Ra.js";import"./use-reduced-motion-Be97HhIq.js";import"./polymorphic-factory-cyn4qPiC.js";import"./Transition-tlfS5Czj.js";import"./create-safe-context-DSDxV5O1.js";import"./use-uncontrolled-UGsVvTVK.js";import"./use-id-Daj1AFU7.js";import"./Loader-DvAuwtdx.js";import"./UnstyledButton-DZIk5CDo.js";import"./Text-BaLAlZtB.js";const L="Popover-module__dropdown___svhS6",W="Popover-module__arrow___5A-0e",P={dropdown:L,arrow:W},N=function({overStyled:t=!1,withBeak:r=!0,...p}){const a=B(p,t),i={dropdown:P.dropdown,arrow:P.arrow},d=a.classNames;if(d&&typeof d=="object"&&!Array.isArray(d)){const u=d;Object.keys(u).forEach(s=>{i[s]?i[s]=`${i[s]} ${u[s]}`:i[s]=u[s]})}const z=a.arrowSize??16,I=a.withArrow,O=r??I;return e.jsx(h,{position:"top",arrowSize:z,withArrow:O,classNames:i,...a})};N.displayName="Popover";const S=function(t){return e.jsx(h.Target,{...t})};S.displayName="PopoverTarget";const A=function({overStyled:t=!1,...r}){const p=B(r,t),a=p.className;return e.jsx(h.Dropdown,{className:a,...p})};A.displayName="PopoverDropdown";const o=N;o.Target=S;o.Dropdown=A;try{o.displayName="Popover",o.__docgenInfo={description:"",displayName:"Popover",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Popover/Popover.tsx",methods:[],props:{disabled:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/components/Popover/Popover.d.ts",name:"__PopoverProps"},{fileName:"recursica/node_modules/@mantine/core/lib/components/Popover/Popover.d.ts",name:"__PopoverProps"}],description:"If set, popover dropdown will not be rendered",name:"disabled",parent:{fileName:"recursica/node_modules/@mantine/core/lib/components/Popover/Popover.d.ts",name:"__PopoverProps"},required:!1,tags:{},type:{name:"boolean | undefined"}},withBeak:{defaultValue:{value:"true"},declarations:[{fileName:"mantine-adapter/src/components/Popover/Popover.tsx",name:"RecursicaPopoverProps"},{fileName:"mantine-adapter/src/components/Popover/Popover.tsx",name:"RecursicaPopoverProps"}],description:"Whether to display a beak (arrow) pointing from the dropdown to the target.\nThis is the Recursica equivalent of Mantine's `withArrow`.\nWhen both `withBeak` and `withArrow` are provided, `withBeak` takes precedence.",name:"withBeak",parent:{fileName:"mantine-adapter/src/components/Popover/Popover.tsx",name:"RecursicaPopoverProps"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const de={title:"UI-Kit/Popover",component:o,tags:["autodocs"],parameters:{docs:{description:{component:"The `Popover` component is a composable wrapper around Mantine's Popover. It displays a dropdown panel when the user clicks or interacts with a target element."}}},argTypes:{withBeak:{control:"boolean",description:"Whether to display a beak (arrow) pointing from the dropdown to the target."},position:{control:"select",options:["top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"],description:"Dropdown position relative to target"},defaultOpened:{control:"boolean",description:"Initial opened state"}}},c={args:{withBeak:!0,position:"top"},render:({withLayer:n,layer:t,...r})=>e.jsxs(o,{width:250,...r,children:[e.jsx(o.Target,{children:e.jsx(v,{variant:"solid",children:"Toggle Popover"})}),e.jsx(o.Dropdown,{children:e.jsx(w,{size:"rec-sm",children:"This is the popover content. It can contain any elements you want to display when the user clicks the target."})})]})},l={args:{withBeak:!0,position:"top",defaultOpened:!0},parameters:{controls:{disable:!0}},render:({withLayer:n,layer:t,...r})=>e.jsx(D,{align:"center",justify:"center",style:{padding:"100px"},children:e.jsxs(o,{width:200,...r,children:[e.jsx(o.Target,{children:e.jsx(v,{variant:"solid",children:"Toggle Popover"})}),e.jsx(o.Dropdown,{children:e.jsx(w,{size:"rec-sm",children:"This is a static representation of an opened popover with a beak."})})]})})},m={args:{withBeak:!1,position:"bottom",defaultOpened:!0},parameters:{controls:{disable:!0}},render:({withLayer:n,layer:t,...r})=>e.jsx(D,{align:"center",justify:"center",style:{padding:"100px"},children:e.jsxs(o,{width:200,...r,children:[e.jsx(o.Target,{children:e.jsx(v,{variant:"outline",children:"Bottom Popover"})}),e.jsx(o.Dropdown,{children:e.jsx(w,{size:"rec-sm",children:"This popover is positioned at the bottom and has no beak."})})]})})};var g,f,y;c.parameters={...c.parameters,docs:{...(g=c.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    withBeak: true,
    position: "top"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PopoverStoryArgs) => {
    return <Popover width={250} {...args}>
        <Popover.Target>
          <Button variant="solid">Toggle Popover</Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="rec-sm">
            This is the popover content. It can contain any elements you want to
            display when the user clicks the target.
          </Text>
        </Popover.Dropdown>
      </Popover>;
  }
}`,...(y=(f=c.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var x,T,b;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    withBeak: true,
    position: "top",
    defaultOpened: true
  },
  parameters: {
    controls: {
      disable: true
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PopoverStoryArgs) => {
    return <Stack align="center" justify="center" style={{
      padding: "100px"
    }}>
        <Popover width={200} {...args}>
          <Popover.Target>
            <Button variant="solid">Toggle Popover</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="rec-sm">
              This is a static representation of an opened popover with a beak.
            </Text>
          </Popover.Dropdown>
        </Popover>
      </Stack>;
  }
}`,...(b=(T=l.parameters)==null?void 0:T.docs)==null?void 0:b.source}}};var _,j,k;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    withBeak: false,
    position: "bottom",
    defaultOpened: true
  },
  parameters: {
    controls: {
      disable: true
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PopoverStoryArgs) => {
    return <Stack align="center" justify="center" style={{
      padding: "100px"
    }}>
        <Popover width={200} {...args}>
          <Popover.Target>
            <Button variant="outline">Bottom Popover</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="rec-sm">
              This popover is positioned at the bottom and has no beak.
            </Text>
          </Popover.Dropdown>
        </Popover>
      </Stack>;
  }
}`,...(k=(j=m.parameters)==null?void 0:j.docs)==null?void 0:k.source}}};const ce=["Default","SolidDefault","WithoutBeak"];export{c as Default,l as SolidDefault,m as WithoutBeak,ce as __namedExportsOrder,de as default};
