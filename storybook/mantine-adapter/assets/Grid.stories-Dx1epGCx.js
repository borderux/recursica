import{j as n}from"./iframe-ui3vHneJ.js";import{G as s}from"./Grid-DUbla3sp.js";import{C as m}from"./Card-B5hdKbG3.js";import{T as D}from"./Text-CE9kJIe7.js";import"./preload-helper-Dp1pzeXC.js";import"./factory-Bm8Z26Jt.js";import"./create-safe-context-BRQ5OSXb.js";import"./get-base-value-D77SeWDq.js";import"./get-size-C3KF_bQQ.js";import"./polymorphic-factory-BPOocaz7.js";import"./Paper-DnGi3ko6.js";import"./Text-BJRU9r0k.js";const q={title:"UI-Kit/Grid",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"Grid is a 12-column (by default) responsive grid layout that maps directly to Mantine's Grid/Grid.Col, providing column spans, offsets, ordering, and breakpoint-based visibility."}}},args:{gap:"rec-default",columns:12,grow:!1},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl"],description:"Gap between columns"},columns:{control:"number",description:"Number of columns in each row"},grow:{control:"boolean",description:"Columns in the last row expand to fill available space"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"}}},e=({children:a})=>n.jsx(m,{children:n.jsx(m.Content,{children:n.jsx(D,{children:a})})}),o={render:({withLayer:a,layer:i,...r})=>n.jsxs(s,{...r,children:[n.jsx(s.Col,{span:4,children:n.jsx(e,{children:"span 4"})}),n.jsx(s.Col,{span:4,children:n.jsx(e,{children:"span 4"})}),n.jsx(s.Col,{span:4,children:n.jsx(e,{children:"span 4"})})]})},t={render:({withLayer:a,layer:i,...r})=>n.jsxs(s,{...r,children:[n.jsx(s.Col,{span:{base:12,sm:6,md:3},children:n.jsx(e,{children:"base 12 / sm 6 / md 3"})}),n.jsx(s.Col,{span:{base:12,sm:6,md:3},children:n.jsx(e,{children:"base 12 / sm 6 / md 3"})}),n.jsx(s.Col,{span:{base:12,sm:6,md:3},children:n.jsx(e,{children:"base 12 / sm 6 / md 3"})}),n.jsx(s.Col,{span:{base:12,sm:6,md:3},children:n.jsx(e,{children:"base 12 / sm 6 / md 3"})})]})},l={render:({withLayer:a,layer:i,...r})=>n.jsxs(s,{...r,children:[n.jsx(s.Col,{span:4,offset:4,children:n.jsx(e,{children:"span 4, offset 4"})}),n.jsx(s.Col,{span:4,children:n.jsx(e,{children:"span 4"})})]})},d={args:{grow:!0},render:({withLayer:a,layer:i,...r})=>n.jsxs(s,{...r,children:[n.jsx(s.Col,{span:3,children:n.jsx(e,{children:"span 3"})}),n.jsx(s.Col,{span:3,children:n.jsx(e,{children:"span 3"})}),n.jsx(s.Col,{span:3,children:n.jsx(e,{children:"span 3 (grows to fill row)"})})]})},c={args:{columns:6},render:({withLayer:a,layer:i,...r})=>n.jsxs(s,{...r,children:[n.jsx(s.Col,{span:2,children:n.jsx(e,{children:"span 2 of 6"})}),n.jsx(s.Col,{span:2,children:n.jsx(e,{children:"span 2 of 6"})}),n.jsx(s.Col,{span:2,children:n.jsx(e,{children:"span 2 of 6"})})]})},p={render:({withLayer:a,layer:i,...r})=>n.jsxs(s,{...r,children:[n.jsx(s.Col,{span:6,hiddenFrom:"sm",children:n.jsx(e,{children:"hidden from sm and up"})}),n.jsx(s.Col,{span:6,visibleFrom:"sm",children:n.jsx(e,{children:"visible from sm and up"})})]})};var h,x,u;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Grid {...args}>
      <Grid.Col span={4}>
        <Swatch>span 4</Swatch>
      </Grid.Col>
      <Grid.Col span={4}>
        <Swatch>span 4</Swatch>
      </Grid.Col>
      <Grid.Col span={4}>
        <Swatch>span 4</Swatch>
      </Grid.Col>
    </Grid>
}`,...(u=(x=o.parameters)==null?void 0:x.docs)==null?void 0:u.source}}};var C,w,y;t.parameters={...t.parameters,docs:{...(C=t.parameters)==null?void 0:C.docs,source:{originalSource:`{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Grid {...args}>
      <Grid.Col span={{
      base: 12,
      sm: 6,
      md: 3
    }}>
        <Swatch>base 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
      <Grid.Col span={{
      base: 12,
      sm: 6,
      md: 3
    }}>
        <Swatch>base 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
      <Grid.Col span={{
      base: 12,
      sm: 6,
      md: 3
    }}>
        <Swatch>base 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
      <Grid.Col span={{
      base: 12,
      sm: 6,
      md: 3
    }}>
        <Swatch>base 12 / sm 6 / md 3</Swatch>
      </Grid.Col>
    </Grid>
}`,...(y=(w=t.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};var G,j,f;l.parameters={...l.parameters,docs:{...(G=l.parameters)==null?void 0:G.docs,source:{originalSource:`{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Grid {...args}>
      <Grid.Col span={4} offset={4}>
        <Swatch>span 4, offset 4</Swatch>
      </Grid.Col>
      <Grid.Col span={4}>
        <Swatch>span 4</Swatch>
      </Grid.Col>
    </Grid>
}`,...(f=(j=l.parameters)==null?void 0:j.docs)==null?void 0:f.source}}};var S,g,b;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    grow: true
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Grid {...args}>
      <Grid.Col span={3}>
        <Swatch>span 3</Swatch>
      </Grid.Col>
      <Grid.Col span={3}>
        <Swatch>span 3</Swatch>
      </Grid.Col>
      <Grid.Col span={3}>
        <Swatch>span 3 (grows to fill row)</Swatch>
      </Grid.Col>
    </Grid>
}`,...(b=(g=d.parameters)==null?void 0:g.docs)==null?void 0:b.source}}};var v,L,F;c.parameters={...c.parameters,docs:{...(v=c.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    columns: 6
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Grid {...args}>
      <Grid.Col span={2}>
        <Swatch>span 2 of 6</Swatch>
      </Grid.Col>
      <Grid.Col span={2}>
        <Swatch>span 2 of 6</Swatch>
      </Grid.Col>
      <Grid.Col span={2}>
        <Swatch>span 2 of 6</Swatch>
      </Grid.Col>
    </Grid>
}`,...(F=(L=c.parameters)==null?void 0:L.docs)==null?void 0:F.source}}};var O,R,T;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Grid {...args}>
      <Grid.Col span={6} hiddenFrom="sm">
        <Swatch>hidden from sm and up</Swatch>
      </Grid.Col>
      <Grid.Col span={6} visibleFrom="sm">
        <Swatch>visible from sm and up</Swatch>
      </Grid.Col>
    </Grid>
}`,...(T=(R=p.parameters)==null?void 0:R.docs)==null?void 0:T.source}}};const z=["Default","ResponsiveSpans","Offset","Grow","CustomColumnCount","VisibleHiddenFrom"];export{c as CustomColumnCount,o as Default,d as Grow,l as Offset,t as ResponsiveSpans,p as VisibleHiddenFrom,z as __namedExportsOrder,q as default};
