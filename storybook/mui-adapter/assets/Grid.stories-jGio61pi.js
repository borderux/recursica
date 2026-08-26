import{j as n}from"./iframe-kI3tYt3h.js";import{G as s}from"./Grid-DGX_bnor.js";import{C as m}from"./Card-CGZBSoSm.js";import{T}from"./Text-oQg2Sae4.js";import"./preload-helper-Dp1pzeXC.js";import"./useTheme-BdD5xnsz.js";import"./isMuiElement-r5LeNDn4.js";import"./styled-Dny31dUr.js";import"./memoTheme-vnNaqsCY.js";import"./useThemeProps-CAR_wr_i.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./Paper-CIilS-JR.js";import"./Typography-CHmlMyx-.js";import"./Typography-DPpL5zmy.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";const B={title:"UI-Kit/Grid",component:s,tags:["autodocs"],parameters:{docs:{description:{component:"Grid is a 12-column (by default) responsive grid layout hand-composed from MUI's Grid, providing column spans, offsets, ordering, and breakpoint-based visibility with the same API as the mantine-adapter's Grid/Grid.Col."}},controls:{include:["children","gap","columns","grow","justify","align"]}},args:{gap:"rec-default",columns:12,grow:!1},argTypes:{gap:{control:"select",options:["rec-none","rec-sm","rec-default","rec-md","rec-lg","rec-xl","rec-2xl"],description:"Gap between columns"},columns:{control:"number",description:"Number of columns in each row"},grow:{control:"boolean",description:"Columns in the last row expand to fill available space"},justify:{control:"select",options:["flex-start","center","flex-end","space-between","space-around"],description:"Justify-content property"},align:{control:"select",options:["flex-start","center","flex-end","stretch"],description:"Align-items property"}}},r=({children:a})=>n.jsx(m,{children:n.jsx(m.Content,{children:n.jsx(T,{children:a})})}),o={render:({withLayer:a,layer:i,...e})=>n.jsxs(s,{...e,children:[n.jsx(s.Col,{span:4,children:n.jsx(r,{children:"span 4"})}),n.jsx(s.Col,{span:4,children:n.jsx(r,{children:"span 4"})}),n.jsx(s.Col,{span:4,children:n.jsx(r,{children:"span 4"})})]})},t={render:({withLayer:a,layer:i,...e})=>n.jsxs(s,{...e,children:[n.jsx(s.Col,{span:{base:12,sm:6,md:3},children:n.jsx(r,{children:"base 12 / sm 6 / md 3"})}),n.jsx(s.Col,{span:{base:12,sm:6,md:3},children:n.jsx(r,{children:"base 12 / sm 6 / md 3"})}),n.jsx(s.Col,{span:{base:12,sm:6,md:3},children:n.jsx(r,{children:"base 12 / sm 6 / md 3"})}),n.jsx(s.Col,{span:{base:12,sm:6,md:3},children:n.jsx(r,{children:"base 12 / sm 6 / md 3"})})]})},l={render:({withLayer:a,layer:i,...e})=>n.jsxs(s,{...e,children:[n.jsx(s.Col,{span:4,offset:4,children:n.jsx(r,{children:"span 4, offset 4"})}),n.jsx(s.Col,{span:4,children:n.jsx(r,{children:"span 4"})})]})},d={args:{grow:!0},render:({withLayer:a,layer:i,...e})=>n.jsxs(s,{...e,children:[n.jsx(s.Col,{span:3,children:n.jsx(r,{children:"span 3"})}),n.jsx(s.Col,{span:3,children:n.jsx(r,{children:"span 3"})}),n.jsx(s.Col,{span:3,children:n.jsx(r,{children:"span 3 (grows to fill row)"})})]})},c={args:{columns:6},render:({withLayer:a,layer:i,...e})=>n.jsxs(s,{...e,children:[n.jsx(s.Col,{span:2,children:n.jsx(r,{children:"span 2 of 6"})}),n.jsx(s.Col,{span:2,children:n.jsx(r,{children:"span 2 of 6"})}),n.jsx(s.Col,{span:2,children:n.jsx(r,{children:"span 2 of 6"})})]})},p={render:({withLayer:a,layer:i,...e})=>n.jsxs(s,{...e,children:[n.jsx(s.Col,{span:6,hiddenFrom:"sm",children:n.jsx(r,{children:"hidden from sm and up"})}),n.jsx(s.Col,{span:6,visibleFrom:"sm",children:n.jsx(r,{children:"visible from sm and up"})})]})};var h,u,x;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(x=(u=o.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var w,C,y;t.parameters={...t.parameters,docs:{...(w=t.parameters)==null?void 0:w.docs,source:{originalSource:`{
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
}`,...(y=(C=t.parameters)==null?void 0:C.docs)==null?void 0:y.source}}};var G,f,j;l.parameters={...l.parameters,docs:{...(G=l.parameters)==null?void 0:G.docs,source:{originalSource:`{
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
}`,...(j=(f=l.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var S,g,b;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
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
}`,...(F=(L=c.parameters)==null?void 0:L.docs)==null?void 0:F.source}}};var I,O,R;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
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
}`,...(R=(O=p.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};const Q=["Default","ResponsiveSpans","Offset","Grow","CustomColumnCount","VisibleHiddenFrom"];export{c as CustomColumnCount,o as Default,d as Grow,l as Offset,t as ResponsiveSpans,p as VisibleHiddenFrom,Q as __namedExportsOrder,B as default};
