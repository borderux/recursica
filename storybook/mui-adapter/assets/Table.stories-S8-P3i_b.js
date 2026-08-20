import{j as l}from"./iframe-yFO9_h67.js";import{T as e}from"./Table-BbPyMGtq.js";import"./preload-helper-Dp1pzeXC.js";import"./memoTheme-Cs-mGQPZ.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSvgIcon-Do3FOz5r.js";import"./useSlot-GWIS9v9k.js";import"./mergeSlotProps-BE-kXrtt.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-BP39VcSK.js";import"./ButtonBase-BmmDnOUH.js";import"./useTimeout-DCc5tZ70.js";import"./useEventCallback-Dhf6GR_Y.js";import"./isFocusVisible-B8k4qzLc.js";const E={title:"UI-Kit/Table",component:e,tags:["autodocs"]},t=[{position:6,mass:12.011,symbol:"C",name:"Carbon"},{position:7,mass:14.007,symbol:"N",name:"Nitrogen"},{position:8,mass:15.999,symbol:"O",name:"Oxygen"},{position:9,mass:18.998,symbol:"F",name:"Fluorine"},{position:10,mass:20.18,symbol:"Ne",name:"Neon"}],o={render:()=>{const r=t.map(n=>l.jsxs(e.Row,{children:[l.jsx(e.Cell,{children:n.position}),l.jsx(e.Cell,{children:n.name}),l.jsx(e.Cell,{children:n.symbol}),l.jsx(e.Cell,{children:n.mass})]},n.name));return l.jsx(e.Container,{children:l.jsxs(e,{children:[l.jsx(e.Head,{children:l.jsxs(e.Row,{children:[l.jsx(e.Cell,{children:"Element position"}),l.jsx(e.Cell,{children:"Element name"}),l.jsx(e.Cell,{children:"Symbol"}),l.jsx(e.Cell,{children:"Atomic mass"})]})}),l.jsx(e.Body,{children:r})]})})}};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => {
    const rows = elements.map(element => <Table.Row key={element.name}>
        <Table.Cell>{element.position}</Table.Cell>
        <Table.Cell>{element.name}</Table.Cell>
        <Table.Cell>{element.symbol}</Table.Cell>
        <Table.Cell>{element.mass}</Table.Cell>
      </Table.Row>);
    return <Table.Container>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Element position</Table.Cell>
              <Table.Cell>Element name</Table.Cell>
              <Table.Cell>Symbol</Table.Cell>
              <Table.Cell>Atomic mass</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>{rows}</Table.Body>
        </Table>
      </Table.Container>;
  }
}`,...(m=(a=o.parameters)==null?void 0:a.docs)==null?void 0:m.source}}};const f=["Default"];export{o as Default,f as __namedExportsOrder,E as default};
